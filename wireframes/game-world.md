# Game World Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ 🍌 Banana Runner | Score: 150 | Lives: ❤❤❤ | [Pause] │ ← Top UI Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   🏃 3D Game Area                      │ ← Main Game View
│           🍌      🌳    🍌     🚧                     │
│         ┌─────────────────────────────┐               │
│         │                             │               │
│         │     Player Character        │               │ ← 3D Environment
│         │                             │               │
│         └─────────────────────────────┘               │
│    🍌         🌳        🍌        ❌                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [◀] [▶] [⬆] [▲Jump] | Power-ups: ⚡🛡️ | Combo: x3  │ ← Bottom Controls
└─────────────────────────────────────────────────────────┘
```

## Key Components

### Top UI Overlay
- **Game Title** - Branding consistency
- **Score Counter** - Real-time banana collection
- **Lives/Health** - Visual hearts or health bar
- **Pause Button** - Game state control

### 3D Game Environment
- **Player Character** - Animated runner sprite/model
- **Terrain/Track** - Endless runner path
- **Collectibles** - Bananas to collect
- **Obstacles** - Items to avoid (rocks, trees, barriers)
- **Power-ups** - Special items (speed boost, shield, etc.)

### Bottom Controls & Info
- **Movement Controls** - Left/Right arrows
- **Jump Controls** - Space/Up arrow
- **Power-up Indicators** - Active abilities
- **Combo Counter** - Banana collection streak

## Interactions
1. Touch/Click controls → Player movement
2. Collision detection → Score/health changes
3. Power-up collection → Temporary abilities
4. Pause → Game state overlay menu

## Camera & Perspective
- Third-person view following player
- Smooth camera movement
- Depth perception for 3D obstacles

## Design Notes
- Keep UI minimal during gameplay
- High contrast for readability during action
- Responsive controls for different input methods
- Visual feedback for all interactions