describe('Home Page & Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the home page', () => {
    cy.title().should('include', 'Banana')
  })

  it('should display navbar with navigation links', () => {
    cy.contains('Banana Runner').should('be.visible')
    cy.contains('Login').should('be.visible')
    cy.contains('Register').should('be.visible')
  })

  it('should navigate to login page', () => {
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    cy.contains('Email').should('be.visible')
    cy.contains('Password').should('be.visible')
  })

  it('should navigate to register page', () => {
    cy.contains('Register').click()
    cy.url().should('include', '/register')
    cy.contains('Username').should('be.visible')
  })
})
