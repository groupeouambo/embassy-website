import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaComments } from 'react-icons/fa';
import './adminDashboard.css';

export default function AdminSettings() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">Admin</div>
        <div className="sidebar-user">
          <div className="avatar-placeholder">AD</div>
          <div>
            <div className="user-name">Admin User</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <nav className="admin-nav">
          <button onClick={() => navigate('/admin')}>Overview</button>
          <button onClick={() => navigate('/admin/applications')}>Applications</button>
          <button onClick={() => navigate('/admin/messages')}>
            <FaComments className="nav-icon" /> Messages
          </button>
          <button onClick={() => navigate('/admin/users')}>Users</button>
          <button className="active" onClick={() => navigate('/admin/settings')}>Settings</button>
          <button onClick={() => navigate('/admin/site')}>
            <FaGlobe className="nav-icon" /> Site
          </button>
        </nav>
        <div className="sidebar-actions">
          <button
            className="logout-btn"
            onClick={() => {
              sessionStorage.removeItem('isAdmin');
              sessionStorage.removeItem('isAuthenticated');
              localStorage.removeItem('isAdmin');
              localStorage.removeItem('isAuthenticated');
              navigate('/');
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <section className="admin-section">
          <div className="section-header">
            <h1>Profile</h1>
            <p>Update your admin profile</p>
          </div>
          <form className="admin-form">
            <label>
              Full Name
              <input type="text" defaultValue="Admin User" />
            </label>
            <label>
              Email
              <input type="email" defaultValue="admin@local.test" />
            </label>
            <button type="button" className="primary-btn">Save Profile</button>
          </form>
        </section>

        <section className="admin-section">
          <div className="section-header">
            <h2>Change Password</h2>
            <p>Keep your account secure</p>
          </div>
          <form className="admin-form">
            <label>
              Current Password
              <input type="password" />
            </label>
            <label>
              New Password
              <input type="password" />
            </label>
            <label>
              Confirm New Password
              <input type="password" />
            </label>
            <button type="button" className="primary-btn">Update Password</button>
          </form>
        </section>
      </main>
    </div>
  );
}
