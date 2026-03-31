describe('Authentication Flow', () => {
  
  describe('Register', () => {
    beforeEach(() => {
      cy.visit('/register')
    })

    it('should display registration form', () => {
      cy.get('input[placeholder*="Username"]').should('exist')
      cy.get('input[placeholder*="Email"]').should('exist')
      cy.get('input[placeholder*="Password"]').should('exist')
      cy.contains('Register').should('exist')
    })

    it('should show validation errors for empty fields', () => {
      cy.contains('Register').click()
      cy.contains(/error|required|field/i).should('be.visible')
    })

    it('should successfully register a new user', () => {
      const uniqueEmail = `test${Date.now()}@example.com`
      
      cy.get('input[placeholder*="Username"]').type('TestUser123')
      cy.get('input[placeholder*="Email"]').type(uniqueEmail)
      cy.get('input[placeholder*="Password"]').type('Password123!')
      cy.get('input[placeholder*="Confirm"]').type('Password123!')
      
      cy.contains('Register').click()
      
      // Should redirect to login or show success
      cy.url().should('not.include', '/register')
    })
  })

  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('should display login form', () => {
      cy.get('input[type="email"]').should('exist')
      cy.get('input[type="password"]').should('exist')
      cy.contains('Sign In').should('exist')
    })

    it('should show error for invalid credentials', () => {
      cy.get('input[type="email"]').type('wrong@example.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.contains('Sign In').click()
      
      cy.contains(/error|invalid|failed/i).should('be.visible')
    })

    it('should have OAuth login options', () => {
      cy.contains(/Google|GitHub/i).should('exist')
    })
  })
})
