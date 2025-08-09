// DOM Yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    // Elementleri seç
    const tabs = document.querySelectorAll('.form-tab');
    const contents = document.querySelectorAll('.form-content');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLoginLink = document.getElementById('showLoginLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Sekme değiştirme
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Aktif sekmeleri kaldır
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Yeni aktif sekmeyi ekle
            this.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });
    
    // Şifre göster/gizle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Giriş formu gönderimi
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') || false
        };
        
        // Butonu devre dışı bırak ve loading göster
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Giriş Yapılıyor...';
        
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
                showNotification('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Başarılı girişten sonra ana sayfaya yönlendir
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        } finally {
            // Butonu eski haline getir
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // Kayıt formu gönderimi
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
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
            showNotification('Şifreler eşleşmiyor. Lütfen kontrol edin.', 'error');
            return;
        }
        
        // Şifre gücü kontrolü
        if (data.password.length < 6) {
            showNotification('Şifre en az 6 karakter olmalıdır.', 'error');
            return;
        }
        
        // Butonu devre dışı bırak ve loading göster
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Kaydediliyor...';
        
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
                showNotification('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
                
                // Formu temizle ve giriş formuna geç
                registerForm.reset();
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                }, 1000);
            } else {
                showNotification(result.error || 'Kayıt başarısız. Lütfen tekrar deneyin.', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            showNotification('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        } finally {
            // Butonu eski haline getir
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // Şifremi unuttum
    forgotPasswordLink.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = prompt('Şifre yenileme linki için e-posta adresinizi girin:');
        
        if (email && email.trim()) {
            try {
                const response = await fetch('php/api/auth.php?action=forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email.trim() })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Şifre yenileme linki e-posta adresinize gönderildi.', 'success');
                } else {
                    showNotification(result.error || 'İşlem başarısız.', 'error');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                showNotification('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
            }
        }
    });
    
    // Giriş yap linki
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('[data-tab="login"]').click();
    });
    
    // Sosyal medya butonları (placeholder)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${platform} ile giriş yakında eklenecek!`, 'info');
        });
    });
    
    // Bildirim gösterme fonksiyonu
    function showNotification(message, type = 'info') {
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
    
    // Form validasyonu için gerçek zamanlı kontrol
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
                showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    });
    
    // Şifre gücü göstergesi
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            // Burada şifre gücü göstergesi eklenebilir
        });
    });
    
    // Şifre gücü hesaplama
    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    }
});