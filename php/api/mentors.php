<?php
require_once '../db.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

switch ($method) {
    case 'GET':
        // Mentorları listele
        $sql = "SELECT * FROM mentors WHERE status = 'active'";
        $mentors = $db->fetchAll($sql);
        
        // Her mentor için subjects alanını diziye çevir
        foreach ($mentors as &$mentor) {
            $mentor['subjects'] = explode(',', $mentor['subjects']);
        }
        
        echo json_encode($mentors);
        break;
        
    case 'POST':
        // Yeni mentorluk başvurusu oluştur
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Gerekli alanları kontrol et
        $required = ['mentor_id', 'student_id', 'subject', 'message', 'frequency'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field alanı zorunludur"]);
                exit;
            }
        }
        
        // Başvuruyu veritabanına ekle
        $applicationData = [
            'mentor_id' => $data['mentor_id'],
            'student_id' => $data['student_id'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            'frequency' => $data['frequency'],
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        try {
            $applicationId = $db->insert('mentorship_applications', $applicationData);
            
            echo json_encode([
                'success' => true,
                'application_id' => $applicationId,
                'message' => 'Mentorluk başvurunuz başarıyla alındı'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Başvuru sırasında bir hata oluştu: ' . $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>