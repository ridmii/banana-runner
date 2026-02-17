import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import EnvironmentComponent from './Environment.jsx';
import Terrain from './Terrain.jsx';
import Player from './Player.jsx';
import BananaSpawner from './BananaSpawner.jsx';
import ObstacleSpawner from './ObstacleSpawner.jsx';
import PowerUpSpawner from './PowerUpSpawner.jsx';
import UIOverlay from './UIOverlay.jsx';
import ParticleSystem from './ParticleSystem.jsx';
import QuestionOverlay from './QuestionOverlay.jsx';
import LevelUnlockCelebration from './LevelUnlockCelebration.jsx';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getBananaQuestion } from '../../services/bananaService.js';
import { api } from '../../services/api.js';
import { initAudio, playCollect, playError, playSuccess } from '../../utils/sfx.js';
import { gameEvents } from '../../utils/events.js';

function GameLoop({ running, paused, onTick }) {
  useFrame((_, delta) => {
    if (running && !paused) onTick(delta);
  });
  return null;
}

function CameraRig({ playerX }) {
  const { camera } = useThree();
  const target = new Vector3();
  useFrame((_, delta) => {
    // Desired camera position: slightly right/left with player, higher and behind
    const desired = new Vector3(playerX * 1.2, 3.6, 8);
    camera.position.lerp(desired, Math.min(1, 2.0 * delta));
    // Look far ahead down the track
    target.set(playerX, 1.4, -20);
    camera.lookAt(target);
  });
  return null;
}

