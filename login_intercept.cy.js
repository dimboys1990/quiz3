describe('OrangeHRM Login Page Test with Intercept', () => {

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  })
 
  it('TC01 - Menampilkan logo perusahaan', () => {
    cy.intercept('GET', '**/core/i18n/messages').as('getMessages')
    cy.reload() // Reload agar intercept terpanggil jika visit di beforeEach sudah lewat
    cy.wait('@getMessages')

    cy.get('img[alt="company-branding"]').should('be.visible')
  })

  it('TC02 - Menampilkan judul login', () => {
    cy.intercept('GET', '**/core/i18n/messages').as('getMessages')
    cy.reload()
    cy.wait('@getMessages')

    cy.get('.orangehrm-login-title')
      .should('be.visible')
      .and('contain', 'Login')
  })

  it('TC03 - Field username dan password tersedia', () => {
    cy.intercept('GET', '**/core/i18n/messages').as('getMessages')
    cy.reload()
    cy.wait('@getMessages')

    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
  })

  it('TC04 - Login berhasil dengan kredensial valid', () => {
    cy.intercept('POST', '**/auth/validate').as('loginRequest')

    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()

    // Tunggu intercept loginRequest selesai
    cy.wait('@loginRequest').its('response.statusCode').should('equal', 302)

    cy.url().should('include', '/dashboard')
  })

  it('TC05 - Login gagal dengan kredensial tidak valid', () => {
    cy.intercept('POST', '**/auth/validate').as('loginRequest')

    cy.get('input[name="username"]').type('wrongUser')
    cy.get('input[name="password"]').type('wrongPass')
    cy.get('button[type="submit"]').click()

    // Tunggu intercept loginRequest selesai
    cy.wait('@loginRequest')

    cy.contains('Invalid credentials').should('be.visible')
  })

  it('TC06 - Link forgot password dapat diklik', () => {
    cy.intercept('GET', '**/auth/login').as('loginPage')

    cy.get('.orangehrm-login-forgot-header')
      .should('be.visible')
      .click()

    cy.url().should('include', 'requestPasswordResetCode')
  })

  it('TC07 - Menampilkan demo credentials', () => {
    cy.get('.orangehrm-demo-credentials')
      .should('be.visible')
      .and('contain', 'Admin')
  })

})
