# Authentication Wireframes

## Login Page

```
┌─────────────────────────────────────┐
│                                     │
│         🍌 Banana Runner            │ ← Branding
│                                     │
│           ┌─────────┐              │
│           │  Login  │              │ ← Page Title
│           └─────────┘              │
│                                     │
│    ┌─────────────────────────┐     │
│    │     Email Address       │     │ ← Input Fields
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │       Password          │     │
│    └─────────────────────────┘     │
│                                     │
│         [  Login  ]                 │ ← Primary Action
│                                     │
│   Don't have an account?            │
│      Register here                  │ ← Link to Register
│                                     │
│      [Error message area]           │ ← Error Display
└─────────────────────────────────────┘
```

## Register Page

```
┌─────────────────────────────────────┐
│                                     │
│         🍌 Banana Runner            │ ← Branding
│                                     │
│          ┌──────────┐               │
│          │ Register │               │ ← Page Title
│          └──────────┘               │
│                                     │
│    ┌─────────────────────────┐     │
│    │      Username           │     │ ← Input Fields
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │     Email Address       │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │       Password          │     │
│    └─────────────────────────┘     │
│                                     │
│         [ Register ]                │ ← Primary Action
│                                     │
│    Already have an account?         │
│         Login here                  │ ← Link to Login
│                                     │
│      [Success/Error messages]       │ ← Feedback Area
└─────────────────────────────────────┘
```

## Key Components

### Form Elements
- **Text Inputs** - Email, username, password fields
- **Validation** - Real-time input validation
- **Submit Buttons** - Clear primary actions
- **Navigation Links** - Switch between login/register

### Feedback Systems
- **Error Messages** - Clear error communication
- **Success States** - Confirmation of successful actions
- **Loading States** - Processing indicators

### Branding
- **Consistent Header** - Game title and banana emoji
- **Color Scheme** - Match main game theme
- **Typography** - Readable, game-appropriate fonts

## Interactions
1. Form validation on input blur
2. Submit button activation when form valid
3. Toggle between login/register modes
4. Error display and clearing
5. Success redirect to main menu

## Design Notes
- Simple, clean form design
- Mobile-responsive layout
- Clear visual hierarchy
- Accessible form labels and validation
- Consistent with game's visual style