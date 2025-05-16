<?php
require_once __DIR__ . '/../config/dp.php';
require_once __DIR__ . '/../class/User.php';

class UserController {
    private $user;

    public function __construct() {
        $db = (new Database())->connect();
        $this->user = new User($db);
    }

    // Now accepts $number as the fifth parameter
    public function createUser($name, $email, $role, $password, $number) {
        return $this->user->create($name, $email, $role, $password, $number);
    }

    public function getAllUsers() {
        return $this->user->getAll();
    }
}
