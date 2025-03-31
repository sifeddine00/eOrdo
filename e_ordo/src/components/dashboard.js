import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPills, FaUser } from 'react-icons/fa';
import styles from '../assets/css/dashboard.module.css';
import { Link } from 'react-router-dom';

const DashboardMedical = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('medecin'));
    if (user) {
      setUserName(`${user.prenom} ${user.nom}`);
    } else {
      navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Barre latérale */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>
           MedOrdo+
        </h2>
        <nav>
          <ul className={styles.sidebarMenu}>
            <li className={styles.sidebarItem}>
              <Link to="/patients" className={styles.sidebarLink}>
                <FaUser className={styles.icon} /> Patients
              </Link>
            </li>
            <li className={styles.sidebarItem}>
              <Link to="/medicaments" className={styles.sidebarLink}>
                <FaPills className={styles.icon} /> Médicaments
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Bienvenue Dr. {userName}</h2> {/* Affichage du prénom et nom du médecin */}
            <p className="text-muted">Voici ce qui se passe avec vos patients aujourd'hui.</p>
          </div>
          <div className={styles.userIcon}>
            <button onClick={handleLogout}>Déconnecter</button>
          </div>
        </header>

        {/* Autres sections du tableau de bord */}
      </main>
    </div>
  );
};

export default DashboardMedical;
