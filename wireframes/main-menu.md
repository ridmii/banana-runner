# Main Menu Wireframe

## Layout Structure

```
┌─────────────────────────────────────┐
│           🍌 Banana Runner          │ ← Header/Title
├─────────────────────────────────────┤
│                                     │
│        Achievement Levels           │ ← Section Title
│                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │  1  │  │ 🔒  │  │ 🔒  │        │ ← Level Badges
│  │Bronze│  │Silver│ │Gold │        │
│  │ ✅  │  │ 🔒  │  │ 🔒  │        │
│  └─────┘  └─────┘  └─────┘        │
│                                     │
│     [Play]    [Leaderboard]        │ ← Action Buttons
│                                     │
│   Welcome back, Username!           │ ← User Info
│   You've collected X bananas        │
└─────────────────────────────────────┘
```

## Key Components

### Level System Display
- **Bronze Runner** (25 bananas) - Unlocked with checkmark
- **Silver Sprinter** (75 bananas) - Locked with lock icon  
- **Gold Champion** (150 bananas) - Locked with lock icon
- Animated level badges with gradients
- Progress indicators

### Action Buttons
- **Play Button** - Primary CTA, leads to game
- **Leaderboard Button** - Secondary action

### User Progress
- Personalized welcome message
- Total bananas collected display
- Achievement status

## Interactions
1. Click level badges → Show requirements tooltip
2. Click Play → Navigate to game world
3. Click Leaderboard → Navigate to rankings
4. Hover effects on interactive elements

## Design Notes
- Use banana emoji and warm colors
- Animate level badge reveals
- Show locked vs unlocked states clearly
- Responsive layout for different screen sizes