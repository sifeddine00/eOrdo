import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/FicheOrdonnance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faCalendarAlt,faFileMedical, faPrint, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const quantites = [1, 2, 5, 10, 12, 15, 20, 25, 30, 50];
const posologies = ["1x par jour", "2x par jour", "3x par jour", "4x par jour"];

const FicheOrdonnance = () => {
  const navigate = useNavigate();
  const [medicaments, setMedicaments] = useState([
    { id: 1, nom: "Amoxicillin", quantite: 20, posologie: "3x par jour" },
    { id: 2, nom: "Paracetamol", quantite: 12, posologie: "2x par jour" },
  ]);
  const [nouveauMedicament, setNouveauMedicament] = useState({
    nom: "",
    quantite: quantites[0],
    posologie: posologies[0],
  });
  const [dateOrdonnance, setDateOrdonnance] = useState(new Date().toISOString().slice(0, 10));

  const ajouterMedicament = () => {
    if (nouveauMedicament.nom) {
      setMedicaments([...medicaments, { ...nouveauMedicament, id: Date.now() }]);
      setNouveauMedicament({ nom: "", quantite: quantites[0], posologie: posologies[0] });
    }
  };

  const supprimerMedicament = (id) => {
    setMedicaments(medicaments.filter((med) => med.id !== id));
  };

  return (
    <div className="fiche-ordonnance">
      <div className="header">
        <h2>Fiche Ordonnances</h2>
        <div className="date-container">
          <label htmlFor="date-ordonnance">
            <FontAwesomeIcon icon={faCalendarAlt} /> Date d'ordonnance :
          </label>
          <input
            type="date"
            id="date-ordonnance"
            value={dateOrdonnance}
            onChange={(e) => setDateOrdonnance(e.target.value)}
          />
        </div>
      </div>
      <p className="patient-name">Sophie Martin</p>

      <div className="form-group">
        <div className="form-container">
          <label htmlFor="search-medicament">Médicament :</label>
          <input
            type="text"
            id="search-medicament"
            className="small-input"
            placeholder="Rechercher..."
            value={nouveauMedicament.nom}
            onChange={(e) => setNouveauMedicament({ ...nouveauMedicament, nom: e.target.value })}
          />
          <button className="btn list-btn" onClick={() => navigate("/liste-medicaments")}>
            <FontAwesomeIcon icon={faFileMedical} /> Liste des Médicaments
          </button>

          <label htmlFor="quantite">Quantité :</label>
          <select
            id="quantite"
            value={nouveauMedicament.quantite}
            onChange={(e) => setNouveauMedicament({ ...nouveauMedicament, quantite: Number(e.target.value) })}
          >
            {quantites.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          <label htmlFor="posologie">Posologie :</label>
          <select
            id="posologie"
            value={nouveauMedicament.posologie}
            onChange={(e) => setNouveauMedicament({ ...nouveauMedicament, posologie: e.target.value })}
          >
            {posologies.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button className="btn add-btn" onClick={ajouterMedicament}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter
          </button>
        </div>
      </div>

      <table className="medicament-table">
        <thead>
          <tr>
            <th>Médicament</th>
            <th>Quantité</th>
            <th>Posologie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((med) => (
            <tr key={med.id}>
              <td>{med.nom}</td>
              <td>{med.quantite}</td>
              <td>{med.posologie}</td>
              <td>
                <button className="btn delete-btn" onClick={() => supprimerMedicament(med.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons-container">
        <button className="btn cancel-btn">
          <FontAwesomeIcon icon={faTimes} /> Annuler
        </button>
        <div className="right-buttons">
          <button className="btn print-btn">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button className="btn validate-btn">
            <FontAwesomeIcon icon={faCheck} /> Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default FicheOrdonnance;