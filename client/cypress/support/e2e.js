// Support file for common commands and setup
// cypress/support/e2e.js

// Disable uncaught exception handling for demo purposes
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false
})
