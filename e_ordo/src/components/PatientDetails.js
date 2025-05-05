import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import "../assets/css/PatientDetails.css"; // Fichier CSS

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
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Récupération des détails du patient
  useEffect(() => {
    api.get(`/patients/${num_dossier}`)
      .then((response) => {
        setPatient(response.data);
      })
      .catch(() => setError("Erreur lors du chargement des détails du patient."))
      .finally(() => setLoading(false));
  }, [num_dossier]);

  // Récupération de l'historique des ordonnances du patient
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
      await api.delete(`/api/ordonnances/${id}`);
      alert("Ordonnance supprimée avec succès.");
      // Recharger les données ou filtrer localement
      setOrdonnances((prev) => prev.filter((ord) => ord.id !== id));
    } catch (error) {
      console.error("Erreur suppression ordonnance :", error);
      alert("Erreur lors de la suppression.");
    }
  }
};


  return (
    <div className="patient-details-container">
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          {/* Message de bienvenue avec nom, prénom et âge */}
          <div className="patient-info">
            <h2 >
              Dossier du patient : <span className="patient-title">{patient.nom} {patient.prenom}</span>
            </h2>
            {patient.date_naissance && (
              <p>
                <strong>Âge :</strong> {calculateAge(patient.date_naissance)} ans
              </p>
            )}
          </div>

          {/* Détails du patient */}
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
            <strong>Notes :</strong> {patient.notes || "Aucune"}
          </p>

          {/* Historique des ordonnances */}


        </div>
      )}
      <>
                <div className="ordonnances-historique">
  <h3>Historique des ordonnances</h3>
  {historiqueOrdonnances.length > 0 ? (
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
            <td>
  <button
    className="btn-modifier"
    onClick={() => navigate(`/cree-ordonnance/${num_dossier}?edit=${ordonnance.id}`)}
  >
    Modifier
  </button>
  <button
    className="btn-supprimer"
    onClick={() => handleDeleteOrdonnance(ordonnance.id)}
    style={{ marginLeft: '10px', backgroundColor: 'red' }}
  >
    Supprimer
  </button>
</td>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>Aucune ordonnance trouvée pour ce patient.</p>
  )}
</div>
      </>
      
    </div>
    
  );
}
