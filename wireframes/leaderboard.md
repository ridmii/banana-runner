# Leaderboard Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ 🍌 Banana Runner | Menu | Play | Leaderboard | Profile │ ← Navigation Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│                 🏆 Leaderboard 🏆                      │ ← Page Title
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Rank │ Player     │ Level │ Score │ Bananas │ Time  │ │ ← Table Header
│ ├─────────────────────────────────────────────────────┤ │
│ │  🥇  │ 🐵 Player1  │  👑   │ 1,250 │   150   │ 5:23  │ │ ← Top Player
│ │   1  │            │   3   │       │         │       │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │  🥈  │ 🐱 Player2  │  ⭐   │ 1,100 │   125   │ 6:45  │ │ ← Second Place
│ │   2  │            │   2   │       │         │       │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │  🥉  │ 🐶 Player3  │  ⭐   │   980 │   110   │ 7:12  │ │ ← Third Place
│ │   3  │            │   2   │       │         │       │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │  🏃  │ 👤 You      │  🔰   │   750 │    85   │ 8:30  │ │ ← Current User
│ │   5  │ (Player5)  │   1   │       │         │       │ │   (Highlighted)
│ ├─────────────────────────────────────────────────────┤ │
│ │  🏃  │ 🐼 Player6  │  🔰   │   650 │    70   │ 9:15  │ │ ← Other Players
│ │   6  │            │   1   │       │         │       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│            [ Refresh ] [ Filter by Level ]             │ ← Action Buttons
└─────────────────────────────────────────────────────────┘
```

## Key Components

### Ranking Display
- **Position Icons** - 🥇🥈🥉 for top 3, 🏃 for others
- **Rank Numbers** - Clear numerical position
- **Player Avatars** - Generated animal emojis based on username

### Player Information
- **Player Names** - With current user highlighted as "You"
- **Achievement Levels** - Visual level badges (👑⭐🔰)
- **Performance Metrics** - Score, bananas collected, best time

### Interactive Elements
- **Refresh Button** - Update leaderboard data
- **Filter Options** - Sort by different criteria
- **Responsive Rows** - Hover/selection states

## Data Columns

### Core Metrics
1. **Rank** - Position with icon
2. **Player** - Name with avatar
3. **Level** - Achievement badge
4. **Score** - Total game score
5. **Bananas** - Total bananas collected
6. **Time** - Best completion time

### Visual Hierarchy
- **Top 3 Players** - Special highlighting/colors
- **Current User** - Distinct highlighting
- **Regular Players** - Standard presentation

## Interactions
1. Hover over rows → Highlight effect
2. Click refresh → Update data
3. Click filters → Sort/filter results
4. Responsive scrolling for long lists

## Design Notes
- Clear visual distinction for ranking
- Consistent with game's emoji theme
- Performance data easy to compare
- Current user prominently featured
- Mobile-responsive table design