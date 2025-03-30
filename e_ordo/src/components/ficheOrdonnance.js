import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/FicheOrdonnance.css";

const FicheOrdonnance = ({ patientId, medecinId }) => {
  const [medicaments, setMedicaments] = useState([]);
  const [quantites, setQuantites] = useState([]);
  const [posologies, setPosologies] = useState([]);
  const [ordonnance, setOrdonnance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicaments, setFilteredMedicaments] = useState([]);
  
  const [nouveauMedicament, setNouveauMedicament] = useState({
    medicament: null,
    quantite: null,
    posologie: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicamentsData, quantitesData, posologiesData] = await Promise.all([
          api.get("/medicaments"),
          api.get("/quantites"),
          api.get("/posologies"),
        ]);
        setMedicaments(medicamentsData.data);
        setQuantites(quantitesData.data);
        setPosologies(posologiesData.data);
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = medicaments.filter(med =>
        med.nom_commercial.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicaments(results);
    } else {
      setFilteredMedicaments([]);
    }
  }, [searchTerm, medicaments]);

  const ajouterMedicament = () => {
    if (!nouveauMedicament.medicament || !nouveauMedicament.quantite || !nouveauMedicament.posologie) {
      alert("Veuillez sélectionner un médicament, une quantité et une posologie.");
      return;
    }
    setOrdonnance([...ordonnance, { ...nouveauMedicament, id: Date.now() }]);
    setSearchTerm("");
    setNouveauMedicament({ medicament: null, quantite: null, posologie: null });
  };

  const supprimerMedicament = (id) => {
    setOrdonnance(ordonnance.filter(item => item.id !== id));
  };

  const enregistrerOrdonnance = async () => {
    try {
      await api.post("/ordonnances", {
        patient_id: patientId,
        medecin_id: medecinId,
        medicaments: ordonnance,
      });
      alert("Ordonnance enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement de l'ordonnance.");
    }
  };

  const imprimerOrdonnance = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }

  return (
    <div className="ordonnance-container">
      <h2>Nouvelle Ordonnance</h2>

      <div className="selection-container">
        <input
          type="text"
          placeholder="Rechercher un médicament"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredMedicaments.length > 0 && (
          <ul className="medicament-list">
            {filteredMedicaments.map((med) => (
              <li key={med.id} onClick={() => {
                setNouveauMedicament((prev) => ({ ...prev, medicament: med }));
                setSearchTerm(`${med.nom_commercial} - ${med.nom_dci} (${med.dosage} - ${med.forme})`);
                setFilteredMedicaments([]);
              }}>
                {`${med.nom_commercial} - ${med.nom_dci} (${med.dosage} - ${med.forme})`}
              </li>
            ))}
          </ul>
        )}

        <select 
          value={nouveauMedicament.quantite?.id || ""} 
          onChange={(e) => setNouveauMedicament((prev) => ({ ...prev, quantite: quantites.find(q => q.id === parseInt(e.target.value)) }))}
        >
          <option value="">Sélectionner une quantité</option>
          {quantites.map((q) => (
            <option key={q.id} value={q.id}>{q.valeur} {q.unite}</option>
          ))}
        </select>

        <select 
          value={nouveauMedicament.posologie?.id || ""} 
          onChange={(e) => setNouveauMedicament((prev) => ({ ...prev, posologie: posologies.find(p => p.id === parseInt(e.target.value)) }))}
        >
          <option value="">Sélectionner une posologie</option>
          {posologies.map((p) => (
            <option key={p.id} value={p.id}>{p.frequence} {p.moment_prise}</option>
          ))}
        </select>

        <button className="btn add-btn" onClick={ajouterMedicament}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter
        </button>
      </div>

      <table className="ordonnance-table">
        <thead>
          <tr>
            <th>Médicament</th>
            <th>Quantité</th>
            <th>Posologie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ordonnance.map((item) => (
            <tr key={item.id}>
              <td>{`${item.medicament.nom_commercial} - ${item.medicament.nom_dci} (${item.medicament.dosage} - ${item.medicament.forme})`}</td>
              <td>{`${item.quantite.valeur} ${item.quantite.unite}`}</td>
              <td>{`${item.posologie.frequence} ${item.posologie.moment_prise}`}</td>
              <td>
                <button className="btn delete-btn" onClick={() => supprimerMedicament(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn save-btn" onClick={enregistrerOrdonnance}>
        <FontAwesomeIcon icon={faSave} /> Enregistrer
      </button>

      <button className="btn print-btn" onClick={imprimerOrdonnance}>
        <FontAwesomeIcon icon={faPrint} /> Imprimer
      </button>
    </div>
  );
};

export default FicheOrdonnance;
