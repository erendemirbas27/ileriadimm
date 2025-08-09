export default class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Modal elementleri
        this.loginModal = document.getElementById('loginModal');
        this.registerModal = document.getElementById('registerModal');
        this.forgotPasswordModal = document.getElementById('forgotPasswordModal');
        
        // Form elementleri
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.forgotPasswordForm = document.getElementById('forgotPasswordForm');
        
        // Butonlar
        this.showRegisterForm = document.getElementById('showRegisterForm');
        this.showLoginForm = document.getElementById('showLoginForm');
        this.forgotPasswordLink = document.getElementById('forgotPasswordLink');
        this.backToLogin = document.getElementById('backToLogin');
        
        // Close butonları
        this.closeBtns = document.querySelectorAll('.close');
        
        // Event listeners
        this.setupEventListeners();
        
        // Kullanıcı oturumunu kontrol et
        this.checkSession();
        
        // Giriş butonunu sidebar'da kontrol et
        this.setupLoginButton();
        
        // Hero butonlarını kontrol et
        this.setupHeroButtons();
    }

    setupEventListeners() {
        // Modal açma/kapama
        this.showRegisterForm.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(this.registerModal);
            this.closeModal(this.loginModal);
        });
        
        this.showLoginForm.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(this.loginModal);
            this.closeModal(this.registerModal);
        });
        
        this.forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(this.forgotPasswordModal);
            this.closeModal(this.loginModal);
        });
        
        this.backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(this.loginModal);
            this.closeModal(this.forgotPasswordModal);
        });
        
        // Close butonları
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(this.loginModal);
                this.closeModal(this.registerModal);
                this.closeModal(this.forgotPasswordModal);
            });
        });
        
        // Modal dışına tıklayınca kapatma
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
        
        // Form gönderimleri
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        this.forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    setupLoginButton() {
        // Sidebar'daki giriş butonu
        const loginBtn = document.getElementById('showLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(this.loginModal);
            });
        }
    }

    setupHeroButtons() {
        // Hero butonları
        const startBtn = document.getElementById('heroStartBtn');
        const exploreBtn = document.getElementById('heroExploreBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.openModal(this.loginModal);
            });
        }
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                // Keşfet butonu - scroll to features
                document.querySelector('.features').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }
    }

    openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    async handleLogin() {
        const formData = new FormData(this.loginForm);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('php/api/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
                this.closeModal(this.loginModal);
                this.showNotification('Giriş başarılı!', 'success');
                
                // Sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showNotification(result.error || 'Giriş başarısız', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Bir hata oluştu', 'error');
        }
    }

    async handleRegister() {
        const formData = new FormData(this.registerForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            school: formData.get('school'),
            grade: formData.get('grade')
        };
        
        // Şifre kontrolü
        if (data.password !== data.confirmPassword) {
            this.showNotification('Şifreler eşleşmiyor', 'error');
            return;
        }
        
        try {
            const response = await fetch('php/api/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.closeModal(this.registerModal);
                this.showNotification('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
                this.openModal(this.loginModal);
            } else {
                this.showNotification(result.error || 'Kayıt başarısız', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showNotification('Bir hata oluştu', 'error');
        }
    }

    async handleForgotPassword() {
        const formData = new FormData(this.forgotPasswordForm);
        const data = {
            email: formData.get('email')
        };
        
        try {
            const response = await fetch('php/api/auth.php?action=forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.closeModal(this.forgotPasswordModal);
                this.showNotification('Şifre yenileme linki e-posta adresinize gönderildi.', 'success');
            } else {
                this.showNotification(result.error || 'İşlem başarısız', 'error');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showNotification('Bir hata oluştu', 'error');
        }
    }

    async logout() {
        try {
            const response = await fetch('php/api/auth.php?action=logout', {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = null;
                this.updateUI();
                this.showNotification('Çıkış yapıldı', 'success');
                
                // Sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Bir hata oluştu', 'error');
        }
    }

    updateUI() {
        const userProfile = document.querySelector('.user-profile');
        
        if (this.currentUser) {
            // Kullanıcı giriş yapmış
            userProfile.innerHTML = `
                <img src="https://picsum.photos/seed/user${this.currentUser.id}/40/40.jpg" alt="Profil">
                <div class="user-info">
                    <div class="user-name">${this.currentUser.name}</div>
                    <button class="logout-btn">Çıkış Yap</button>
                </div>
            `;
            
            // Çıkış butonuna event listener ekle
            const logoutBtn = userProfile.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        } else {
            // Kullanıcı giriş yapmamış
            userProfile.innerHTML = `
                <button class="btn btn-primary" id="showLoginBtn">
                    <i class="fas fa-sign-in-alt"></i> Giriş Yap
                </button>
            `;
            
            // Giriş butonuna event listener ekle
            const loginBtn = userProfile.querySelector('#showLoginBtn');
            loginBtn.addEventListener('click', () => {
                this.openModal(this.loginModal);
            });
        }
    }

    async checkSession() {
        try {
            const response = await fetch('php/api/auth.php?action=check-session');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.updateUI();
            } else {
                this.updateUI();
            }
        } catch (error) {
            console.error('Session check error:', error);
            this.updateUI();
        }
    }

    showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notificationContainer.appendChild(notification);
        
        // 5 saniye sonra bildirimi kaldır
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}