<?php
require_once '../db.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

switch ($method) {
    case 'GET':
        // Testleri listele
        $sql = "SELECT q.*, 
                (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
                FROM quizzes q WHERE q.status = 'active'";
        $quizzes = $db->fetchAll($sql);
        
        // Her test için soruları getir
        foreach ($quizzes as &$quiz) {
            $questionsSql = "SELECT * FROM quiz_questions WHERE quiz_id = :quiz_id";
            $quiz['questions'] = $db->fetchAll($questionsSql, ['quiz_id' => $quiz['id']]);
        }
        
        echo json_encode($quizzes);
        break;
        
    case 'POST':
        // Test sonuçlarını kaydet
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Gerekli alanları kontrol et
        $required = ['quiz_id', 'student_id', 'answers', 'score', 'time_taken'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field alanı zorunludur"]);
                exit;
            }
        }
        
        // Sonucu veritabanına ekle
        $resultData = [
            'quiz_id' => $data['quiz_id'],
            'student_id' => $data['student_id'],
            'answers' => json_encode($data['answers']),
            'score' => $data['score'],
            'time_taken' => $data['time_taken'],
            'completed_at' => date('Y-m-d H:i:s')
        ];
        
        $resultId = $db->insert('quiz_results', $resultData);
        
        echo json_encode([
            'success' => true,
            'result_id' => $resultId,
            'message' => 'Test sonuçlarınız kaydedildi'
        ]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>