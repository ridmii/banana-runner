describe('User Profile', () => {
  
  beforeEach(() => {
    // Assuming user needs to be logged in to access profile
    cy.visit('/profile')
  })

  it('should display profile page', () => {
    cy.contains(/Profile|My Account|User Info/i).should('be.visible')
  })

  it('should display user avatar/avatar picker', () => {
    cy.contains(/Avatar|Profile Picture/i).should('exist')
  })

  it('should display username field', () => {
    cy.contains(/Username/i).should('exist')
    cy.get('input[placeholder*="Username"]').should('exist')
  })

  it('should display user bio/description', () => {
    cy.contains(/Bio|About|Description|Status/i).should('exist')
  })

  it('should display user statistics', () => {
    // Common stats in game profiles
    cy.contains(/High Score|Best Score|Total Score/i).should('exist')
    cy.contains(/Games Played|Level/i).should('exist')
  })

  it('should allow editing username', () => {
    cy.get('input[placeholder*="Username"]')
      .clear()
      .type('NewUsername')
    
    cy.contains(/Save|Update/i).click()
    cy.contains(/Saved|Success/i).should('exist')
  })

  it('should allow changing avatar', () => {
    cy.contains(/Change Avatar|Pick Avatar|Select Avatar/i).click({ force: true })
    cy.get('[role="button"], [role="option"]').first().click()
    cy.contains(/Saved|Success|Updated/i).should('exist')
  })

  it('should display character preference selector', () => {
    cy.contains(/Character|Player Model|Skin/i).should('exist')
  })

  it('should allow changing password', () => {
    cy.contains(/Change Password|Update Password/i).click()
    
    cy.get('input[type="password"]').should('have.length.greaterThan', 1)
    cy.contains(/Confirm|Save|Update/i).click()
  })

  it('should display logout button', () => {
    cy.contains(/Logout|Sign Out|Exit/i).should('exist')
  })

  it('should show user achievement/level badges', () => {
    cy.contains(/Achievement|Badge|Level/i).should('exist')
  })
})
