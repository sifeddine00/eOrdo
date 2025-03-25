import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import styles from "../assets/css/Form.module.css"; // Fichier CSS
 
export default function EditPatientForm() {
  const { num_dossier } = useParams();
  const [formData, setFormData] = useState({
    num_dossier: "", nom: "", prenom: "", téléphone: "", adresse: "",
    genre: "Homme", profession: "", status_familiale: "Célibataire",
    groupe_sanguin: "O+", allergies: "", note: "", date_naissance: "", email: ""
  });
 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${num_dossier}`);
        setFormData(response.data);
      } catch (error) {
        alert("❌ Erreur lors du chargement des données.");
        navigate("/patients");
      }
    };
    fetchPatient();
  }, [num_dossier, navigate]);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
 
    try {
      await api.put(`/patients/${num_dossier}`, formData);
      alert("✅ Patient mis à jour avec succès !");
      navigate("/patients"); // Redirection vers la liste des patients
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert("❌ Erreur lors de la mise à jour du patient.");
      }
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Modifier le Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-grid"]}>
            <div className={styles["form-column"]}>
              <input
                type="text"
                name="num_dossier"
                value={formData.num_dossier}
                placeholder="N° Dossier"
                onChange={handleChange}
                disabled
              />
 
              <input
                type="text"
                name="nom"
                value={formData.nom}
                placeholder="Nom"
                onChange={handleChange}
                required
              />
              {errors.nom && <p className={styles.error}>{errors.nom[0]}</p>}
 
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                placeholder="Prénom"
                onChange={handleChange}
                required
              />
              {errors.prenom && <p className={styles.error}>{errors.prenom[0]}</p>}
 
              <input
                type="text"
                name="téléphone"
                value={formData.téléphone}
                placeholder="Téléphone"
                onChange={handleChange}
                required
              />
              {errors.téléphone && <p className={styles.error}>{errors.téléphone[0]}</p>}
            </div>
 
            <div className={styles["form-column"]}>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                placeholder="Adresse"
                onChange={handleChange}
                required
              />
 
              <select name="genre" value={formData.genre} onChange={handleChange}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
 
              <input
                type="text"
                name="profession"
                value={formData.profession}
                placeholder="Profession"
                onChange={handleChange}
                required
              />
 
              <select name="status_familiale" value={formData.status_familiale} onChange={handleChange}>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
              </select>
            </div>
 
            <div className={styles["form-column"]}>
              <select name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleChange}>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
 
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                placeholder="Allergies"
                onChange={handleChange}
              />
 
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                required
              />
 
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                required
                disabled
              />
            </div>
          </div>
 
          <textarea
            name="note"
            value={formData.note}
            placeholder="Notes"
            onChange={handleChange}
          ></textarea>
 
          <button type="submit" disabled={loading}>
            {loading ? "Mise à jour en cours..." : "Modifier"}
          </button>
        </form>
 
        <button className={styles["btn-close"]} onClick={() => navigate(-1)}>
          ❌ Fermer
        </button>
      </div>
    </div>
  );
}
 
 