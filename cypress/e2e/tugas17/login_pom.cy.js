import loginPage from '../../support/page_objects/LoginPage';

describe('OrangeHRM Login Feature - tugas17 (POM)', () => {
    
    beforeEach(() => {
        loginPage.visit();
    });

    it('TC01 - Login dengan kredensial valid', () => {
        loginPage.login('Admin', 'admin123');
        loginPage.verifyOnDashboard();
    });

    it('TC02 - Login dengan username salah', () => {
        loginPage.login('WrongAdmin', 'admin123');
        loginPage.verifyErrorMessageVisible('Invalid credentials');
    });

    it('TC03 - Login dengan password salah', () => {
        loginPage.login('Admin', 'wrongPass');
        loginPage.verifyErrorMessageVisible('Invalid credentials');
    });

    it('TC04 - Login dengan username kosong', () => {
        loginPage.enterPassword('admin123');
        loginPage.clickLogin();
        loginPage.verifyFieldRequired();
    });

    it('TC05 - Login dengan password kosong', () => {
        loginPage.enterUsername('Admin');
        loginPage.clickLogin();
        loginPage.verifyFieldRequired();
    });
});
