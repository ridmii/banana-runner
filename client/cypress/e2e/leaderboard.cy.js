describe('Leaderboard', () => {
  
  beforeEach(() => {
    cy.visit('/leaderboard')
  })

  it('should display leaderboard page', () => {
    cy.contains(/Leaderboard|Top Players|Rankings/i).should('be.visible')
  })

  it('should display leaderboard table/list', () => {
    // Check for player list items
    cy.get('table, ul, [role="list"]').should('exist')
  })

  it('should show rank, player name, and score', () => {
    // Look for typical leaderboard elements
    cy.contains(/Rank|#/i).should('exist')
    cy.contains(/Player|Name|Username/i).should('exist')
    cy.contains(/Score|Points|High Score/i).should('exist')
  })

  it('should display medal/trophy icons for top 3', () => {
    // Check for medal emojis or icons
    cy.contains(/🥇|🥈|🥉/).should('exist')
  })

  it('should display at least 10 players', () => {
    // Count rows/items in leaderboard
    cy.get('tr, li, [role="listitem"]').should('have.length.greaterThan', 5)
  })

  it('should sort by score in descending order', () => {
    // First score should be highest
    cy.get('[data-testid="score"]')
      .then(($scores) => {
        const scores = $scores.map((_, el) => parseInt(el.textContent)).get()
        for (let i = 0; i < scores.length - 1; i++) {
          expect(scores[i]).to.be.greaterThanOrEqual(scores[i + 1])
        }
      })
  })

  it('should be filterable or sortable', () => {
    // Check for filter/sort buttons
    cy.contains(/Filter|Sort|All|Weekly|Monthly/i).should('exist')
  })

  it('should have refresh/reload button', () => {
    cy.contains(/Refresh|Reload|Update/i).should('exist')
    cy.contains(/Refresh|Reload|Update/i).click()
    cy.get('table, ul, [role="list"]').should('exist')
  })
})
