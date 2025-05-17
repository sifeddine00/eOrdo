import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPills, FaUser } from 'react-icons/fa';
import styles from '../assets/css/dashboard.module.css';
import api from '../axiosConfig';

const DashboardMedical = () => {
  const [userName, setUserName] = useState('');
  const [latestPatients, setLatestPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0); // State for Total Patients
  const navigate = useNavigate();


  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('medecin'));

    if (user) {                               
      setUserName(`${user.prenom} ${user.nom}`);

      api.get(`/patients?medecin_id=${user.id}`)
        .then((res) => {
          const derniersPatients = res.data.slice(-5).reverse();
          setLatestPatients(derniersPatients);
          setTotalPatients(res.data.length); // Set the total number of patients
        })
        .catch((err) => console.error("Erreur de récupération des patients :", err));
    } else {
      navigate('/login');
    }

    const medicamentsStockes = localStorage.getItem("medicaments");
    if (!medicamentsStockes) {
      api.get("/medicaments")
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
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>MedOrdo+</h2>
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

        {/* Conteneur divisé en deux colonnes */}
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            {/* Stats for Total Patients */}
            <div className={styles.statsCard}>
              <h3>Total Patients</h3>
              <p>{totalPatients}</p>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <h3 className={styles.sectionTitle}>Derniers patients ajoutés</h3>
            <div className={styles.cardList}>
              {latestPatients.length > 0 ? (
                latestPatients.map((patient) => (
                  <div key={patient.num_dossier} className={styles.patientCard}>
                    <div className={styles.patientName}>
                      {patient.prenom} {patient.nom}
                    </div>
                    <div className={styles.patientDate}>
                      {new Date(patient.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>Aucun patient récent.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMedical;
