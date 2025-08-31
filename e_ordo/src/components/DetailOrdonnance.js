import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/DetailOrdonnance.css";

const DetailOrdonnance = () => {
  const { ordonnance_id } = useParams();
  const navigate = useNavigate();
  const [ordonnance, setOrdonnance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Informations supplémentaires du médecin (identiques à FicheOrdonnance)
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

  // Récupération des détails de l'ordonnance
  useEffect(() => {
    const fetchOrdonnanceDetails = async () => {
      try {
        const response = await api.get(`/ordonnances/${ordonnance_id}`);
        setOrdonnance(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'ordonnance:", error);
        setError("Impossible de récupérer les détails de l'ordonnance.");
        setLoading(false);
      }
    };

    fetchOrdonnanceDetails();
  }, [ordonnance_id]);

  // Formatage de la date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour imprimer l'ordonnance
  const imprimerOrdonnance = () => {
    window.print();
  };

  return (
    <div className="main-container">
       <div className="controls-panel no-print">
          <h2>Détails de l'Ordonnance</h2>
        </div>
      <button className="back-button no-print" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="content-wrapper">
        {/* Section gauche - Ordonnance A5 (similaire à FicheOrdonnance) */}
        <div className="ordonnance-preview">
          {loading ? (
            <div className="loading">Chargement des détails de l'ordonnance...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : ordonnance ? (
            <div className="ordonnance-paper">
              {/* Infos du médecin en haut à gauche */}
              <div className="ordonnance-header">
                <div className="medecin-header">
                  {ordonnance.medecin && (
                    <div>
                      <h3>Dr. {ordonnance.medecin.nom} {ordonnance.medecin.prenom}</h3>
                      <p>{medecinDetails.specialites.map((specialite, index) => (
                        <p key={index}>{specialite}</p>
                      ))}</p>
                      
                      <p className="specialite">{ordonnance.medecin.specialite}</p>
                    
                      <p className="medecin-adresse">{ordonnance.medecin.adresse}</p>
                      <p className="medecin-telephone">Tél: {ordonnance.medecin.telephone}</p>
                      
                      <p>{medecinDetails.remarque}</p>
                    </div>
                  )}
                </div>

                <div className="medecin-header-arabic">
                  {ordonnance.medecin && (
                    <div>
                      <h3>د.مهداوي الحسن</h3>
                      <p>{medecinDetailsArabic.specialites.map((specialite, index) => (
                        <p key={index}>{specialite}</p>
                      ))}</p>
                      <p className="specialite">الطب العام</p>
                      <p className="medecin-adresse">حي مولاي رشيد، المجموعة 4
45، شارع إدريس الحارثي - الدار البيضاء (04)
(محطة الحافلات رقم: 10-97-105-143)</p>
                      <p className="medecin-telephone">هاتف: {ordonnance.medecin.telephone}</p>
                      <p>{medecinDetailsArabic.remarque}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Infos du patient et date */}
              <div className="patient-section">
                <div className="ordonnance-date">
                  <strong><p>Casablanca, le : {formatDate(ordonnance.date_visite)}</p></strong> 
                </div>

                {ordonnance.patient && (
                  <div className="patient-header">
                    <p><strong>Patient:</strong> {ordonnance.patient.nom} {ordonnance.patient.prenom}</p>
                  </div>
                )}
              </div>

              {/* Médicaments */}
              <div className="medicaments-section">
                <ul className="medicaments-list">
                  {!ordonnance.medicaments || ordonnance.medicaments.length === 0 ? (
                    <li className="empty-message">Aucun médicament prescrit</li>
                  ) : (
                    ordonnance.medicaments.map((item, index) => (
                      <li key={index} className="medicament-item">
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
          ) : (
            <div className="not-found">Ordonnance non trouvée</div>
          )}
        </div>
      </div>
      <div className="buttons-container">
            <button className="btn print-btn" onClick={imprimerOrdonnance}>
              <FontAwesomeIcon icon={faPrint} /> Imprimer
            </button>
          </div>
    </div>
  );
};

export default DetailOrdonnance;
