<?php
// Güvenlik fonksiyonları
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Dosya yükleme fonksiyonu
function upload_file($file, $target_dir) {
    $target_file = $target_dir . basename($file["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    
    // Dosya boyutunu kontrol et
    if ($file["size"] > 5242880) { // 5MB
        return ["success" => false, "error" => "Dosya çok büyük"];
    }
    
    // İzin verilen dosya türlerini kontrol et
    $allowed_types = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"];
    if (!in_array($imageFileType, $allowed_types)) {
        return ["success" => false, "error" => "İzin verilmeyen dosya türü"];
    }
    
    // Dosyayı yükle
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        return ["success" => true, "file_path" => $target_file];
    } else {
        return ["success" => false, "error" => "Dosya yüklenemedi"];
    }
}

// Tarih formatlama fonksiyonu
function format_date($date, $format = 'd.m.Y') {
    return date($format, strtotime($date));
}

// Zaman formatlama fonksiyonu
function format_time($time) {
    return date('H:i', strtotime($time));
}

// Metni kısaltma fonksiyonu
function truncate_text($text, $length = 100) {
    if (strlen($text) <= $length) {
        return $text;
    }
    return substr($text, 0, $length) . '...';
}

// Rastgele token oluşturma
function generate_token($length = 32) {
    return bin2hex(openssl_random_pseudo_bytes($length));
}

// Email doğrulama
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// URL doğrulama
function is_valid_url($url) {
    return filter_var($url, FILTER_VALIDATE_URL);
}

// JSON yanıtı gönderme
function send_json_response($success, $data = null, $message = '', $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    if (!empty($message)) {
        $response['message'] = $message;
    }
    
    echo json_encode($response);
    exit;
}

// Hata loglama
function log_error($message, $file = 'error.log') {
    $timestamp = date('Y-m-d H:i:s');
    $log_message = "[$timestamp] $message\n";
    file_put_contents($file, $log_message, FILE_APPEND);
}

// Kullanıcı yetkisini kontrol etme
function check_permission($required_role) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== $required_role) {
        send_json_response(false, null, 'Yetkisiz erişim', 403);
    }
}

// CSRF token oluşturma
function create_csrf_token() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(openssl_random_pseudo_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// CSRF token doğrulama
function verify_csrf_token($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>