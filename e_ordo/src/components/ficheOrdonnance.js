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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dateOrdonnance, setDateOrdonnance] = useState(new Date());
  
  // Informations du patient et du médecin
  const [patient, setPatient] = useState(null);
  const [medecin, setMedecin] = useState(null);
  
  // Référence pour le debounce
  const searchTimeout = useRef(null);
  
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${num_dossier}`);
        console.log(response.data); // Vérifier ce que vous obtenez ici
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
  
  // Séparation des appels API pour les données statiques
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
      setPage(1);
      setMedicaments([]);
    }, 300);
  }, []);

  // Récupération des médicaments
  useEffect(() => {
    const fetchMedicaments = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      try {
        const response = await api.get("/medicaments", { 
          params: { 
            search: searchTerm, 
            limit: 20,
            page 
          }
        });
        
        setMedicaments((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
        setHasMore(response.data.length === 20);
      } catch (error) {
        console.error("Erreur de récupération des médicaments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicaments();
  }, [searchTerm, page, isLoading]);

  // Optimisation du scroll avec IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    
    const sentinel = document.querySelector('.load-more-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }
    
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, isLoading]);

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
    
    try {
      await api.post("/ordonnances", {
        patient_id: num_dossier,
        medecin_id: medecin?.id,
        medicaments: ordonnance,
        date_ordonnance: dateOrdonnance.toISOString().split('T')[0]
      });
      alert("Ordonnance enregistrée avec succès !");
      // Optionnel: redirection vers la liste des patients
      // navigate("/patients");
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
    <div className="ordonnance-container">
      <button className="back-button" onClick={() => navigate("/patients")}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      
      <h2>Nouvelle Ordonnance</h2>
      
      {/* Informations du médecin et du patient */}
      <div className="ordonnance-header">
        <div className="medecin-info">
          <h3>Médecin</h3>
          {medecin && (
            <>
              <p><strong>Nom:</strong> Dr. {medecin.nom} {medecin.prenom}</p>
              <p><strong>Spécialité:</strong> {medecin.specialite}</p>
              <p><strong>Adresse:</strong> {medecin.adresse}</p>
              <p><strong>Téléphone:</strong> {medecin.telephone}</p>
              <p><strong>Email:</strong> {medecin.email}</p>
            </>
          )}
        </div>
        
        <div className="patient-info">
          <h3>Patient</h3>
          {patient && (
            <>
              <p><strong>N° Dossier:</strong> {patient.num_dossier}</p>
              <p><strong>Nom:</strong> {patient.nom} {patient.prenom}</p>
              <p><strong>Né(e) le:</strong> {patient.date_naissance && formatDate(patient.date_naissance)}</p>
              <p><strong>Téléphone:</strong> {patient.téléphone}</p>
              <p><strong>Email:</strong> {patient.email}</p>
            </>
          )}
        </div>
      </div>
      
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
          isLoading={isLoading}
          filterOption={() => true} // Désactiver le filtrage côté client
          value={nouveauMedicament.medicament ? {
            value: nouveauMedicament.medicament.id,
            label: `${nouveauMedicament.medicament.nom_commercial} - ${nouveauMedicament.medicament.nom_dci} (${nouveauMedicament.medicament.dosage} - ${nouveauMedicament.medicament.forme})`
          } : null}
          className="medicament-select"
        />

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

      <div className="footer-info">
        <p>Ordonnance délivrée le {formatDate(dateOrdonnance)}</p>
        <p className="signature">Signature et cachet du médecin</p>
      </div>

      <div className="buttons-container">
        <button className="btn save-btn" onClick={enregistrerOrdonnance}>
          <FontAwesomeIcon icon={faSave} /> Enregistrer
        </button>

        <button className="btn print-btn" onClick={imprimerOrdonnance}>
          <FontAwesomeIcon icon={faPrint} /> Imprimer
        </button>
      </div>
      
      {hasMore && <div className="load-more-sentinel" style={{ height: "20px", margin: "10px 0" }}></div>}
    </div>
  );
};

export default FicheOrdonnance;