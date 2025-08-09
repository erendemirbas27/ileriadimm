<?php
require_once '../db.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();
$type = isset($_GET['type']) ? $_GET['type'] : 'articles';

switch ($method) {
    case 'GET':
        // İçerikleri listele
        switch ($type) {
            case 'articles':
                $sql = "SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC";
                $articles = $db->fetchAll($sql);
                echo json_encode($articles);
                break;
                
            case 'books':
                $sql = "SELECT * FROM books ORDER BY rating DESC";
                $books = $db->fetchAll($sql);
                echo json_encode($books);
                break;
                
            case 'movies':
                $sql = "SELECT * FROM movies ORDER BY rating DESC";
                $movies = $db->fetchAll($sql);
                echo json_encode($movies);
                break;
                
            case 'podcasts':
                $sql = "SELECT * FROM podcasts WHERE status = 'published' ORDER BY created_at DESC";
                $podcasts = $db->fetchAll($sql);
                echo json_encode($podcasts);
                break;
                
            case 'quotes':
                $sql = "SELECT * FROM quotes ORDER BY RAND() LIMIT 1";
                $quote = $db->fetch($sql);
                echo json_encode($quote);
                break;
                
            case 'news':
                $sql = "SELECT * FROM news WHERE status = 'published' ORDER BY created_at DESC LIMIT 10";
                $news = $db->fetchAll($sql);
                echo json_encode($news);
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid content type']);
                break;
        }
        break;
        
    case 'POST':
        // Yeni içerik ekle (örneğin podcast)
        if ($type === 'podcasts') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Gerekli alanları kontrol et
            $required = ['title', 'host', 'description', 'category', 'duration', 'student_id'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => "$field alanı zorunludur"]);
                    exit;
                }
            }
            
            // Podcast'i veritabanına ekle
            $podcastData = [
                'title' => $data['title'],
                'host' => $data['host'],
                'description' => $data['description'],
                'category' => $data['category'],
                'duration' => $data['duration'],
                'student_id' => $data['student_id'],
                'status' => 'pending',
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            $podcastId = $db->insert('podcasts', $podcastData);
            
            echo json_encode([
                'success' => true,
                'podcast_id' => $podcastId,
                'message' => 'Podcast başvurunuz alındı, onay bekliyor'
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid content type for POST']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>