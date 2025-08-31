import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import "../assets/css/PatientList.css"; // Fichier CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faUserPlus, faSearch, faEye, faArrowLeft,faFilePrescription } from "@fortawesome/free-solid-svg-icons"; // Importer l'icône de retour

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState(""); // État pour l'erreur de suppression
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
const medecin = JSON.parse(sessionStorage.getItem("medecin"));

if (!token || !medecin) {
  navigate("/login");
  return;
}

api.get(`/patients?medecin_id=${medecin.id}`) // Filtrer par médecin
  .then((response) => {
    setPatients(response.data);
    setFilteredPatients(response.data);
    setLoading(false);
  })
  .catch((error) => {
    console.error("Erreur chargement patients:", error);
    setError("Erreur lors du chargement des patients.");
    setLoading(false);// Ne pas bloquer l'affichage
      });
  }, [navigate]);
  

  const deletePatient = async (num_dossier) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce patient ?")) return;

    try {
      await api.delete(`/patients/${num_dossier}`);
      const updatedPatients = patients.filter((patient) => patient.num_dossier !== num_dossier);
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
      setDeleteError(""); // Réinitialise l'erreur de suppression
    } catch (error) {
      setDeleteError("Erreur lors de la suppression.");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPatients(
      patients.filter((patient) =>
        patient.nom.toLowerCase().includes(value) ||
        patient.num_dossier.toString().includes(value)
      )
    );
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="header">
        <h2>Liste des Patients</h2>
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom ou N° dossier..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className="add-btn" onClick={() => navigate("/add-patient")}>
          <FontAwesomeIcon icon={faUserPlus} /> Ajouter
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {deleteError && <p className="error">{deleteError}</p>} {/* Affichage de l'erreur de suppression */}
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
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucun patient trouvé.</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
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
                      {/* Icône pour afficher les détails du patient */}
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/details-patient/${patient.num_dossier}`)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
  className="prescription-btn"
  onClick={() => navigate(`/cree-ordonnance/${patient.num_dossier}`)}
>
  <FontAwesomeIcon icon={faFilePrescription} />
</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}