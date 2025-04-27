import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPrint, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import "../assets/css/FicheOrdonnance.css";

const FicheOrdonnance = () => {
  const { num_dossier } = useParams();
  const navigate = useNavigate();

  const [quantites, setQuantites] = useState([]);
  const [posologies, setPosologies] = useState([]);
  const [ordonnance, setOrdonnance] = useState([]);
  const [nouveauMedicament, setNouveauMedicament] = useState({ medicament: null, quantite: null, posologie: null });
  const [medicaments, setMedicaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateOrdonnance, setDateOrdonnance] = useState(new Date());

  // Informations du patient et du médecin
  const [patient, setPatient] = useState(null);
  const [medecin, setMedecin] = useState(null);

  // Informations supplémentaires du médecin
  const medecinDetails = {
    specialites: [
      "Médecin Expert Assermenté",
      "Diplômé en Échographie",
      "Diplômé en Diabétologie de l'Université de Montpellier",
      "Diplômé en Expertise Médicale et Réparation des Dommages Corporels",
      "Diplômé en Addictologie"
    ],
    remarque: "Consultation sur rendez-vous."
  };

  const medecinDetailsArabic = {
    specialites: [
      "خبير محلف لدى المحاكم",
      "حائز على شهادة الفحص بالصدى",
      "  حائز على شهادة في داء السكري من جامعة مونبلييه بفرنسا",
      "حاصل على دبلوم في الخبرة الطبية وتعويض الأضرار الجسدية",
      "شهادة العلاج من الإدمان"
    ],
    remarque: "الاستشارة عن طريق موعد مسبق."
  };

  // Référence pour le debounce
  const searchTimeout = useRef(null);

  // Récupération des informations du médecin depuis le sessionStorage
  useEffect(() => {
    const medecinData = JSON.parse(sessionStorage.getItem("medecin"));
    if (!medecinData) {
      navigate("/login");
      return;
    }
    setMedecin(medecinData);
  }, [navigate]);

  // Récupération des informations du patient depuis l'API
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${num_dossier}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du patient:", error);
        alert("Impossible de récupérer les informations du patient.");
      }
    };

    if (num_dossier) {
      fetchPatient();
    }
  }, [num_dossier]);

  // Récupération des données statiques (quantités et posologies)
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [quantitesData, posologiesData] = await Promise.all([
          api.get("/quantites"),
          api.get("/posologies"),
        ]);
        setQuantites(quantitesData.data);
        setPosologies(posologiesData.data);
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      }
    };

    fetchStaticData();
  }, []);

  // Fonction de recherche avec debounce
  const debouncedSearch = useCallback((term) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setSearchTerm(term);

      const cachedMedicaments = JSON.parse(localStorage.getItem("medicaments")) || [];

      // Filtrage local
      const filtered = cachedMedicaments.filter((med) =>
        `${med.nom_commercial} ${med.nom_dci} ${med.dosage} ${med.forme}`
          .toLowerCase()
          .includes(term.toLowerCase())
      );

      setMedicaments(filtered);
    }, 300);
  }, []);

  const ajouterMedicament = () => {
    if (!nouveauMedicament.medicament || !nouveauMedicament.quantite || !nouveauMedicament.posologie) {
      alert("Veuillez sélectionner un médicament, une quantité et une posologie.");
      return;
    }
    setOrdonnance([...ordonnance, { ...nouveauMedicament, id: Date.now() }]);
    setNouveauMedicament({ medicament: null, quantite: null, posologie: null });
  };

  const supprimerMedicament = (id) => {
    setOrdonnance(ordonnance.filter(item => item.id !== id));
  };

  const enregistrerOrdonnance = async () => {
    if (ordonnance.length === 0) {
      alert("Veuillez ajouter au moins un médicament à l'ordonnance.");
      return;
    }

    const medicamentsFormates = ordonnance.map((item) => ({
      medicament_id: item.medicament.id,
      quantite_id: item.quantite.id,
      posologie_id: item.posologie.id,
    }));

    try {
      await api.post("/ordonnances", {
        patient_id: num_dossier,
        medecin_id: medecin?.id,
        date_visite: dateOrdonnance.toISOString().split('T')[0],
        medicaments: medicamentsFormates,
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

  // Formatage de la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Préparation des options pour le Select
  const medicamentOptions = medicaments.map(med => ({
    value: med.id,
    label: `${med.nom_commercial} - ${med.nom_dci} (${med.dosage} - ${med.forme})`,
  }));

  return (
    <div className="main-container">
      <button className="back-button no-print" onClick={() => navigate("/patients")}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="content-wrapper">
        {/* Section gauche - Ordonnance A5 */}
        <div className="ordonnance-preview">
          <div className="ordonnance-paper">
            {/* Infos du médecin en haut à gauche */}
            <div className="ordonnance-header">
              <div className="medecin-header">
                {medecin && (
                  <div>
                    <h3>Dr. {medecin.nom} {medecin.prenom}</h3>
                    <p>{medecinDetails.specialites.map((specialite, index) => (
                      <p key={index}>{specialite}</p>
                    ))}</p>
                    
                    <p className="specialite">{medecin.specialite}</p>
                   
                    <p className="medecin-adresse">{medecin.adresse}</p>
                    <p className="medecin-telephone">Tél: {medecin.telephone}</p>
                    
                    <p>{medecinDetails.remarque}</p>
                  </div>
                )}
              </div>

              <div className="medecin-header-arabic">
                {medecin && (
                  <div>
                    <h3>د. {medecin.nom} {medecin.prenom}</h3>
                    <p>{medecinDetailsArabic.specialites.map((specialite, index) => (
                      <p key={index}>{specialite}</p>
                    ))}</p>
                    <p className="specialite">{medecin.specialite}</p>
                    <p className="medecin-adresse">{medecin.adresse}</p>
                    <p className="medecin-telephone">هاتف: {medecin.telephone}</p>
                    <p>{medecinDetailsArabic.remarque}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Infos du patient et date */}
            <div className="patient-section">

             <div className="ordonnance-date">
              <strong> <p>Casablanca, le : {formatDate(dateOrdonnance)}</p> </strong> 
              </div>

              {patient && (
                <div className="patient-header">
                  <p><strong>Patient:</strong> {patient.nom} {patient.prenom}</p>
                </div>
              )}

              
            </div>

            {/* Médicaments */}
            <div className="medicaments-section">
              <ul className="medicaments-list">
                {ordonnance.length === 0 ? (
                  <li className="empty-message">Aucun médicament ajouté</li>
                ) : (
                  ordonnance.map((item) => (
                    <li key={item.id} className="medicament-item">
                      <div className="medicament-nom">
                        <strong>{item.medicament.nom_commercial}</strong> ({item.medicament.dosage} - {item.medicament.forme})
                      </div>
                      <div className="medicament-details">
                        {item.quantite.valeur} {item.quantite.unite} - {item.posologie.frequence} {item.posologie.moment_prise}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Section droite - Contrôles */}
        <div className="controls-panel no-print">
          <h2>Nouvelle Ordonnance</h2>

          <div className="date-container">
            <label htmlFor="date-ordonnance">Date de l'ordonnance:</label>
            <input
              type="date"
              id="date-ordonnance"
              value={dateOrdonnance.toISOString().split('T')[0]}
              onChange={(e) => setDateOrdonnance(new Date(e.target.value))}
            />
          </div>

          <div className="selection-container">
            <div className="medicament-search-container">
              <label>Médicament:</label>
              <Select
                options={medicamentOptions}
                onInputChange={debouncedSearch}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const selectedMedicament = medicaments.find(med => med.id === selectedOption.value);
                    setNouveauMedicament((prev) => ({ ...prev, medicament: selectedMedicament }));
                  }
                }}
                placeholder="Rechercher un médicament"
                isSearchable
                filterOption={() => true} // Désactiver le filtrage côté client
                value={nouveauMedicament.medicament ? {
                  value: nouveauMedicament.medicament.id,
                  label: `${nouveauMedicament.medicament.nom_commercial} - ${nouveauMedicament.medicament.nom_dci} (${nouveauMedicament.medicament.dosage} - ${nouveauMedicament.medicament.forme})`
                } : null}
                className="medicament-select"
              />
            </div>

            <div className="quantite-container">
              <label>Quantité:</label>
              <select
                value={nouveauMedicament.quantite?.id || ""}
                onChange={(e) => setNouveauMedicament((prev) => ({
                  ...prev,
                  quantite: quantites.find(q => q.id === parseInt(e.target.value))
                }))}
                className="quantite-select"
              >
                <option value="">Sélectionner une quantité</option>
                {quantites.map((q) => (
                  <option key={q.id} value={q.id}>{q.valeur} {q.unite}</option>
                ))}
              </select>
            </div>

            <div className="posologie-container">
              <label>Posologie:</label>
              <select
                value={nouveauMedicament.posologie?.id || ""}
                onChange={(e) => setNouveauMedicament((prev) => ({
                  ...prev,
                  posologie: posologies.find(p => p.id === parseInt(e.target.value))
                }))}
                className="posologie-select"
              >
                <option value="">Sélectionner une posologie</option>
                {posologies.map((p) => (
                  <option key={p.id} value={p.id}>{p.frequence} {p.moment_prise}</option>
                ))}
              </select>
            </div>

            <button className="btn add-btn" onClick={ajouterMedicament}>
              <FontAwesomeIcon icon={faPlus} /> Ajouter
            </button>
          </div>

          <table className="medicaments-table">
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Quantité</th>
                <th>Posologie</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordonnance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-message">Aucun médicament ajouté</td>
                </tr>
              ) : (
                ordonnance.map((item) => (
                  <tr key={item.id}>
                    <td>{`${item.medicament.nom_commercial} - ${item.medicament.nom_dci} (${item.medicament.dosage} - ${item.medicament.forme})`}</td>
                    <td>{`${item.quantite.valeur} ${item.quantite.unite}`}</td>
                    <td>{`${item.posologie.frequence} ${item.posologie.moment_prise}`}</td>
                    <td className="actions-cell">
                      <button className="btn delete-btn" onClick={() => supprimerMedicament(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="buttons-container">
            <button className="btn save-btn" onClick={enregistrerOrdonnance}>
              <FontAwesomeIcon icon={faSave} /> Enregistrer
            </button>

            <button className="btn print-btn" onClick={imprimerOrdonnance}>
              <FontAwesomeIcon icon={faPrint} /> Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheOrdonnance;
