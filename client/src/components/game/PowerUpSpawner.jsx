import PowerUp from './PowerUp.jsx';

export default function PowerUpSpawner() {
  const powerups = [
    { position: [-1.2, 1, -7], type: 'speed' },
    { position: [1.5, 1.2, -14], type: 'magnet' },
  ];
  return (
    <>
      {powerups.map((p, i) => (
        <PowerUp key={i} position={p.position} type={p.type} />
      ))}
    </>
  );
}
