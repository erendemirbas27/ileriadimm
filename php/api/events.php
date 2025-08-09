<?php
require_once '../db.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

switch ($method) {
    case 'GET':
        // Etkinlikleri listele
        $sql = "SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC";
        $events = $db->fetchAll($sql);
        echo json_encode($events);
        break;
        
    case 'POST':
        // Yeni etkinlik ekle
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Gerekli alanları kontrol et
        $required = ['title', 'date', 'time', 'location', 'category', 'description'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field alanı zorunludur"]);
                exit;
            }
        }
        
        // Etkinliği veritabanına ekle
        $eventData = [
            'title' => $data['title'],
            'date' => $data['date'],
            'time' => $data['time'],
            'location' => $data['location'],
            'category' => $data['category'],
            'description' => $data['description'],
            'created_by' => isset($data['created_by']) ? $data['created_by'] : 1,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $eventId = $db->insert('events', $eventData);
        
        echo json_encode([
            'success' => true,
            'event_id' => $eventId,
            'message' => 'Etkinlik başarıyla eklendi'
        ]);
        break;
        
    case 'PUT':
        // Etkinlik güncelleme
        parse_str(file_get_contents("php://input"), $data);
        $eventId = isset($data['id']) ? $data['id'] : null;
        
        if (!$eventId) {
            http_response_code(400);
            echo json_encode(['error' => 'Event ID is required']);
            exit;
        }
        
        // Etkinliği güncelle
        $updateData = [];
        $allowedFields = ['title', 'date', 'time', 'location', 'category', 'description'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }
        
        if (empty($updateData)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            exit;
        }
        
        $affectedRows = $db->update('events', $updateData, ['id' => $eventId]);
        
        if ($affectedRows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Etkinlik güncellendi'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
        }
        break;
        
    case 'DELETE':
        // Etkinlik silme
        $eventId = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$eventId) {
            http_response_code(400);
            echo json_encode(['error' => 'Event ID is required']);
            exit;
        }
        
        $affectedRows = $db->delete('events', ['id' => $eventId]);
        
        if ($affectedRows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Etkinlik silindi'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>