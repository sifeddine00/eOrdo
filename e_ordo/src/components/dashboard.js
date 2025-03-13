import React, { useState, useEffect } from 'react';
import '../assets/css/dashboard.css';

function DashboardDoctor() {
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  
  useEffect(() => {
    // Charger les données depuis json-server
    const fetchData = async () => {
      try {
        const medecinRes = await fetch('http://localhost:3001/medecins');
        const patientRes = await fetch('http://localhost:3001/patients');
        const medicamentRes = await fetch('http://localhost:3001/medicaments');
        
        const medecinData = await medecinRes.json();
        const patientData = await patientRes.json();
        const medicamentData = await medicamentRes.json();
        
        setMedecins(medecinData);
        setPatients(patientData);
        setMedicaments(medicamentData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    
    fetchData();
  }, []);

  // Obtenir les patients pour un médecin spécifique
  const getMedecinPatients = (medecinId) => {
    return patients.filter(patient => patient.medecin_id === medecinId);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span>+</span>
        </div>
        <h1 className="title">MedDash</h1>
      </div>
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-label">Nombre de médecins</div>
          <div className="stat-value">{medecins.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Nombre de patients</div>
          <div className="stat-value">{patients.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Nombre de médicaments</div>
          <div className="stat-value">{medicaments.length}</div>
        </div>
      </div>
      
      {/* Section médecins */}
      <div className="doctors-container">
        <h2 className="section-title">Liste des médecins</h2>
        
        {medecins.map(medecin => {
          const medecinPatients = getMedecinPatients(medecin.id);
          
          return (
            <div key={medecin.id} className="doctor-card">
              <h3 className="doctor-name">Dr. {medecin.prenom} {medecin.nom}</h3>
              
              <div className="doctor-info">
                <div className="info-item">
                  <span className="info-label">Spécialité</span>
                  <span className="info-value">{medecin.specialite}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{medecin.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nombre de patients</span>
                  <span className="info-value">{medecinPatients.length}</span>
                </div>
              </div>
              
              <div className="patients-list">
                <h4 className="patients-title">Patients récents</h4>
                {medecinPatients.length > 0 ? (
                  medecinPatients.map(patient => (
                    <div key={patient.numero_dossier} className="patient-item">
                      <span className="patient-name">{patient.prenom} {patient.nom}</span>
                      <span className="patient-info">Né(e) le: {patient.date_naissance}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-patients">Aucun patient attribué</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardDoctor;