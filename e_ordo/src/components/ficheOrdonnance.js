import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPrint, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import "../assets/css/FicheOrdonnance.css";

const FicheOrdonnance = () => {
  const { num_dossier } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editOrdonnanceId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!editOrdonnanceId);

  const [quantites, setQuantites] = useState([]);
  const [posologies, setPosologies] = useState([]);
  const [ordonnance, setOrdonnance] = useState([]);
  const [nouveauMedicament, setNouveauMedicament] = useState({ medicament: null, quantite: null, posologie: null });
  const [medicaments, setMedicaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateOrdonnance, setDateOrdonnance] = useState(new Date());
  const [diagnostic, setDiagnostic] = useState("");
  
  // États pour l'ajout de nouvelles posologies et quantités
  const [nouvelleQuantite, setNouvelleQuantite] = useState({ valeur: "", unite: "" });
  const [nouvellePosologie, setNouvellePosologie] = useState({ frequence: "", moment_prise: "" });
  const [showQuantiteForm, setShowQuantiteForm] = useState(false);
  const [showPosologieForm, setShowPosologieForm] = useState(false);
  const [isAddingQuantite, setIsAddingQuantite] = useState(false);
  const [isAddingPosologie, setIsAddingPosologie] = useState(false);

  // Informations du patient et du médecin
  const [patient, setPatient] = useState(null);
  const [medecin, setMedecin] = useState(null);

  // Informations supplémentaires du médecin
  const [medecinDetails, setMedecinDetails] = useState({
    specialites: [
      "Médecin Expert Assermenté",
      "Diplômé en Échographie",
      "Diplômé en Diabétologie de l'Université de Montpellier",
      "Diplômé en Expertise Médicale et Réparation des Dommages Corporels",
      "Diplômé en Addictologie"
    ],
    remarque: "Consultation sur rendez-vous."
  });

  const [medecinDetailsArabic, setMedecinDetailsArabic] = useState({
    specialites: [
      "خبير محلف لدى المحاكم",
      "حائز على شهادة الفحص بالصدى",
      "حائز على شهادة في داء السكري من جامعة مونبلييه بفرنسا",
      "حاصل على دبلوم في الخبرة الطبية وتعويض الأضرار الجسدية",
      "شهادة العلاج من الإدمان"
    ],
    remarque: "الاستشارة عن طريق موعد مسبق.",
    nom: "",
    prenom: "",
    specialite: "الطب العام",
    adresse: "حي مولاي رشيد، المجموعة 4\n45، شارع إدريس الحارثي - الدار البيضاء (04)\n(محطة الحافلات رقم: 10-97-105-143)",
    telephone: ""
  });

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
    
    // Mise à jour des détails en arabe avec les données du médecin connecté
    setMedecinDetailsArabic(prev => ({
      ...prev,
      nom: medecinData.nom_ar || medecinData.nom,
      prenom: medecinData.prenom_ar || medecinData.prenom,
      specialite: medecinData.specialite_ar || "الطب العام",
      adresse: medecinData.adresse_ar || prev.adresse,
      telephone: medecinData.telephone
    }));
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

  // Récupération des données de l'ordonnance existante si on est en mode édition
  useEffect(() => {
    const fetchOrdonnanceData = async () => {
      if (!editOrdonnanceId) return;
      
      try {
        const response = await api.get(`/ordonnances/${editOrdonnanceId}`);
        const ordonnanceData = response.data;
        
        // Mettre à jour la date de l'ordonnance et le diagnostic
        if (ordonnanceData.date_visite) {
          setDateOrdonnance(new Date(ordonnanceData.date_visite));
        }
        
        // Mettre à jour le diagnostic s'il existe
        if (ordonnanceData.diagnostic) {
          setDiagnostic(ordonnanceData.diagnostic);
        }
        
        // Récupérer les médicaments associés à l'ordonnance
        if (ordonnanceData.medicaments && ordonnanceData.medicaments.length > 0) {
          // Récupérer les détails complets de chaque médicament
          const medicamentsComplets = await Promise.all(
            ordonnanceData.medicaments.map(async (med) => {
              try {
                // Récupérer les détails du médicament
                const medicamentResponse = await api.get(`/medicaments/${med.medicament_id}`);
                const medicament = medicamentResponse.data;
                
                // Récupérer les détails de la quantité
                const quantite = quantites.find(q => q.id === med.quantite_id) || 
                                (await api.get(`/quantites/${med.quantite_id}`)).data;
                
                // Récupérer les détails de la posologie
                const posologie = posologies.find(p => p.id === med.posologie_id) || 
                                 (await api.get(`/posologies/${med.posologie_id}`)).data;
                
                return {
                  id: Date.now() + Math.random(), // Générer un ID unique pour l'interface
                  medicament,
                  quantite,
                  posologie
                };
              } catch (error) {
                console.error(`Erreur lors de la récupération des détails du médicament ${med.medicament_id}:`, error);
                return null;
              }
            })
          );
          
          // Filtrer les médicaments null (en cas d'erreur)
          const medicamentsValides = medicamentsComplets.filter(med => med !== null);
          setOrdonnance(medicamentsValides);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ordonnance:", error);
        alert("Impossible de récupérer les détails de l'ordonnance.");
      }
    };
    
    if (quantites.length > 0 && posologies.length > 0) {
      fetchOrdonnanceData();
    }
  }, [editOrdonnanceId, quantites, posologies]);

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

  // Fonction pour ajouter une nouvelle quantité
  const ajouterNouvelleQuantite = async () => {
    if (!nouvelleQuantite.valeur || !nouvelleQuantite.unite) {
      alert("Veuillez remplir tous les champs pour la nouvelle quantité.");
      return;
    }
    
    setIsAddingQuantite(true);
    
    try {
      const response = await api.post("/quantites", nouvelleQuantite);
      const nouvelleQuantiteAjoutee = response.data;
      
      // Mettre à jour la liste des quantités
      setQuantites([...quantites, nouvelleQuantiteAjoutee]);
      
      // Sélectionner automatiquement la nouvelle quantité
      setNouveauMedicament(prev => ({ ...prev, quantite: nouvelleQuantiteAjoutee }));
      
      // Réinitialiser le formulaire
      setNouvelleQuantite({ valeur: "", unite: "" });
      setShowQuantiteForm(false);
      
      alert("Nouvelle quantité ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la quantité:", error);
      alert("Erreur lors de l'ajout de la quantité.");
    } finally {
      setIsAddingQuantite(false);
    }
  };
  
  // Fonction pour ajouter une nouvelle posologie
  const ajouterNouvellePosologie = async () => {
    if (!nouvellePosologie.frequence || !nouvellePosologie.moment_prise) {
      alert("Veuillez remplir tous les champs pour la nouvelle posologie.");
      return;
    }
    
    setIsAddingPosologie(true);
    
    try {
      const response = await api.post("/posologies", nouvellePosologie);
      const nouvellePosologieAjoutee = response.data;
      
      // Mettre à jour la liste des posologies
      setPosologies([...posologies, nouvellePosologieAjoutee]);
      
      // Sélectionner automatiquement la nouvelle posologie
      setNouveauMedicament(prev => ({ ...prev, posologie: nouvellePosologieAjoutee }));
      
      // Réinitialiser le formulaire
      setNouvellePosologie({ frequence: "", moment_prise: "" });
      setShowPosologieForm(false);
      
      alert("Nouvelle posologie ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la posologie:", error);
      alert("Erreur lors de l'ajout de la posologie.");
    } finally {
      setIsAddingPosologie(false);
    }
  };

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
      if (isEditMode) {
        // Mise à jour d'une ordonnance existante
        await api.put(`/ordonnances/${editOrdonnanceId}`, {
          patient_id: num_dossier,
          medecin_id: medecin?.id,
          date_visite: dateOrdonnance.toISOString().split('T')[0],
          diagnostic: diagnostic || null,
          medicaments: medicamentsFormates,
        });
        alert("Ordonnance mise à jour avec succès !");
      } else {
        // Création d'une nouvelle ordonnance
        await api.post("/ordonnances", {
          patient_id: num_dossier,
          medecin_id: medecin?.id,
          date_visite: dateOrdonnance.toISOString().split('T')[0],
          diagnostic: diagnostic || null,
          medicaments: medicamentsFormates,
        });
        alert("Ordonnance enregistrée avec succès !");
      }
      
      // Rediriger vers la page des détails du patient après l'enregistrement
      navigate(`/details-patient/${num_dossier}`);
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
                    <h3>د.{medecinDetailsArabic.nom} {medecinDetailsArabic.prenom}</h3>
                    <p>{medecinDetailsArabic.specialites.map((specialite, index) => (
                      <p key={index}>{specialite}</p>
                    ))}</p>
                    <p className="specialite">{medecinDetailsArabic.specialite}</p>
                    <p className="medecin-adresse">{medecinDetailsArabic.adresse}</p>
                    <p className="medecin-telephone">هاتف: {medecinDetailsArabic.telephone}</p>
                    <p>{medecinDetailsArabic.remarque}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Infos du patient et date */}
            <div className="patient-section">
              <div className="ordonnance-date">
                <strong><p>Casablanca, le : {formatDate(dateOrdonnance)}</p></strong>
              </div>

              {patient && (
                <div className="patient-header">
                  <p><strong>Patient:</strong> {patient.nom} {patient.prenom}</p>
                </div>
              )}
            </div>

            {/* Médicaments et diagnostic */}
            <div className="medicaments-section">
              {/* Titre de la section */}
              
              
              {/* Liste des médicaments et diagnostic */}
              <ul className="medicaments-list">
                {/* Diagnostic en premier comme un médicament */}
                {diagnostic && (
                  <li className="medicament-item diagnostic-item">
                    <div className="medicament-nom">
                      <strong>Diagnostic</strong>
                    </div>
                    <div className="medicament-details">
                      {diagnostic}
                    </div>
                  </li>
                )}
                
                {/* Séparateur si diagnostic et médicaments */}
                {diagnostic && ordonnance.length > 0 && (
                  <li className="separator"></li>
                )}
                
                {/* Liste des médicaments */}
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
          <h2>{isEditMode ? 'Modifier Ordonnance' : 'Nouvelle Ordonnance'}</h2>

          <div className="date-container">
            <label htmlFor="date-ordonnance">Date de l'ordonnance:</label>
            <input
              type="date"
              id="date-ordonnance"
              value={dateOrdonnance.toISOString().split('T')[0]}
              onChange={(e) => setDateOrdonnance(new Date(e.target.value))}
            />
          </div>
          
          <div className="diagnostic-container">
            <label htmlFor="diagnostic">Diagnostic:</label>
            <textarea
              id="diagnostic"
              value={diagnostic}
              onChange={(e) => setDiagnostic(e.target.value)}
              placeholder="Entrez le diagnostic du patient"
              rows="3"
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
              <div className="select-with-add">
                <select
                  value={nouveauMedicament.quantite?.id || ""}
                  onChange={(e) => {
                    if (e.target.value === "nouvelle") {
                      setShowQuantiteForm(true);
                    } else {
                      setNouveauMedicament((prev) => ({
                        ...prev,
                        quantite: quantites.find(q => q.id === parseInt(e.target.value))
                      }));
                    }
                  }}
                  className="quantite-select"
                  disabled={isAddingQuantite}
                >
                  <option value="">Sélectionner une quantité</option>
                  {quantites.map((q) => (
                    <option key={q.id} value={q.id}>{q.valeur} {q.unite}</option>
                  ))}
                  <option value="nouvelle">+ Ajouter une nouvelle quantité</option>
                </select>
              </div>
              
              {showQuantiteForm && (
                <div className="new-item-form">
                  <div className="form-group">
                    <label>Valeur:</label>
                    <input 
                      type="text" 
                      value={nouvelleQuantite.valeur} 
                      onChange={(e) => setNouvelleQuantite(prev => ({ ...prev, valeur: e.target.value }))} 
                      placeholder="Ex: 1, 2, 3..."
                      disabled={isAddingQuantite}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unité:</label>
                    <input 
                      type="text" 
                      value={nouvelleQuantite.unite} 
                      onChange={(e) => setNouvelleQuantite(prev => ({ ...prev, unite: e.target.value }))} 
                      placeholder="Ex: boîte, comprimé..."
                      disabled={isAddingQuantite}
                    />
                  </div>
                  <div className="form-buttons">
                    <button 
                      className="btn btn-sm add-btn" 
                      onClick={ajouterNouvelleQuantite}
                      disabled={isAddingQuantite}
                    >
                      {isAddingQuantite ? "Ajout en cours..." : "Ajouter"}
                    </button>
                    <button 
                      className="btn btn-sm cancel-btn" 
                      onClick={() => {
                        setShowQuantiteForm(false);
                        setNouvelleQuantite({ valeur: "", unite: "" });
                      }}
                      disabled={isAddingQuantite}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="posologie-container">
              <label>Posologie:</label>
              <div className="select-with-add">
                <select
                  value={nouveauMedicament.posologie?.id || ""}
                  onChange={(e) => {
                    if (e.target.value === "nouvelle") {
                      setShowPosologieForm(true);
                    } else {
                      setNouveauMedicament((prev) => ({
                        ...prev,
                        posologie: posologies.find(p => p.id === parseInt(e.target.value))
                      }));
                    }
                  }}
                  className="posologie-select"
                  disabled={isAddingPosologie}
                >
                  <option value="">Sélectionner une posologie</option>
                  {posologies.map((p) => (
                    <option key={p.id} value={p.id}>{p.frequence} {p.moment_prise}</option>
                  ))}
                  <option value="nouvelle">+ Ajouter une nouvelle posologie</option>
                </select>
              </div>
              
              {showPosologieForm && (
                <div className="new-item-form">
                  <div className="form-group">
                    <label>Fréquence:</label>
                    <input 
                      type="text" 
                      value={nouvellePosologie.frequence} 
                      onChange={(e) => setNouvellePosologie(prev => ({ ...prev, frequence: e.target.value }))} 
                      placeholder="Ex: 1 fois par jour, 2 fois par jour..."
                      disabled={isAddingPosologie}
                    />
                  </div>
                  <div className="form-group">
                    <label>Moment de prise:</label>
                    <input 
                      type="text" 
                      value={nouvellePosologie.moment_prise} 
                      onChange={(e) => setNouvellePosologie(prev => ({ ...prev, moment_prise: e.target.value }))} 
                      placeholder="Ex: avant les repas, après les repas..."
                      disabled={isAddingPosologie}
                    />
                  </div>
                  <div className="form-buttons">
                    <button 
                      className="btn btn-sm add-btn" 
                      onClick={ajouterNouvellePosologie}
                      disabled={isAddingPosologie}
                    >
                      {isAddingPosologie ? "Ajout en cours..." : "Ajouter"}
                    </button>
                    <button 
                      className="btn btn-sm cancel-btn" 
                      onClick={() => {
                        setShowPosologieForm(false);
                        setNouvellePosologie({ frequence: "", moment_prise: "" });
                      }}
                      disabled={isAddingPosologie}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
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
