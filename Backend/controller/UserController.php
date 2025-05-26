<?php
require_once('../Config\dp.php'); // Fixed typo
require_once('../class\User.php');

class UserController
{
    private $user;

    public function __construct()
    {
        $db = (new Database())->connect();
        $this->user = new User($db);
    }

    // Register new user
    public function createUser($name, $email, $role, $password, $number)
    {
        return $this->user->create($name, $email, $role, $password, $number);
    }

    // Fetch all users
    public function getAllUsers()
    {
        return $this->user->getAll();
    }

    // Find user by email
    public function getUserByEmail($email)
    {
        return $this->user->findByEmail($email);
    }
    // ← New!
    public function loginUser($email, $password)
    {
        return $this->user->login($email, $password);
    }
}
