class LoginPage {
    // Selectors
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        loginButton: () => cy.get('button[type="submit"]'),
        errorMessage: () => cy.get('.oxd-alert-content-text'),
        fieldRequiredMessage: () => cy.get('.oxd-input-group__message'),
        forgotPasswordLink: () => cy.get('.orangehrm-login-forgot-header'),
        dashboardHeader: () => cy.get('.oxd-topbar-header-title')
    }

    // Actions
    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    enterUsername(username) {
        if (username) {
            this.elements.usernameInput().type(username);
        }
    }

    enterPassword(password) {
        if (password) {
            this.elements.passwordInput().type(password);
        }
    }

    clickLogin() {
        this.elements.loginButton().click();
    }

    login(username, password) {
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
    }

    // Assertions helpers
    verifyErrorMessageVisible(message) {
        this.elements.errorMessage().should('be.visible').and('contain', message);
    }

    verifyFieldRequired() {
        this.elements.fieldRequiredMessage().should('be.visible').and('contain', 'Required');
    }

    verifyOnDashboard() {
        cy.url().should('include', '/dashboard');
        this.elements.dashboardHeader().should('contain', 'Dashboard');
    }
}

export default new LoginPage();
