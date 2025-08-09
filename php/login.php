<?php
require_once 'php/config.php';
require_once 'php/db.php';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giriş Yap - İleri Adım</title>
    
    <!-- CSS Dosyaları -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/login.css">
    
    <!-- JavaScript Dosyaları -->
    <script src="js/login.js" defer></script>
</head>
<body>
    <div class="login-container">
        <div class="login-image">
            <div class="image-overlay">
                <div class="overlay-content">
                    <h1>İleri Adım</h1>
                    <p>Eğitimde Bir Adım Öne Geçin</p>
                </div>
            </div>
        </div>
        
        <div class="login-form-container">
            <div class="login-header">
                <h1>Hoş Geldiniz</h1>
                <p>Hesabınıza giriş yapın veya yeni hesap oluşturun</p>
            </div>
            
            <div class="form-tabs">
                <div class="form-tab active" data-tab="login">
                    <i class="fas fa-sign-in-alt"></i> Giriş Yap
                </div>
                <div class="form-tab" data-tab="register">
                    <i class="fas fa-user-plus"></i> Kayıt Ol
                </div>
            </div>
            
            <!-- Giriş Formu -->
            <div class="form-content active" id="login-form">
                <form id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">
                            <i class="fas fa-envelope"></i> E-posta Adresi
                        </label>
                        <input type="email" id="loginEmail" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="loginPassword">
                            <i class="fas fa-lock"></i> Şifre
                        </label>
                        <input type="password" id="loginPassword" name="password" required>
                        <span class="password-toggle" data-target="loginPassword">
                            <i class="fas fa-eye"></i>
                        </span>
                    </div>
                    
                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox" name="remember" id="rememberMe">
                            <span>Beni hatırla</span>
                        </label>
                        <a href="#" class="forgot-password" id="forgotPasswordLink">
                            Şifremi Unuttum
                        </a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Giriş Yap
                    </button>
                </form>
                
                <div class="social-login">
                    <p>Ya da şunlarla giriş yap</p>
                    <div class="social-buttons">
                        <button type="button" class="social-btn google">
                            <i class="fab fa-google"></i> Google
                        </button>
                        <button type="button" class="social-btn facebook">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Kayıt Formu -->
            <div class="form-content" id="register-form">
                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerName">
                            <i class="fas fa-user"></i> Ad Soyad
                        </label>
                        <input type="text" id="registerName" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerEmail">
                            <i class="fas fa-envelope"></i> E-posta Adresi
                        </label>
                        <input type="email" id="registerEmail" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerPassword">
                            <i class="fas fa-lock"></i> Şifre
                        </label>
                        <input type="password" id="registerPassword" name="password" required>
                        <span class="password-toggle" data-target="registerPassword">
                            <i class="fas fa-eye"></i>
                        </span>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerConfirmPassword">
                            <i class="fas fa-lock"></i> Şifre Tekrar
                        </label>
                        <input type="password" id="registerConfirmPassword" name="confirmPassword" required>
                        <span class="password-toggle" data-target="registerConfirmPassword">
                            <i class="fas fa-eye"></i>
                        </span>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerSchool">
                            <i class="fas fa-school"></i> Okul
                        </label>
                        <input type="text" id="registerSchool" name="school" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerGrade">
                            <i class="fas fa-graduation-cap"></i> Sınıf
                        </label>
                        <select id="registerGrade" name="grade" required>
                            <option value="">Seçiniz</option>
                            <option value="9. Sınıf">9. Sınıf</option>
                            <option value="10. Sınıf">10. Sınıf</option>
                            <option value="11. Sınıf">11. Sınıf</option>
                            <option value="12. Sınıf">12. Sınıf</option>
                            <option value="Mezun">Mezun</option>
                            <option value="1. Sınıf">1. Sınıf</option>
                            <option value="2. Sınıf">2. Sınıf</option>
                            <option value="3. Sınıf">3. Sınıf</option>
                            <option value="4. Sınıf">4. Sınıf</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-user-plus"></i> Kayıt Ol
                    </button>
                </form>
            </div>
            
            <div class="form-footer">
                <p>Zaten hesabınız var mı? 
                    <a href="#" id="showLoginLink">Giriş Yapın</a>
                </p>
            </div>
        </div>
    </div>
    
    <!-- Bildirim Container -->
    <div id="notificationContainer"></div>
</body>
</html>