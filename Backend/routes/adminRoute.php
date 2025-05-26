<?php
require_once __DIR__ . '/../controller/UserController.php';

$userController = new UserController();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'create') {
        // Get form data
        $name = $_POST['name'];
        $email = $_POST['email'];
        $role = $_POST['role'];
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];
        $number = $_POST['number'];

        // Log the received data for monitoring
        error_log("Received data: name=$name, email=$email, role=$role, number=$number");

        // Check if passwords match
        if ($password !== $confirmPassword) {
            echo json_encode(['status' => 'failed', 'message' => 'Passwords do not match']);
            exit;
        }

        // Check for missing fields
        if (empty($name) || empty($email) || empty($password) || empty($number)) {
            echo json_encode(['status' => 'failed', 'message' => 'Please fill all required fields']);
            exit;
        }

        // ✅ Check if email already exists
        $existingUser = $userController->getUserByEmail($email);
        if ($existingUser) {
            echo json_encode(['status' => 'failed', 'message' => 'Email already exists']);
            exit;
        }

        // ✅ Create the user
        try {
            $result = $userController->createUser($name, $email, $role, $password, $number);

            if ($result) {
                echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
            } else {
                echo json_encode(['status' => 'failed', 'message' => 'Registration failed']);
            }
        } catch (PDOException $e) {
            error_log("Error during user creation: " . $e->getMessage());
            echo json_encode(['status' => 'failed', 'message' => 'Database error occurred']);
        }

        exit;
    }
}
