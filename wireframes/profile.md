# Profile Page Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ 🍌 Banana Runner | Menu | Play | Leaderboard | Profile │ ← Navigation Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    👤 User Profile                     │ ← Page Title
│                                                         │
│ ┌─────────────────────┐  ┌─────────────────────────────┐ │
│ │   Player Info       │  │     Game Statistics         │ │
│ │                     │  │                             │ │
│ │ 👤 Username         │  │ 🏃 Total Games: 45          │ │
│ │ 📧 email@domain.com │  │ 🍌 Total Bananas: 1,250    │ │
│ │ 🗓️ Joined: Jan 2026  │  │ 🏆 High Score: 350         │ │
│ │ 🎖️ Level: Silver ⭐  │  │ ⏱️ Best Time: 4:32         │ │
│ │                     │  │ 📈 Win Rate: 78%           │ │
│ └─────────────────────┘  └─────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                 🏅 Achievements                     │ │
│ │                                                     │ │
│ │ ✅ First Steps      ✅ Banana Collector            │ │
│ │    Play first game     Collect 100 bananas         │ │
│ │                                                     │ │
│ │ ✅ Speed Runner     🔒 Marathon Master             │ │
│ │    Complete in <5min   Play 100 games              │ │
│ │                                                     │ │
│ │ 🔒 Banana King      🔒 Perfect Runner               │ │
│ │    Collect 1000        No hits in a run            │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                📊 Recent Games                      │ │
│ │                                                     │ │
│ │  Date      │ Score │ Bananas │ Time  │ Result       │ │
│ │ ──────────────────────────────────────────────────  │ │
│ │ Feb 12     │  320  │    45   │ 5:23  │ 🏆 Personal │ │
│ │ Feb 11     │  285  │    38   │ 6:12  │ 👍 Good     │ │
│ │ Feb 11     │  190  │    25   │ 4:45  │ 😐 Average  │ │
│ │ Feb 10     │  410  │    52   │ 7:30  │ 🔥 Amazing  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                    [ Edit Profile ]                    │ ← Action Button
└─────────────────────────────────────────────────────────┘
```

## Key Components

### Player Information Card
- **Username** - Display name with avatar
- **Email** - Account email address
- **Join Date** - Account creation date
- **Current Level** - Achievement level badge

### Game Statistics Card
- **Total Games** - Number of games played
- **Total Bananas** - Lifetime banana collection
- **High Score** - Personal best score
- **Best Time** - Fastest completion time
- **Win Rate** - Success percentage

### Achievements Section
- **Unlocked Achievements** - ✅ Completed badges
- **Locked Achievements** - 🔒 Future goals
- **Progress Indicators** - Visual progress bars
- **Achievement Descriptions** - Clear requirements

### Recent Games History
- **Game Date** - When each game was played
- **Score Achieved** - Points earned per game
- **Bananas Collected** - Items collected per game
- **Completion Time** - Duration of each game
- **Performance Rating** - Visual quality indicator

## Achievement Types

### Progression Based
- **First Steps** - Play your first game
- **Banana Collector** - Collect milestone amounts
- **Marathon Master** - Play many games
- **Speed Runner** - Complete games quickly

### Skill Based
- **Perfect Runner** - No collisions in a run
- **Combo King** - Maintain long collection streaks
- **Distance Master** - Achieve certain distances

### Milestone Based
- **Banana King** - Collect 1000+ bananas
- **Veteran Player** - Long-term engagement
- **High Scorer** - Reach score thresholds

## Interactions
1. Click achievements → Show detailed requirements
2. Hover over stats → Additional information tooltips
3. Click recent games → Replay/analysis view
4. Edit Profile → Account settings modal

## Design Notes
- Card-based layout for organized information
- Visual progress indicators for achievements
- Color coding for performance levels
- Responsive grid system for different screen sizes
- Consistent emoji usage for visual appeal