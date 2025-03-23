import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import "../assets/css/PatientList.css"; // Fichier CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/patients")
      .then((response) => setPatients(response.data))
      .catch((error) => setError("Erreur lors du chargement des patients."))
      .finally(() => setLoading(false));
  }, []);

  const deletePatient = async (num_dossier) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce patient ?")) return;

    try {
      await api.delete(`/patients/${num_dossier}`);
      setPatients(patients.filter((patient) => patient.num_dossier !== num_dossier));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Liste des Patients</h2>
        <button className="add-btn" onClick={() => navigate("/add-patient")}>
          <FontAwesomeIcon icon={faUserPlus} /> Ajouter
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="patient-table">
          <thead>
            <tr>
              <th>N° Dossier</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6">Aucun patient trouvé.</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.num_dossier}>
                  <td>{patient.num_dossier}</td>
                  <td>{patient.nom}</td>
                  <td>{patient.prenom}</td>
                  <td>{patient.téléphone}</td>
                  <td>{patient.email}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-patient/${patient.num_dossier}`)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deletePatient(patient.num_dossier)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
