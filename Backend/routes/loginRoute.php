<?php
session_start();               // start session at top
require_once __DIR__ . '/../controller/UserController.php';

$ctrl = new UserController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $role = $_POST['role'] ?? '';

    // STUDENT login
    if ($role === 'student') {
        $name       = trim($_POST['name'] ?? '');
        $student_id = trim($_POST['student_id'] ?? '');

        // TODO: implement your Student model / controller
        // e.g. $studentCtrl->loginStudent($name, $student_id)
        // if ok:
        //   $_SESSION['role'] = 'student';
        //   $_SESSION['name'] = $name;
        //   header('Location: ../student/dashboard.php');
        // else:
        //   echo 'Invalid student credentials';
        exit;
    }

    // TEACHER or ADMIN login
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // call our UserController
    $user = $ctrl->loginUser($email, $password);

    if ($user) {
        // successful login
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role']    = $user['role'];
        $_SESSION['name']    = $user['name'];

        if ($user) {
            // ... set $_SESSION …

            // choose PHP dashboard
            switch ($user['role']) {
                case 'admin':
                    $target = '../../Frontend/Admin/dash.php';
                    break;
                case 'teacher':
                    $target = '../../Frontend/Teacher/dash.php';
                    break;
                default:
                    $target = '../../Frontend/index.php';
            }

            // alert data
            $alertTitle   = "Login Successful";
            $alertText    = "Welcome back, " . htmlspecialchars($user['name']) . "!";
            $alertIcon    = "success";
            $redirectUrl  = $target;
            $alertButton  = "Go to Dashboard";

            include('../../Frontend/sweetAlert/alertTemplate.php');
            exit;
        }
    } else {
        // login failed — you can still JSON or do JS alert here
        $alertTitle = "Invalid email or password";
        $alertText = "please make use of the correct email and password";
        $alertIcon = "warning";
        $redirectUrl = '../../Frontend/index.html';
        $alertButton = "OK";

        include('../../Frontend/sweetAlert/alertTemplate.php');
        exit;
    }
}
