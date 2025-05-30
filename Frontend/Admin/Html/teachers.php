<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: ../index.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<<<<<<<< HEAD:Frontend/Admin/Html/teachers.html
    <link rel="stylesheet" href="/Frontend/Admin/Css/teachers.css">
   <link rel="stylesheet" href="/Frontend/Admin/Css/dash.css">
========
    <link rel="stylesheet" href="teachers.css">
    <link rel="stylesheet" href="dash.css">
>>>>>>>> e127e53e32e235b6e16968fc62f814e7dfc068bd:Frontend/Admin/teachers.php
    <title>Manage Teachers - Admin Portal</title>
</head>

<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <h1 class="logo">SKULL PORT</h1>
            </div>
            <nav class="nav-menu">
                <button class="nav-item" data-page="dashboard">
                    <span class="icon">🏠</span>
                    <span>Dashboard</span>
                </button>
                <button class="nav-item active" data-page="teachers">
                    <span class="icon">👨‍🏫</span>
                    <span>Manage Teachers</span>
                </button>
                <button class="nav-item" data-page="students">
                    <span class="icon">👥</span>
                    <span>Manage Students</span>
                </button>
                <button class="nav-item" data-page="profile">
                    <span class="icon">👤</span>
                    <span>Profile</span>
                </button>
                <button class="nav-item logout">
                    <span class="icon">🚪</span>
                    <span>Logout</span>
                </button>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-bar">
                <div class="search-container">
                    <input type="text" placeholder="Search teachers..." class="search-input">
                    <span class="search-icon">🔍</span>
                </div>
                <div class="user-info">
                    <span class="notification-badge">🔔</span>
                    <span class="user-name">Admin Name</span>
                    <img src="/Frontend/img/school .png" alt="Profile" class="user-avatar">
                </div>
            </header>

            <div class="teachers-content">
                <section class="welcome-section">
                    <h1>Manage Teachers</h1>
                    <p>View and manage all registered teachers</p>
                </section>

                <div class="action-bar">
                    <button class="add-teacher-btn" onclick="window.location.href='register-teachers.html'">
                        <span class="icon">➕</span> Add New Teacher
                    </button>
                    <div class="filters">
                        <select id="subjectFilter">
                            <option value="">All Subjects</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="biology">Biology</option>
                        </select>
                        <select id="statusFilter">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div class="teachers-grid">
                    <!-- Teacher cards will be dynamically populated here -->
                </div>
            </div>
        </main>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal" id="confirmationModal">
        <div class="modal-content">
            <h3>Confirm Action</h3>
            <p id="confirmationMessage">Are you sure you want to proceed with this action?</p>
            <div class="modal-actions">
                <button id="confirmAction" class="confirm-btn">Confirm</button>
                <button id="cancelAction" class="cancel-btn">Cancel</button>
            </div>
        </div>
    </div>

    <script src="/Frontend/Admin/Js/teachers.js"></script>
</body>

</html>