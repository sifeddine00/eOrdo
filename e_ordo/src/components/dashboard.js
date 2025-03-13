import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPills, FaPlus, FaUser } from 'react-icons/fa';
import '../assets/css/dashboard.css';

const DashboardMedical = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">
          <FaPlus className="icon" /> MedDash
        </h2>
        <nav>
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <FaUser className="icon" /> Patients
            </li>
            <li className="sidebar-item">
              <FaPills className="icon" /> Medications
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <h2>Welcome back, Dr. Martin</h2>
            <p className="text-muted">Here's what's happening with your patients today.</p>
          </div>
          <div className="user-icon">
            <FaUser />
          </div>
        </header>

        <div className="stats-info">
          <div className="stats-section">
            <div className="stats-card">
              <h5>Total Patients</h5>
              <p className="text-muted">128</p>
            </div>
            <div className="stats-card">
              <h5>Total Prescriptions</h5>
              <p className="text-muted">45</p>
            </div>
            <div className="stats-card">
              <h5>Total Medications</h5>
              <p className="text-muted">89</p>
            </div>
            </div> 
        </div>

        <div className="stats-container">
          <div className="stats-card">
            <h5>Recent Patients</h5>
            <ul className="list-group">
              <li className="list-group-item">Sophie Martin <span className="text-muted">2024-01-15</span></li>
              <li className="list-group-item">Lucas Bernand <span className="text-muted">2024-01-14</span></li>
              <li className="list-group-item">Emma Dubois <span className="text-muted">2024-01-13</span></li>
            </ul>
          </div>
          <div className="stats-card">
            <h5>Recent Prescriptions</h5>
            <ul className="list-group">
              <li className="list-group-item">Marie Lambert <span className="text-muted">2024-01-15</span></li>
              <li className="list-group-item">Thomas Petit <span className="text-muted">2024-01-14</span></li>
              <li className="list-group-item">Julie Moreau <span className="text-muted">2024-01-13</span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMedical;
