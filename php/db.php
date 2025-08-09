<?php
require_once 'config.php';

class Database {
    private $connection;
    private static $instance = null;
    
    private function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                )
            );
        } catch (PDOException $e) {
            die("Veritabanı bağlantısı başarısız: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = array()) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            die("Sorgu hatası: " . $e->getMessage());
        }
    }
    
    public function fetchAll($sql, $params = array()) {
        return $this->query($sql, $params)->fetchAll();
    }
    
    public function fetch($sql, $params = array()) {
        return $this->query($sql, $params)->fetch();
    }
    
    public function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        $this->query($sql, $data);
        
        // Son eklenen kaydın ID'sini döndür
        return $this->connection->lastInsertId();
    }
    
    public function update($table, $data, $where) {
        $set = array();
        foreach ($data as $column => $value) {
            $set[] = "$column = :$column";
        }
        $setClause = implode(', ', $set);
        
        $whereClause = array();
        foreach ($where as $column => $value) {
            $whereClause[] = "$column = :where_$column";
        }
        $whereClause = implode(' AND ', $whereClause);
        
        $sql = "UPDATE $table SET $setClause WHERE $whereClause";
        
        $params = array_merge($data, array_combine(
            array_map(function($key) { return "where_$key"; }, array_keys($where)),
            array_values($where)
        ));
        
        return $this->query($sql, $params)->rowCount();
    }
    
    public function delete($table, $where) {
        $whereClause = array();
        foreach ($where as $column => $value) {
            $whereClause[] = "$column = :$column";
        }
        $whereClause = implode(' AND ', $whereClause);
        
        $sql = "DELETE FROM $table WHERE $whereClause";
        return $this->query($sql, $where)->rowCount();
    }
}
?>