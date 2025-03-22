import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPills, FaPlus, FaUser } from 'react-icons/fa';
import styles from '../assets/css/dashboard.module.css';

const DashboardMedical = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Barre latérale */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>
          <FaPlus className={styles.icon} /> MedDash
        </h2>
        <nav>
          <ul className={styles.sidebarMenu}>
            <li className={styles.sidebarItem}>
              <FaUser className={styles.icon} /> Patients
            </li>
            <li className={styles.sidebarItem}>
              <FaPills className={styles.icon} /> Médicaments
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Bienvenue Dr. Martin</h2>
            <p className="text-muted">Voici ce qui se passe avec vos patients aujourd'hui.</p>
          </div>
          <div className={styles.userIcon}>
            <FaUser />
          </div>
        </header>

        <div className={styles.statsInfo}>
          <div className={styles.statsSection}>
            <div className={styles.statsCard}>
              <h5>Total des patients</h5>
              <p className="text-muted">128</p>
            </div>
            <div className={styles.statsCard}>
              <h5>Total des prescriptions</h5>
              <p className="text-muted">45</p>
            </div>
            <div className={styles.statsCard}>
              <h5>Total des médicaments</h5>
              <p className="text-muted">89</p>
            </div>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statsCard}>
            <h5>Patients récents</h5>
            <ul className="list-group">
              <li className="list-group-item">Sophie Martin <span className="text-muted">2024-01-15</span></li>
              <li className="list-group-item">Lucas Bernand <span className="text-muted">2024-01-14</span></li>
              <li className="list-group-item">Emma Dubois <span className="text-muted">2024-01-13</span></li>
            </ul>
          </div>
          <div className={styles.statsCard}>
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