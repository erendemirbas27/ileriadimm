-- Veritabanı oluşturma
CREATE DATABASE IF NOT EXISTS ileriadim_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ileriadim_db;

-- Kullanıcılar tablosu
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    school VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    role ENUM('student', 'mentor', 'admin') DEFAULT 'student',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    avatar VARCHAR(255) DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mentorlar tablosu
CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department VARCHAR(100) NOT NULL,
    subjects TEXT NOT NULL,
    bio TEXT,
    rating DECIMAL(3,1) DEFAULT 0.0,
    reviews INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mentorluk başvuruları tablosu
CREATE TABLE mentorship_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT NOT NULL,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    frequency ENUM('weekly', 'biweekly', 'monthly') NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Makaleler tablosu
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    views INT DEFAULT 0,
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kitaplar tablosu
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    year INT DEFAULT NULL,
    rating DECIMAL(3,1) DEFAULT 0.0,
    reviews INT DEFAULT 0,
    cover VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Filmler tablosu
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(20) NOT NULL,
    rating DECIMAL(3,1) DEFAULT 0.0,
    reviews INT DEFAULT 0,
    poster VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Podcast'ler tablosu
CREATE TABLE podcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    host VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    audio_file VARCHAR(255) DEFAULT NULL,
    student_id INT NOT NULL,
    status ENUM('published', 'pending', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sözler tablosu
CREATE TABLE quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Haberler tablosu
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testler tablosu
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    duration INT NOT NULL COMMENT 'Süre (dakika)',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Test soruları tablosu
CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    points INT DEFAULT 1,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Test sonuçları tablosu
CREATE TABLE quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    answers JSON NOT NULL,
    score INT NOT NULL,
    time_taken INT NOT NULL COMMENT 'Süre (saniye)',
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Etkinlikler tablosu
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category ENUM('education', 'career', 'social', 'competition') NOT NULL,
    description TEXT NOT NULL,
    created_by INT NOT NULL,
    status ENUM('active', 'cancelled') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Projeler tablosu
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    student_id INT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    file VARCHAR(255) DEFAULT NULL,
    status ENUM('published', 'draft') DEFAULT 'published',
    views INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Kulüpler tablosu
CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    school VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kulüp üyeleri tablosu
CREATE TABLE club_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('member', 'admin') DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (club_id, user_id)
);

-- Kullanıcı listeleri tablosu (kitap, film, podcast için)
CREATE TABLE user_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('book', 'movie', 'podcast') NOT NULL,
    item_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, item_type, item_id)
);

-- Favoriler tablosu (sözler için)
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quote_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, quote_id)
);

-- Bildirimler tablosu
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Örnek veriler ekleme
-- Admin kullanıcısı
INSERT INTO users (name, email, password, school, grade, role) VALUES
('Admin', 'admin@ileriadim.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'İleri Adım Üniversitesi', 'Admin', 'admin');

-- Örnek mentorlar
INSERT INTO users (name, email, password, school, grade, role) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Boğaziçi Üniversitesi', '4. Sınıf', 'student'),
('Ayşe Kaya', 'ayse@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ODTÜ', 'Mezun', 'student'),
('Mehmet Demir', 'mehmet@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sabancı Üniversitesi', '3. Sınıf', 'student');

INSERT INTO mentors (user_id, department, subjects, bio, rating, reviews) VALUES
(2, 'Bilgisayar Mühendisliği', 'Matematik,Programlama,Algoritma', '3 yıldır öğrencilere matematik ve programlama konusunda mentorluk yapıyorum.', 4.8, 24),
(3, 'Elektronik Mühendisliği', 'Fizik,Elektronik,Devre Tasarımı', 'Elektronik mühendisliği mezunuyum. Özellikle fizik ve devre tasarımı konusunda tecrübelerimi paylaşabilirim.', 4.7, 18),
(4, 'İşletme', 'İktisat,Finans,Pazarlama', 'İşletme bölümü 3. sınıf öğrencisiyim. Staj ve kariyer planlama konusunda deneyimlerimi paylaşabilirim.', 4.5, 12);

-- Örnek içerikler
INSERT INTO articles (title, content, summary, author, category, image, views) VALUES
('Zaman Yönetimi Teknikleri', 'Zaman yönetimi hakkında detaylı içerik...', 'Öğrenciler için etkili zaman yönetimi stratejileri', 'Dr. Selin Aksoy', 'Zaman Yönetimi', 'article1.jpg', 1240),
('Verimli Ders Çalışma Yöntemleri', 'Çalışma yöntemleri hakkında detaylı içerik...', 'Bilimsel olarak kanıtlanmış çalışma teknikleri', 'Prof. Dr. Ahmet Yılmaz', 'Verimli Ders Çalışma Teknikleri', 'article2.jpg', 980);

INSERT INTO quotes (text, author, category) VALUES
('Eğitim, insanın içindeki potansiyeli ortaya çıkarma sanatıdır.', 'Aristotle', 'Eğitim'),
('Öğrenmenin sınırı yoktur, sadece öğrenme isteği vardır.', 'Konfüçyüs', 'Eğitim');

INSERT INTO books (title, author, description, category, year, rating, reviews, cover) VALUES
('Zihinlerin Felsefesi', 'Steven Pinker', 'İnsan zihninin nasıl çalıştığına dair bilimsel bir keşif', 'Bilim', 2021, 4.5, 128, 'book1.jpg'),
('Sıfırdan Bir', 'Peter Thiel', 'Yenilikçi düşünce ve startup kültürü üzerine', 'İşletme', 2019, 4.3, 95, 'book2.jpg');

INSERT INTO events (title, date, time, location, category, description, created_by) VALUES
('Eğitim Fuarı', '2023-06-25', '10:00:00', 'İstanbul Kongre Merkezi', 'education', 'Üniversitelerin ve eğitim kurumlarının katılımıyla gerçekleşen eğitim fuarı', 1),
('Kariyer Planlama Semineri', '2023-07-02', '14:00:00', 'Online', 'career', 'Öğrencilere yönelik kariyer planlama semineri', 1);