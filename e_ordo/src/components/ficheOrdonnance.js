import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/FicheOrdonnance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faCalendarAlt, faFileMedical, faPrint, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const quantites = [
  "1 BTE", "2 BTES", "3 BTES", "4 BTES", "5 BTES",
  "1 FLS", "2 FLC", "3 FLC", "4 FLC", "5 FLC",
  "1 TUBE", "2 TUBE", "3 TUBE", "4 TUBE", "5 TUBE",
  "QSP 3 J", "QSP 5 J", "QSP 7 J"
];


const posologies = [
  "1 GEL X 2/J", "1 GEL LE MATIN", "1 GEL LE SOIR", "1 GEL APRES", "1 GEL /SEMAINE",
  "1 SC /J", "1SC X2/J", "1 SC X3/J", "1 SC LE MATIN", "1 SC LE SOIR"
];

const FicheOrdonnance = () => {
  const navigate = useNavigate();
  const [medicaments, setMedicaments] = useState([
    { id: 1, nom: "Amoxicillin", quantite: "3 BTES", posologie: "1 GEL X 2/J" },
    { id: 2, nom: "Paracetamol", quantite: "2 FLC", posologie: "1 SC X2/J" },
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
      
          <input
            type="text"
            id="search-medicament"
            className="small-input"
            placeholder="Rechercher Un Médicament..."
            value={nouveauMedicament.nom}
            onChange={(e) => setNouveauMedicament({ ...nouveauMedicament, nom: e.target.value })}
          />
          <button className="btn list-btn" onClick={() => navigate("/liste-medicaments")}>
            <FontAwesomeIcon icon={faFileMedical} />
          </button>

          <label htmlFor="quantite">Quantité :</label>
          <select
            id="quantite"
            className="small-select"
            value={nouveauMedicament.quantite}
            onChange={(e) => setNouveauMedicament({ ...nouveauMedicament, quantite: e.target.value })}
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
            className="small-select"
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
