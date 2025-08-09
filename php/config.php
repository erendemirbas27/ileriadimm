<?php
// Site ayarları
define('SITE_URL', 'http://localhost/ileriadim');
define('SITE_NAME', 'İleri Adım');

// Veritabanı ayarları
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ileriadim_db');

// Oturum ayarları
define('SESSION_LIFETIME', 86400); // 24 saat

// Dosya yükleme ayarları
define('UPLOAD_PATH', '../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB

// Hata gösterme ayarları
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>