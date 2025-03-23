import React from "react";
import "../assets/css/AjouterMedicament.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AjouterMedicament = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Nouveau médicament</h2>
        <form>
          <label>Nom Commercial</label>
          <input type="text" placeholder="Nom Commercial" />

          <label>Nom DCI</label>
          <input type="text" placeholder="Nom DCI" />

          <label>Forme</label>
          <input type="text" placeholder="Forme" />

          <label>Dosage</label>
          <input type="text" placeholder="Dosage" />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
            <button type="submit" className="add-btn">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterMedicament;
