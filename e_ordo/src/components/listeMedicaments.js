import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSync } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/ListeMedicaments.css";

const ListeMedicaments = () => {
  const medicaments = [
    { id: 1, commercial: "Doliprane", dci: "Paracetamol", forme: "Comprimé", dosage: "1000mg" },
    { id: 2, commercial: "Efferalgan", dci: "Paracetamol", forme: "Effervescent", dosage: "500mg" },
    { id: 3, commercial: "Spasfon", dci: "Phloroglucinol", forme: "Comprimé", dosage: "80mg" },
  ];
  const [searchCommercial, setSearchCommercial] = useState("");
  const [searchDci, setSearchDci] = useState("");

  const handleAdd = () => {
    // Logic for adding a new medicament
  };

  const handleEdit = () => {
    // Logic for editing a medicament
  };

  const handleDelete = () => {
    // Logic for deleting a medicament
  };


  const handleRefresh = () => {
    // Logic for refreshing the list
  };

  const filteredMedicaments = medicaments.filter(
    (med) =>
      med.commercial.toLowerCase().includes(searchCommercial.toLowerCase()) &&
      med.dci.toLowerCase().includes(searchDci.toLowerCase())
  );

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
        <button className="edit-btn" onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} /> Modifier
        </button>
        <button className="delete-btn" onClick={handleDelete}>
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
          {filteredMedicaments.map((med) => (
            <tr key={med.id}>
              <td>{med.commercial}</td>
              <td>{med.dci}</td>
              <td>{med.forme}</td>
              <td>{med.dosage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default ListeMedicaments;