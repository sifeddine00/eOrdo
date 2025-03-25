import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import "../assets/css/PatientDetails.css"; // Fichier CSS

export default function PatientDetails() {
  const { num_dossier } = useParams(); // Récupérer le num_dossier depuis l'URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    // Charger les détails du patient
    api.get(`/patients/${num_dossier}`)
      .then((response) => {
        setPatient(response.data);
      })
      .catch(() => setError("Erreur lors du chargement des détails du patient."))
      .finally(() => setLoading(false));
  }, [num_dossier]);

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
            <h2>Le Dossier Du Patient, {patient.prenom} {patient.nom} !</h2>
            {patient.date_naissance && (
              <p><strong>Âge :</strong> {calculateAge(patient.date_naissance)} ans</p>
            )}
          </div>

          {/* Détails du patient */}
          <p><strong>Téléphone :</strong> {patient.téléphone}</p>
          <p><strong>Email :</strong> {patient.email}</p>
          <p><strong>Adresse :</strong> {patient.adresse}</p>
          <p><strong>Profession :</strong> {patient.profession}</p>
          <p><strong>Statut familial :</strong> {patient.status_familiale}</p>
          <p><strong>Groupe sanguin :</strong> {patient.groupe_sanguin}</p>
          <p><strong>Allergies :</strong> {patient.allergies || 'Aucune'}</p>
          <p><strong>Notes :</strong> {patient.notes || 'Aucune'}</p>
        </div>
      )}
    </div>
  );
}
