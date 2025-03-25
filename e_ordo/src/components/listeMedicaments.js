import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSync } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/ListeMedicaments.css";
import AjouterMedicament from "./ajouterMedicament";
import api from "../axiosConfig";

const ListeMedicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [searchCommercial, setSearchCommercial] = useState("");
  const [searchDci, setSearchDci] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState(null);

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    try {
      const response = await api.get("/medicaments");
      console.log("Données reçues :", response.data);
      setMedicaments(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des médicaments :", error);
    }
  };

  const handleAdd = () => {
    setModalVisible(true);
    setSelectedMedicament(null);
  };

  const handleEdit = (medicament) => {
    setModalVisible(true);
    setSelectedMedicament(medicament);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/medicaments/${id}`);
      fetchMedicaments();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleRefresh = () => {
    fetchMedicaments();
  };

  // 🔎 Filtrer les médicaments séparément selon les critères
  const filteredByCommercial = searchCommercial
    ? medicaments.filter((med) =>
        med.nom_commercial.toLowerCase().includes(searchCommercial.toLowerCase())
      )
    : medicaments;

  const filteredByDci = searchDci
    ? medicaments.filter((med) =>
        med.nom_dci.toLowerCase().includes(searchDci.toLowerCase())
      )
    : medicaments;

  // On garde uniquement les 5 derniers médicaments après chaque filtrage
  const displayedMedicaments = filteredByDci.filter((med) =>
    filteredByCommercial.includes(med)
  ).slice(0, 20);

  return (
    <div className="container">
      <h2 className="title">&#128137; Liste Des Médicaments</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par nom commercial..."
          className="search-input"
          value={searchCommercial}
          onChange={(e) => setSearchCommercial(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rechercher par nom DCI..."
          className="search-input"
          value={searchDci}
          onChange={(e) => setSearchDci(e.target.value)}
        />
        <button className="refresh-btn" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faSync} />
        </button>
      </div>

      <div className="buttons">
        <button className="add-btn" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> Nouveau
        </button>
        <button
          className="edit-btn"
          onClick={() => handleEdit(selectedMedicament)}
          disabled={!selectedMedicament}
        >
          <FontAwesomeIcon icon={faEdit} /> Modifier
        </button>
        <button
          className="delete-btn"
          onClick={() => handleDelete(selectedMedicament?.id)}
          disabled={!selectedMedicament}
        >
          <FontAwesomeIcon icon={faTrash} /> Supprimer
        </button>
      </div>

      <table className="med-table">
        <thead>
          <tr>
            <th>Nom Commercial</th>
            <th>Nom DCI</th>
            <th>Forme</th>
            <th>Dosage</th>
          </tr>
        </thead>
        <tbody>
          {displayedMedicaments.length > 0 ? (
            displayedMedicaments.map((med) => (
              <tr key={med.id} onClick={() => setSelectedMedicament(med)}>
                <td>{med.nom_commercial}</td>
                <td>{med.nom_dci}</td>
                <td>{med.forme}</td>
                <td>{med.dosage}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Aucun médicament trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalVisible && (
        <AjouterMedicament
          onClose={() => setModalVisible(false)}
          medicament={selectedMedicament}
          fetchMedicaments={fetchMedicaments}
        />
      )}
    </div>
  );
};

export default ListeMedicaments;
