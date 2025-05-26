<?php
class User
{
    private $conn;
    private $table = 'admins_users';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create a new user
    public function create($name, $email, $role, $password, $number)
    {
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
        $stmt->bindParam(':number', $number);

        return $stmt->execute();
    }

    // Find user by email
    public function findByEmail($email)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Login function
    public function login($email, $password)
    {
        $user = $this->findByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            // Remove password from result for safety
            unset($user['password']);
            return $user; // return user data (without password) if login is successful
        }

        return false; // login failed
    }
}
