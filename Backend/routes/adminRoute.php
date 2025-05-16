<?php
require_once __DIR__ . '/../controller/UserController.php';

$userController = new UserController();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'create') {
        // Get form data
        $name = $_POST['name'];
        $email = $_POST['email'];
        $role = $_POST['role']; // Assuming role is passed in the form
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];
        $number = $_POST['number'];

        // Log the received data for monitoring
        error_log("Received data: name=$name, email=$email, role=$role, number=$number");

        // Optional: Check if passwords match
        if ($password !== $confirmPassword) {
            error_log("Passwords do not match for user: $email");
            echo json_encode(['status' => 'failed', 'message' => 'Passwords do not match']);
            exit;
        }

        // Optional: validate fields (add more checks if needed)
        if (empty($name) || empty($email) || empty($password) || empty($number)) {
            error_log("Missing required fields for user: $email");
            echo json_encode(['status' => 'failed', 'message' => 'Please fill all required fields']);
            exit;
        }

        // Hash the password before storing it
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Log password hashing for debugging
        error_log("Password hashed for user: $email");

        // Call your controller to create the user
        $result = $userController->createUser($name, $email, $role, $hashedPassword, $number); // Include phone

        // Return response and log the result
        if ($result) {
            error_log("User created successfully: $email");
            echo json_encode([
                'status' => 'success',
                'message' => 'Registration successful'
            ]);
        } else {
            error_log("User creation failed for: $email");
            echo json_encode([
                'status' => 'failed',
                'message' => 'Registration failed'
            ]);
        }
        exit;
    }
}
