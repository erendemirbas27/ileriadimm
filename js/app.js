import AppController from './controllers/appController.js';
import AuthManager from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // AuthManager'ı başlat
    const authManager = new AuthManager();
    
    // Giriş butonuna tıklayınca login.php'ye yönlendir
    const loginBtn = document.getElementById('showLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.php';
        });
    }
    
    // Uygulama controller'ını oluştur ve başlat
    const appController = new AppController();
    appController.init();
    
    // Global erişim için (geliştirme amaçlı)
    window.app = {
        controller: appController,
        auth: authManager,
        dataModel: appController.dataModel,
        userModel: appController.userModel
    };
    
    console.log('İleri Adım uygulaması başlatıldı');
});

