import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import "../assets/css/PatientDetails.css"; // Fichier CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function PatientDetails() {
  const { num_dossier } = useParams(); // Récupérer le num_dossier depuis l'URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historiqueOrdonnances, setHistoriqueOrdonnances] = useState([]);
  const navigate = useNavigate();
  const [ordonnances, setOrdonnances] = useState([]);

  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    let day = today.getDate() - birthDate.getDate();
  
    if (month < 0 || (month === 0 && day < 0)) {
      age--;
      month += 12; 
    }
  
    if (day < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0); 
      day += lastMonth.getDate(); 
      month--;
    }
  
    return `${age} ans, ${month} mois, ${day} jours`;
  };
  

  useEffect(() => {
    api.get(`/patients/${num_dossier}`)
      .then((response) => {
        setPatient(response.data);
      })
      .catch(() => setError("Erreur lors du chargement des détails du patient."))
      .finally(() => setLoading(false));
  }, [num_dossier]);


  useEffect(() => {
    api.get(`/patients/${num_dossier}/ordonnances`)
      .then((response) => {
        setHistoriqueOrdonnances(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l'historique des ordonnances:", error);
        setError("Erreur lors du chargement de l'historique des ordonnances.");
      });
  }, [num_dossier]);


const handleDeleteOrdonnance = async (id) => {
  if (window.confirm("Voulez-vous vraiment supprimer cette ordonnance ?")) {
    try {
      await api.delete(`/ordonnances/${id}`);
      alert("Ordonnance supprimée avec succès.");

      setOrdonnances((prev) => prev.filter((ord) => ord.id !== id));
    } catch (error) {
      console.error("Erreur suppression ordonnance :", error);
      alert("Erreur lors de la suppression.");
    }
  }
};


  return (
    <div className="patient-details-container">
      <button className="back-button" onClick={() => navigate("/patients")}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          {/* Bouton pour créer une nouvelle ordonnance */}
          <div className="action-buttons" style={{ marginBottom: '20px' }}>
            <button 
              className="btn-primary" 
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate(`/cree-ordonnance/${num_dossier}`)}
            >
              Créer une nouvelle ordonnance
            </button>
          </div>

          <div className="patient-info">
            <h2 >
              Dossier du patient : <span className="patient-title">{patient.nom} {patient.prenom}</span>
            </h2>
            {patient.date_naissance && (
              <p>
                <strong>Âge :</strong> {calculateAge(patient.date_naissance)} 
              </p>
            )}
          </div>


          <p>
            <strong>Téléphone :</strong> {patient.téléphone}
          </p>
          <p>
            <strong>Email :</strong> {patient.email}
          </p>
          <p>
            <strong>Adresse :</strong> {patient.adresse}
          </p>
          <p>
            <strong>Profession :</strong> {patient.profession}
          </p>
          <p>
            <strong>Statut familial :</strong> {patient.status_familiale}
          </p>
          <p>
            <strong>Groupe sanguin :</strong> {patient.groupe_sanguin}
          </p>
          <p>
            <strong>Allergies :</strong> {patient.allergies || "Aucune"}
          </p>
          <p>
            <strong>Notes :</strong> {patient.note || "Aucune"}
          </p>

          {/* Historique des ordonnances */}


        </div>
      )}
      <>
      <div className="ordonnances-historique" style={{ gridColumn: 'span 2' }}>
  <h3>Historique des ordonnances</h3>
  {historiqueOrdonnances.length > 0 ? (
    <div className="table-responsive">
      <table className="ordonnances-table">
        <thead>
          <tr>
            <th>Date de visite</th>
            <th>Médecin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {historiqueOrdonnances.map((ordonnance) => (
            <tr key={ordonnance.id}>
              <td>{new Date(ordonnance.date_visite).toLocaleDateString("fr-FR")}</td>
              <td>Dr. {ordonnance.medecin.nom} {ordonnance.medecin.prenom}</td>
              <td>
                <button
                  className="btn-voir"
                  onClick={() => navigate(`/detail-ordonnance/${ordonnance.id}`)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px',
                    fontSize: '14px'
                  }}
                >
                  Voir détails
                </button>
                <button
                  className="btn-modifier"
                  onClick={() => navigate(`/cree-ordonnance/${num_dossier}?edit=${ordonnance.id}`)}
                >
                  Modifier
                </button>
                <button
                  className="btn-supprimer"
                  onClick={() => handleDeleteOrdonnance(ordonnance.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>Aucune ordonnance trouvée pour ce patient.</p>
  )}
</div>

      </>
      
    </div>
    
  );
}
