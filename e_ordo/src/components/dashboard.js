import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPills, FaUser } from 'react-icons/fa';
import styles from '../assets/css/dashboard.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardMedical = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('medecin'));

    if (user) {
      setUserName(`${user.prenom} ${user.nom}`);
    } else {
      navigate('/login'); // Rediriger si non connecté
    }

    // Récupération des médicaments si non encore stockés
    const medicamentsStockes = localStorage.getItem("medicaments");
    if (!medicamentsStockes) {
      axios.get("http://localhost:8000/api/medicaments")
        .then(res => {
          localStorage.setItem("medicaments", JSON.stringify(res.data));
        })
        .catch(err => console.error("Erreur de récupération des médicaments :", err));
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
            <h2>Bienvenue Dr. {userName}</h2>
            <p className="text-muted">Voici ce qui se passe avec vos patients aujourd'hui.</p>
          </div>
          <div className={styles.userIcon}>
            <button onClick={handleLogout}>Déconnecter</button>
          </div>
        </header>

        {/* Tu peux ajouter ici des stats ou infos de médicaments */}
      </main>
    </div>
  );
};

export default DashboardMedical;
