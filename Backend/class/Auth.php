<?php
class Auth {
    public static function login($email, $password, $conn) {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user'] = $user;
            return true;
        }
        return false;
    }

    public static function logout() {
        session_start();
        session_destroy();
    }

    public static function isLoggedIn() {
        session_start();
        return isset($_SESSION['user']);
    }
}
