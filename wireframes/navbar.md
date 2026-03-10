# Navigation Bar Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🍌 Banana Runner    │ Menu │ Play │ Leaderboard │ Profile │ Hi, User │ Logout │
│                     │      │      │             │         │          │        │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Left Section - Branding
```
┌─────────────────┐
│ 🍌 Banana Runner │ ← Game Title/Logo
└─────────────────┘
```

### Center Section - Navigation Links
```
┌──────────────────────────────────────┐
│ Menu │ Play │ Leaderboard │ Profile │ ← Navigation Links
└──────────────────────────────────────┘
```

### Right Section - User Actions
```
┌─────────────────────┐
│ Hi, Username │ Logout │ ← User Info & Actions
└─────────────────────┘
```

## Responsive Behavior

### Desktop (Full Width)
- All elements visible in horizontal layout
- Links have hover effects
- User greeting shows full username

### Tablet (Medium Width)
- Navigation links remain visible
- User greeting may truncate long names
- Maintains horizontal layout

### Mobile (Narrow Width)
```
┌─────────────────────┐
│ 🍌    [☰]    [User] │ ← Collapsed to hamburger menu
└─────────────────────┘
```

## Key Components

### Brand Element
- **Logo/Icon** - Banana emoji consistent with theme
- **Title Text** - "Banana Runner" game name
- **Click Behavior** - Navigate to home/menu

### Navigation Links
- **Menu** - Main menu/dashboard
- **Play** - Direct to game
- **Leaderboard** - Rankings page
- **Profile** - User account page

### User Section
- **Greeting** - "Hi, [Username]"
- **Logout Button** - Clear session and redirect

## States & Interactions

### Link States
- **Default** - Normal link appearance
- **Hover** - Highlighted/underlined
- **Active** - Current page indicator
- **Disabled** - If access restricted

### User Authentication
- **Logged In** - Show user greeting and logout
- **Not Logged In** - Show login button instead

## Design Notes
- Fixed position at top of viewport
- Consistent across all pages
- Clear visual hierarchy
- Accessible navigation for screen readers
- Mobile-first responsive design
- Smooth transitions between states

## Implementation Notes
- Use React Router for navigation
- AuthContext for user state
- CSS flexbox for layout
- Media queries for responsive behavior