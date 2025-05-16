<?php
class User {
    private $conn;
    private $table = 'admins_users';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Now accepts $number
    public function create($name, $email, $role, $password, $number) {
        $query = "INSERT INTO " . $this->table . " (name, email, role, password, number) 
                  VALUES (:name, :email, :role, :password, :number)";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':role', $role);
        
        // Hash the password securely
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $hashedPassword);

        // Bind the phone number
        $stmt->bindParam(':number', $number);

        return $stmt->execute();
    }
}
