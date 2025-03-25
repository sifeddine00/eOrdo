import React, { useState, useEffect } from "react";
import "../assets/css/AjouterMedicament.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../axiosConfig";

const AjouterMedicament = ({ onClose, medicament, fetchMedicaments }) => {
  const [formData, setFormData] = useState({
    nom_commercial: "",
    nom_dci: "",
    forme: "",
    dosage: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (medicament) {
      setFormData({
        nom_commercial: medicament.nom_commercial || "",
        nom_dci: medicament.nom_dci || "",
        forme: medicament.forme || "",
        dosage: medicament.dosage || "",
      });
    }
  }, [medicament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (medicament) {
        await api.put(`/medicaments/${medicament.id}`, formData);
        setMessage({ type: "success", text: "Médicament modifié avec succès !" });
      } else {
        await api.post("/medicaments", formData);
        setMessage({ type: "success", text: "Médicament ajouté avec succès !" });
      }
      fetchMedicaments();
      setTimeout(() => {
        setMessage({ type: "", text: "" });
        onClose();
      }, 3000); // Ferme après 3s
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'opération, veuillez réessayer." });
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>{medicament ? "Modifier Médicament" : "Ajouter Nouveau Médicament"}</h2>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Nom Commercial</label>
          <input
            type="text"
            name="nom_commercial"
            value={formData.nom_commercial}
            onChange={handleChange}
            placeholder="Nom Commercial"
            required
          />

          <label>Nom DCI</label>
          <input
            type="text"
            name="nom_dci"
            value={formData.nom_dci}
            onChange={handleChange}
            placeholder="Nom DCI"
            required
          />

          <label>Forme</label>
          <input
            type="text"
            name="forme"
            value={formData.forme}
            onChange={handleChange}
            placeholder="Forme"
            required
          />

          <label>Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Dosage"
            required
          />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="add-btn">
              {medicament ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterMedicament;
