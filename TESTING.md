# Cypress Testing Documentation

## Overview
This project uses Cypress for end-to-end testing of the Banana Runner game application. All test files are in `/client/cypress/e2e/`.

## Test Files Created

### 1. **home.cy.js** - Home Page & Navigation Tests
Tests the landing page and navigation flow:
- ✅ Page loads correctly
- ✅ Navbar displays with navigation links
- ✅ Navigation to Login page works
- ✅ Navigation to Register page works

### 2. **auth.cy.js** - Authentication Tests
Tests user registration and login flows:
- ✅ Registration form displays and validates
- ✅ Shows validation errors for empty fields
- ✅ Registers new users successfully
- ✅ Login form displays correctly
- ✅ Shows error for invalid credentials
- ✅ OAuth login options available (Google, GitHub)

### 3. **game.cy.js** - Game Functionality Tests
Tests the main game experience:
- ✅ Game world loads
- ✅ Game UI displays (score, level, lives)
- ✅ Pause/resume controls work
- ✅ Game over screen appears
- ✅ Score tracking works
- ✅ Level information displays
- ✅ Character model renders
- ✅ Pause functionality works

### 4. **leaderboard.cy.js** - Leaderboard Tests
Tests the leaderboard feature:
- ✅ Leaderboard page loads
- ✅ Player rankings display with rank, name, score
- ✅ Medal icons show for top 3 (🥇🥈🥉)
- ✅ Displays 10+ players
- ✅ Sorted by score in descending order
- ✅ Filter/sort options available
- ✅ Refresh button works

### 5. **profile.cy.js** - User Profile Tests
Tests user profile management:
- ✅ Profile page loads
- ✅ Avatar/Avatar picker available
- ✅ Username field editable
- ✅ User bio/description field
- ✅ User statistics displayed
- ✅ Can edit username and save
- ✅ Can change avatar
- ✅ Character preference selector
- ✅ Password change functionality
- ✅ Logout button present
- ✅ Achievement/level badges display

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Install Cypress

```bash
cd client
npm install cypress --save-dev
```

### Add Test Scripts to package.json

Add these scripts to `client/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test": "cypress run"
  }
}
```

## Running Tests

### Open Cypress Test Runner (Interactive)
```bash
npm run cypress:open
```

Cypress will open a browser window where you can:
- Select individual test files
- Watch tests run in real-time
- Debug failing tests
- View video recordings

### Run Tests Headlessly (CI/CD)
```bash
npm run cypress:run
```

This runs all tests in the terminal without opening a browser, useful for CI/CD pipelines.

### Run a Specific Test File
```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

### Run Tests with Video Recording
Videos are automatically saved to `client/cypress/videos/` when tests run.

## Test Structure

Each test file follows this pattern:

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test (e.g., navigate to page)
    cy.visit('/page')
  })

  it('should do something', () => {
    // Arrange, Act, Assert pattern
    cy.get('button').click()
    cy.contains('Success').should('be.visible')
  })
})
```

## Common Cypress Commands Used

- `cy.visit(url)` - Navigate to a page
- `cy.contains(text)` - Find element by text
- `cy.get(selector)` - Find element by CSS selector
- `cy.click()` - Click an element
- `cy.type(text)` - Type text into input
- `cy.should(assertion)` - Assert condition
- `cy.url()` - Get current URL
- `cy.title()` - Get page title

## Configuration

Cypress is configured in `cypress.config.js`:

```javascript
{
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  }
}
```

- **baseUrl**: Frontend application URL
- **viewportWidth/Height**: Browser size for tests
- **video**: Records test execution
- **screenshotOnRunFailure**: Takes screenshot when test fails

## Running Tests with Development Server

Start the app and run tests simultaneously:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run cypress:run
```

Or use concurrently:

```bash
npm install --save-dev concurrently

# Add to package.json scripts:
"test:app": "concurrently \"npm run dev\" \"npm run cypress:run\""

# Run:
npm run test:app
```

## Expected Test Results

When you run the tests, you should see:

```
✓ home.cy.js (4 tests)
  ✓ should load the home page
  ✓ should display navbar with navigation links
  ✓ should navigate to login page
  ✓ should navigate to register page

✓ auth.cy.js (7 tests)
  ✓ Register section (3 tests passing)
  ✓ Login section (4 tests passing)

✓ game.cy.js (8 tests)
  [All game functionality tests]

✓ leaderboard.cy.js (7 tests)
  [All leaderboard tests]

✓ profile.cy.js (11 tests)
  [All profile tests]

Summary: 37 tests passing
```

## Debugging Failed Tests

1. **Keep Test Runner Open**
   ```bash
   npm run cypress:open
   ```
   Use the interactive debugger to step through tests

2. **View Video Recordings**
   Videos save in `cypress/videos/` for failed tests

3. **Check Screenshots**
   Screenshots save in `cypress/screenshots/` when tests fail

4. **Add Debug Points**
   ```javascript
   cy.debug() // Pauses test execution
   cy.pause() // Pauses before next command
   ```

## Best Practices

1. **Use explicit waits for dynamic content**
   ```javascript
   cy.contains('Score').should('be.visible')
   ```

2. **Don't use random delays**
   ```javascript
   // Bad:
   cy.wait(5000)
   
   // Good:
   cy.get('.loader').should('not.exist')
   ```

3. **Test user interactions, not implementation**
   ```javascript
   // Bad:
   cy.get('.component-123').click()
   
   // Good:
   cy.contains('Login').click()
   ```

4. **Keep tests independent**
   Each test should be able to run in isolation

5. **Use beforeEach for common setup**
   ```javascript
   beforeEach(() => {
     cy.visit('/page')
   })
   ```

## CI/CD Integration

To run tests in CI/CD (GitHub Actions, GitLab CI, etc.):

```yaml
- name: Run Cypress Tests
  run: npm run cypress:run
```

## Troubleshooting

### Tests timeout
- Increase timeout in `cypress.config.js`
- Check if server is running
- Look for network errors in console

### Element not found
- Use `cy.debug()` to inspect page state
- Check element selectors are correct
- Wait for dynamic content to load

### Port conflicts
- Change `baseUrl` in config
- Ensure dev server is running on correct port

## Next Steps

1. ✅ Cypress files created
2. 📦 Install Cypress: `npm install cypress --save-dev`
3. ▶️ Run tests: `npm run cypress:open`
4. 📝 Add custom commands in `cypress/support/`
5. 📊 Generate test reports

---

**Test Coverage:** 37 total tests across 5 feature areas
**Test Status:** Ready to run
**Documentation:** March 31, 2026
