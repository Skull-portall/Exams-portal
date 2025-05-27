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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/Frontend/Admin/Css/dash.css">
  <title>Admin Dashboard</title>
</head>
<style>
  /* Admin dashboard specific styles */
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 248px;
  background-color: white;
  padding: 2rem 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.logo-container {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.logo {
  color: rgb(51, 124, 51);
  font-size: 1.5rem;
  text-align: center;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4b5563;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: rgb(51, 124, 51);
}

.nav-item.active {
  background-color: rgb(51, 124, 51);
  color: white;
}

.nav-item.logout {
  margin-top: auto;
  color: #dc2626;
}

.nav-item.logout:hover {
  background-color: #fee2e2;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  background-color: #f3f4f6;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: rgb(51, 124, 51);
  box-shadow: 0 0 0 2px rgba(51, 124, 51, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-badge {
  font-size: 1.25rem;
  cursor: pointer;
  position: relative;
}

.notification-badge::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
}

.user-name {
  font-weight: 500;
  color: #111827;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #6b7280;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card h3 {
  color: #4b5563;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: rgb(51, 124, 51);
  margin-bottom: 0.5rem;
}

.stat-text {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recent-activities, .quick-actions {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  color: #111827;
  font-size: 1.25rem;
}

.view-all-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid rgb(51, 124, 51);
  color: rgb(51, 124, 51);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.view-all-btn:hover {
  background-color: rgb(51, 124, 51);
  color: white;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.activity-item:hover {
  transform: translateX(4px);
}

.activity-info h3 {
  color: #111827;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.activity-info p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.review-btn {
  padding: 0.5rem 1rem;
  background-color: rgb(51, 124, 51);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.review-btn:hover {
  background-color: rgb(45, 110, 45);
}

/* Quick Actions */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.95rem;
}

.action-btn:hover {
  background-color: rgb(51, 124, 51);
  color: white;
  transform: translateY(-2px);
}

.action-btn .icon {
  font-size: 1.25rem;
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal.active {
  display: flex;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #111827;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.modal-content p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.modal-content button {
  padding: 0.75rem 1.5rem;
  background-color: rgb(51, 124, 51);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: rgb(45, 110, 45);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }

  .nav-item span:not(.icon) {
    display: none;
  }

  .logo {
    font-size: 1.25rem;
  }

  .main-content {
    margin-left: 80px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    padding: 1rem;
  }

  .nav-menu {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .nav-item {
    padding: 0.75rem;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<body>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-container">
        <h1 class="logo">SKULL PORT</h1>
      </div>
      <nav class="nav-menu">
        <button class="nav-item active" data-page="dashboard">
          <span class="icon">🏠</span>
          <span>Dashboard</span>
        </button>
        <a href="./students.html">teachers</a>
        <button class="nav-item" data-page="teachers">
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
          <input type="text" placeholder="Search..." class="search-input" />
          <span class="search-icon">🔍</span>
        </div>
        <div class="user-info">
          <span class="notification-badge">🔔</span>
          <span class="user-name">Admin Name</span>
          <img
            src="/Frontend/img/school .png"
            alt="Profile"
            class="user-avatar" />
        </div>
      </header>

      <div class="dashboard-content">
        <section class="welcome-section">
          <h1>Welcome back, Admin! 👋</h1>
          <p>Here's what's happening in your school</p>
        </section>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Teachers</h3>
            <p class="stat-number">25</p>
            <p class="stat-text">Active teachers</p>
          </div>
          <div class="stat-card">
            <h3>Total Students</h3>
            <p class="stat-number">450</p>
            <p class="stat-text">Enrolled students</p>
          </div>
          <div class="stat-card">
            <h3>Active Classes</h3>
            <p class="stat-number">15</p>
            <p class="stat-text">Running classes</p>
          </div>
          <div class="stat-card">
            <h3>New Registrations</h3>
            <p class="stat-number">8</p>
            <p class="stat-text">This week</p>
          </div>
        </div>

        <div class="dashboard-grid">
          <section class="recent-activities">
            <div class="section-header">
              <h2>Recent Activities</h2>
              <button class="view-all-btn">View All</button>
            </div>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-info">
                  <h3>New Teacher Registration</h3>
                  <p>Ms. Sarah Johnson - Mathematics</p>
                  <span class="activity-time">2 hours ago</span>
                </div>
                <button class="review-btn">Review</button>
              </div>
              <div class="activity-item">
                <div class="activity-info">
                  <h3>Student Enrollment</h3>
                  <p>John Doe - Form 4A</p>
                  <span class="activity-time">3 hours ago</span>
                </div>
                <button class="review-btn">Review</button>
              </div>
              <div class="activity-item">
                <div class="activity-info">
                  <h3>Class Schedule Update</h3>
                  <p>Physics Class - Form 4B</p>
                  <span class="activity-time">5 hours ago</span>
                </div>
                <button class="review-btn">Review</button>
              </div>
            </div>
          </section>

          <section class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
              <button
                class="action-btn"
                onclick="window.location.href='register.html'">
                <span class="icon">👨‍🏫</span>
                Register Teacher
              </button>
              <button
                class="action-btn"
                onclick="window.location.href='register-student.html'">
                <span class="icon">👥</span>
                Register Student
              </button>
              <button class="action-btn">
                <span class="icon">📊</span>
                Generate Reports
              </button>
              <button class="action-btn">
                <span class="icon">⚙️</span>
                System Settings
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>

  <script src="./dash.js"></script>
</body>

</html>