export default function GameWorld() {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(0);
  const [playerX, setPlayerX] = useState(0); // current lane position
  const [targetX, setTargetX] = useState(0); // lanes: -1,0,1
  const [tilt, setTilt] = useState(0);
  const [playerY, setPlayerY] = useState(1); // base height
  const [velY, setVelY] = useState(0);
  const [isCrouching, setIsCrouching] = useState(false);
  const [crouchTimer, setCrouchTimer] = useState(0);
  const [playerZ] = useState(0); // keep player near origin; move world towards player
  const [bananas, setBananas] = useState([[1, 1, -15], [-1, 1.2, -22], [0.5, 1.1, -30]]);
  const [obstacles, setObstacles] = useState([
    { id: Math.random(), position: [0, 0.4, -6], type: 'rock' },
    { id: Math.random(), position: [1.2, 1.1, -11], type: 'log' },
  ]);
  const [lastSpawnDist, setLastSpawnDist] = useState(0);
  const [distance, setDistance] = useState(0);
  const [question, setQuestion] = useState(null);
  const [character, setCharacter] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lastQuestionImage, setLastQuestionImage] = useState(null);
  const [prefetchedQuestion, setPrefetchedQuestion] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(null);

  // Check for level unlocks based on total bananas
  const checkLevelUnlock = useCallback((totalBananas) => {
    const previousTotal = totalBananas - 1; // Previous total before this banana
    const levels = [
      { level: 1, required: 25 },
      { level: 2, required: 75 },
      { level: 3, required: 150 }
    ];

    for (const levelInfo of levels) {
      if (totalBananas >= levelInfo.required && previousTotal < levelInfo.required) {
        setUnlockedLevel(levelInfo.level);
        break;
      }
    }
  }, []);

  const startRun = () => { setStarted(true); setRunning(true); setPaused(false); setScore(0); setLives(3); setTime(0); setPlayerX(0); setDistance(0); setLastSpawnDist(0); initAudio(); prefetchNext(); };

  const prefetchNext = useCallback(async () => {
    try {
      const q = await getBananaQuestion();
      setPrefetchedQuestion(q);
    } catch (_) {
      // ignore prefetch errors
    }
  }, []);

  // Touch/UI controls
  const onMoveLeft = useCallback(() => {
    if (!running || paused) return;
    setTargetX((x) => Math.max(-1, Math.round(x - 1)));
    setTilt(0.25);
  }, [running, paused]);

  const onMoveRight = useCallback(() => {
    if (!running || paused) return;
    setTargetX((x) => Math.min(1, Math.round(x + 1)));
    setTilt(-0.25);
  }, [running, paused]);

  const onJump = useCallback(() => {
    if (!running || paused) return;
    if (playerY <= 1.001 && !isCrouching) {
      setVelY(8);
    }
  }, [running, paused, playerY, isCrouching]);

  const onSlide = useCallback(() => {
    if (!running || paused) return;
    setIsCrouching(true);
    setCrouchTimer(0.6);
  }, [running, paused]);

  useEffect(() => {
    const onKey = (e) => {
      if (!running || paused) return;
      if (e.key === 'ArrowLeft') {
        setTargetX((x) => Math.max(-1, Math.round(x - 1)));
        setTilt(0.25);
      }
      if (e.key === 'ArrowRight') {
        setTargetX((x) => Math.min(1, Math.round(x + 1)));
        setTilt(-0.25);
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        // jump if grounded and not crouching
        if (playerY <= 1.001 && !isCrouching) {
          setVelY(8);
        }
      }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        // start crouch/slide
        setIsCrouching(true);
        setCrouchTimer(0.6);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, paused, playerY, isCrouching]);

  const tick = useCallback((delta) => {
    const speed = 8; // units per second; world moves towards player
    setTime((t) => t + delta);
    setDistance((d) => d + speed * delta);
    // Smooth lane movement
    setPlayerX((x) => {
      const lerp = (a, b, k) => a + (b - a) * k;
      return lerp(x, targetX, Math.min(1, 8 * delta));
    });
    // Decay tilt back to 0
    setTilt((v) => {
      const decay = 6 * delta;
      const nv = Math.abs(v) < 0.01 ? 0 : v + (v > 0 ? -decay : decay);
      return nv;
    });

    // Jump/Gravity
    setVelY((vyPrev) => {
      const newVy = vyPrev - 20 * delta; // gravity
      setPlayerY((y) => {
        let ny = y + newVy * delta;
        if (ny <= 1) {
          ny = 1;
          // lock to ground
          return 1;
        }
        return ny;
      });
      return newVy;
    });

    // Crouch timer decay
    setCrouchTimer((t) => {
      const nt = Math.max(0, t - delta);
      if (nt === 0 && isCrouching) setIsCrouching(false);
      return nt;
    });

    // ✅ FIXED - Only move collectibles and obstacles (NOT environment objects)
    setBananas((b) => 
      b.map((p) => [p[0], p[1], p[2] + speed * delta])
       .filter((p) => p[2] < 2)
    );
    
    setObstacles((o) => 
      o.map((ob) => ({ 
        ...ob, 
        position: [ob.position[0], ob.position[1], ob.position[2] + speed * delta] 
      })).filter((ob) => ob.position[2] < 2)
    );
    
    // 🔍 DEBUG: Environment objects should NEVER be moved here
    // If you see trees/rocks moving, check that they're not in obstacles array

    // Spawn based on distance
    setLastSpawnDist((lsd) => {
      const interval = 18; // meters between spawns
      let last = lsd;
      const toAddBananas = [];
      const toAddObs = [];
      while (distance - last > interval) {
        const laneB = [-1, 0, 1][Math.floor(Math.random() * 3)];
        toAddBananas.push([laneB, 1 + Math.random() * 0.3, -40]);
        const laneO = [-1, 0, 1][Math.floor(Math.random() * 3)];
        const type = Math.random() > 0.5 ? 'rock' : 'log';
        const oy = type === 'log' ? 1.1 : 0.3;
        toAddObs.push({ id: Math.random(), position: [laneO, oy, -45], type });
        last += interval;
      }
      if (toAddBananas.length) setBananas((b) => [...b, ...toAddBananas]);
      if (toAddObs.length) setObstacles((o) => [...o, ...toAddObs]);
      return last;
    });

    // Collision + collection near playerZ ~ 0
    setBananas((b) => {
      const remaining = [];
      for (const p of b) {
        const dx = Math.abs(p[0] - playerX);
        const dz = Math.abs(p[2] - playerZ);
        if (dx < 0.6 && Math.abs(dz) < 0.8) {
          setScore((s) => {
            try { playCollect(); } catch {}
            const ns = s + 1;
            const total = Number(localStorage.getItem('totalBananas') || '0') + 1;
            localStorage.setItem('totalBananas', String(total));
            
            // Check for level unlock
            checkLevelUnlock(total);
            
            // Update local leaderboard fallback
            try {
              const lb = JSON.parse(localStorage.getItem('leaderboard') || '[]');
              const username = (JSON.parse(localStorage.getItem('authUser') || 'null')?.username) || 'Player';
              lb.push({ username, bananas: total, score: total, ts: Date.now() });
              localStorage.setItem('leaderboard', JSON.stringify(lb.slice(-100)));
            } catch {}
            return ns;
          });
        } else {
          remaining.push(p);
        }
      }
      return remaining;
    });
    for (const ob of obstacles) {
      const dx = Math.abs(ob.position[0] - playerX);
      const dz = Math.abs(ob.position[2] - playerZ);
      if (!paused && dx < 0.7 && Math.abs(dz) < 0.8) {
        // Ability-based avoidance: jump over rocks, slide under logs
        if (ob.type === 'rock' && playerY > 1.4) {
          continue; // jumped over
        }
        if (ob.type === 'log' && isCrouching) {
          continue; // slid under
        }
        setPaused(true);
        setFeedback(null);
        // Remove the collided obstacle to avoid repeated hits
        setObstacles((o) => o.filter((oo) => oo.id !== ob.id));
        (async () => {
          try {
            let q = prefetchedQuestion;
            if (!q) q = await getBananaQuestion();
            setLastQuestionImage(q?.image || null);
            setQuestion(q);
            setPrefetchedQuestion(null);
          } catch (_) {
            setQuestion({ image: null, answer: null });
          }
        })();
        break;
      }
    }
  }, [playerZ, playerX, obstacles, paused, distance, targetX, isCrouching, lastQuestionImage, prefetchedQuestion]);

  const submitAnswer = async (value) => {
    const userAnswer = Number(String(value).trim());
    if (!Number.isFinite(userAnswer)) {
      setFeedback('Please enter a valid number');
      return;
    }
    if (question?.answer == null) {
      setFeedback('Loading a fresh puzzle…');
      try {
        const q = await getBananaQuestion();
        setQuestion(q);
        setFeedback(null);
      } catch (_) {
        setFeedback('Puzzle unavailable, please try again');
      }
      return;
    }
    const correct = userAnswer === Number(question.answer);
    if (correct) {
      try { playSuccess(); } catch {}
      setFeedback('Correct!');
      setTimeout(() => {
        setQuestion(null);
        setFeedback(null);
        setPaused(false);
        prefetchNext();
      }, 600);
    } else {
      try { playError(); } catch {}
      setFeedback('Try again');
    }
  };

  const cancelQuestion = () => {
    setLives((l) => l - 1);
    setQuestion(null);
    setPaused(false);
    prefetchNext();
    if (lives - 1 <= 0) { setRunning(false); setStarted(false); }
  };

  const submitFinalScore = useCallback(async () => {
    try {
      await api.post('/api/game/score', {
        score,
        gameMode: 'solo',
        duration: Math.floor(time),
        bananasCollected: score,
      });
      try { gameEvents.emit('score:saved', { score, bananasCollected: score, duration: Math.floor(time) }); } catch {}
    } catch (_) {
      // swallow errors to avoid crashing UI
    }
  }, [score, time]);

  useEffect(() => {
    if (!running && started === false && score > 0) {
      submitFinalScore();
    }
  }, [running, started]);

  return (
    <div style={{ height: 'calc(100vh - 50px)' }}>
      <Canvas shadows dpr={[1, 2]}>        
        <color attach="background" args={["#87CEEB"]} />
        <CameraRig playerX={playerX} />

        {/* PRODUCTION-READY LIGHTING SYSTEM */}
        <ambientLight intensity={0.3} color="#E6F3FF" />
        <directionalLight 
          position={[15, 25, 15]} 
          intensity={1.0} 
          color="#FFF8DC" 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={100}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-10, 20, 10]} intensity={0.3} color="#B0C4DE" />
        <hemisphereLight intensity={0.4} groundColor="#8B7355" color="#87CEEB" />
        <pointLight position={[0, 8, 6]} intensity={0.5} distance={15} decay={2} />

        {/* CLEAN SCENE ARCHITECTURE - University Project Standard */}
        
        {/* STATIC ENVIRONMENT: Trees, rocks, terrain - NEVER moves */}
        <group name="StaticEnvironment" userData={{ static: true, moveInGameLoop: false }} position={[0, 0, 0]}>
          <fog attach="fog" args={["#87CEEB", 20, 100]} />
          <EnvironmentComponent />
          <Terrain />
        </group>

        {/* DYNAMIC GAMEPLAY: Objects that move toward player */}
        <group name="DynamicGameplay" userData={{ static: false, moveInGameLoop: true }}>
          <BananaSpawner bananas={bananas} />
          <ObstacleSpawner obstacles={obstacles} />
          <PowerUpSpawner />
        </group>

        {/* PLAYER CHARACTER: Controlled by user input */}
        <group name="PlayerCharacter" userData={{ static: false, moveInGameLoop: false }}>
          <Player position={[playerX, playerY, playerZ]} character={character || 'monkey'} tilt={tilt} crouch={isCrouching} />
        </group>

        {/* VISUAL EFFECTS: Particles and atmosphere */}
        <group name="VisualEffects" userData={{ static: false, moveInGameLoop: false }}>
          <ParticleSystem count={300} color="#ffffff" />
        </group>

        <GameLoop running={running} paused={paused} onTick={tick} />

        {/* OrbitControls disabled to prevent touchpad panning over gameplay */}
      </Canvas>
      {/* UI Overlays as pure DOM above Canvas */}
      <UIOverlay
        score={score}
        time={time}
        lives={lives}
        started={started}
        onStart={startRun}
        character={character}
        onSelectCharacter={setCharacter}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
        onJump={onJump}
        onSlide={onSlide}
      />
      {paused && (
        <QuestionOverlay image={question?.image} onSubmit={submitAnswer} onCancel={cancelQuestion} feedback={feedback} />
      )}
      
      {/* Level Unlock Celebration */}
      <LevelUnlockCelebration 
        level={unlockedLevel} 
        onComplete={() => setUnlockedLevel(null)} 
      />
    </div>
  );
}
