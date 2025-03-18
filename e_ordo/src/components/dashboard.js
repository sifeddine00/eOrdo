import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPills, FaPlus, FaUser } from 'react-icons/fa';
import '../assets/css/dashboard.css';

const DashboardMedical = () => {
  return (
    <div className="dashboard-container">
      {/* Barre latérale */}
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
              <FaPills className="icon" /> Médicaments
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <h2>Bienvenue Dr. Martin</h2>
            <p className="text-muted">Voici ce qui se passe avec vos patients aujourd'hui.</p>
          </div>
          <div className="user-icon">
            <FaUser />
          </div>
        </header>

        <div className="stats-info">
          <div className="stats-section">
            <div className="stats-card">
              <h5>Total des patients</h5>
              <p className="text-muted">128</p>
            </div>
            <div className="stats-card">
              <h5>Total des prescriptions</h5>
              <p className="text-muted">45</p>
            </div>
            <div className="stats-card">
              <h5>Total des médicaments</h5>
              <p className="text-muted">89</p>
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stats-card">
            <h5>Patients récents</h5>
            <ul className="list-group">
              <li className="list-group-item">Sophie Martin <span className="text-muted">2024-01-15</span></li>
              <li className="list-group-item">Lucas Bernand <span className="text-muted">2024-01-14</span></li>
              <li className="list-group-item">Emma Dubois <span className="text-muted">2024-01-13</span></li>
            </ul>
          </div>
          <div className="stats-card">
            <h5>Prescriptions récentes</h5>
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
