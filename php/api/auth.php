<?php
// Hata raporlamayı aç
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../db.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

// Oturumu başlat
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

switch ($method) {
    case 'POST':
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        
        switch ($action) {
            case 'login':
                try {
                    // Giriş işlemi
                    $rawData = file_get_contents('php://input');
                    if ($rawData === false) {
                        throw new Exception('Veri okunamadı');
                    }
                    
                    $data = json_decode($rawData, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        throw new Exception('JSON parse hatası: ' . json_last_error_msg());
                    }
                    
                    if (!isset($data['email']) || !isset($data['password'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Email and password are required']);
                        exit;
                    }
                    
                    // Kullanıcıyı veritabanından kontrol et
                    $sql = "SELECT * FROM users WHERE email = :email AND status = 'active'";
                    $user = $db->fetch($sql, ['email' => $data['email']]);
                    
                    if ($user && password_verify($data['password'], $user['password'])) {
                        // Oturum başlat
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_name'] = $user['name'];
                        $_SESSION['user_email'] = $user['email'];
                        $_SESSION['user_role'] = $user['role'];
                        
                        // Son giriş zamanını güncelle
                        $db->update('users', 
                            ['last_login' => date('Y-m-d H:i:s')], 
                            ['id' => $user['id']]
                        );
                        
                        echo json_encode([
                            'success' => true,
                            'user' => [
                                'id' => $user['id'],
                                'name' => $user['name'],
                                'email' => $user['email'],
                                'role' => $user['role']
                            ]
                        ]);
                    } else {
                        http_response_code(401);
                        echo json_encode(['error' => 'Invalid email or password']);
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Giriş sırasında hata: ' . $e->getMessage()]);
                }
                break;
                
            case 'register':
                try {
                    // Kayıt işlemi
                    $rawData = file_get_contents('php://input');
                    if ($rawData === false) {
                        throw new Exception('Veri okunamadı');
                    }
                    
                    $data = json_decode($rawData, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        throw new Exception('JSON parse hatası: ' . json_last_error_msg());
                    }
                    
                    // Gerekli alanları kontrol et
                    $required = ['name', 'email', 'password', 'school', 'grade'];
                    foreach ($required as $field) {
                        if (!isset($data[$field])) {
                            http_response_code(400);
                            echo json_encode(['error' => "$field alanı zorunludur"]);
                            exit;
                        }
                    }
                    
                    // Email zaten kullanılıyor mu kontrol et
                    $existingUser = $db->fetch("SELECT id FROM users WHERE email = :email", 
                        ['email' => $data['email']]);
                    
                    if ($existingUser) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Bu email adresi zaten kullanılıyor']);
                        exit;
                    }
                    
                    // Yeni kullanıcıyı ekle
                    $userData = [
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'password' => password_hash($data['password'], PASSWORD_DEFAULT),
                        'school' => $data['school'],
                        'grade' => $data['grade'],
                        'role' => 'student',
                        'status' => 'active',
                        'created_at' => date('Y-m-d H:i:s')
                    ];
                    
                    $userId = $db->insert('users', $userData);
                    
                    echo json_encode([
                        'success' => true,
                        'user_id' => $userId,
                        'message' => 'Kayıt başarılı, giriş yapabilirsiniz'
                    ]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Kayıt sırasında hata: ' . $e->getMessage()]);
                }
                break;
                
            case 'logout':
                try {
                    // Çıkış işlemi
                    session_destroy();
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Çıkış yapıldı'
                    ]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Çıkış sırasında hata: ' . $e->getMessage()]);
                }
                break;
                
            case 'forgot-password':
                try {
                    // Şifremi unuttum
                    $rawData = file_get_contents('php://input');
                    if ($rawData === false) {
                        throw new Exception('Veri okunamadı');
                    }
                    
                    $data = json_decode($rawData, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        throw new Exception('JSON parse hatası: ' . json_last_error_msg());
                    }
                    
                    if (!isset($data['email'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Email is required']);
                        exit;
                    }
                    
                    // Kullanıcıyı bul
                    $sql = "SELECT * FROM users WHERE email = :email AND status = 'active'";
                    $user = $db->fetch($sql, ['email' => $data['email']]);
                    
                    if ($user) {
                        // Şifre yenileme token oluştur - random_bytes yerine openssl_random_pseudo_bytes kullan
                        $token = bin2hex(openssl_random_pseudo_bytes(32));
                        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
                        
                        // Token'ı veritabanına kaydet
                        $db->update('users', 
                            ['reset_token' => $token, 'reset_token_expiry' => $expiry], 
                            ['id' => $user['id']]
                        );
                        
                        // Gerçek uygulamada burada e-posta gönderilecek
                        // Şimdilik sadece başarılı mesajı döndür
                        echo json_encode([
                            'success' => true,
                            'message' => 'Şifre yenileme linki e-posta adresinize gönderildi'
                        ]);
                    } else {
                        // Güvenlik için kullanıcı bulunmasa bile aynı mesajı döndür
                        echo json_encode([
                            'success' => true,
                            'message' => 'Şifre yenileme linki e-posta adresinize gönderildi'
                        ]);
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Şifre yenileme sırasında hata: ' . $e->getMessage()]);
                }
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
        break;
        
    case 'GET':
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        
        switch ($action) {
            case 'check-session':
                try {
                    // Oturum kontrolü
                    if (isset($_SESSION['user_id'])) {
                        // Kullanıcı bilgilerini getir
                        $sql = "SELECT id, name, email, role FROM users WHERE id = :id AND status = 'active'";
                        $user = $db->fetch($sql, ['id' => $_SESSION['user_id']]);
                        
                        if ($user) {
                            echo json_encode([
                                'success' => true,
                                'user' => $user
                            ]);
                        } else {
                            // Oturum var ama kullanıcı bulunamadı veya aktif değil
                            session_destroy();
                            echo json_encode(['success' => false]);
                        }
                    } else {
                        echo json_encode(['success' => false]);
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Oturum kontrolü sırasında hata: ' . $e->getMessage()]);
                }
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>