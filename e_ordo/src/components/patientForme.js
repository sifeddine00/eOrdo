import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Axios configuré
import styles from "../assets/css/Form.module.css"; // Fichier CSS

export default function AddPatientForm() {
  const [formData, setFormData] = useState({
    num_dossier: "", nom: "", prenom: "", téléphone: "", adresse: "",
    genre: "Homme", profession: "", status_familiale: "Célibataire",
    groupe_sanguin: "O+", allergies: "", note: "", date_naissance: "", email: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const medecin = JSON.parse(sessionStorage.getItem("medecin"));

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  const patientData = { ...formData, medecin_id: medecin.id }; // Associer au médecin

  try {
    await api.post("/add-patient", patientData);
    alert("✅ Patient ajouté avec succès !");
    navigate("/patients");
  } catch (error) {
    if (error.response?.status === 422) {
      setErrors(error.response.data.errors || {});
    } else {
      alert("❌ Erreur lors de l'ajout du patient.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Ajouter un Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-grid"]}>
            <div className={styles["form-column"]}>
              <input
                type="text"
                name="num_dossier"
                placeholder="N° Dossier"
                onChange={handleChange}
                required
              />
              {errors.num_dossier && <p className={styles.error}>{errors.num_dossier[0]}</p>}

              <input
                type="text"
                name="nom"
                placeholder="Nom"
                onChange={handleChange}
                required
              />
              {errors.nom && <p className={styles.error}>{errors.nom[0]}</p>}

              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                onChange={handleChange}
                required
              />
              {errors.prenom && <p className={styles.error}>{errors.prenom[0]}</p>}

              <input
                type="text"
                name="téléphone"
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
                placeholder="Adresse"
                onChange={handleChange}
                required
              />
              {errors.adresse && <p className={styles.error}>{errors.adresse[0]}</p>}

              <select name="genre" onChange={handleChange}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>

              <input
                type="text"
                name="profession"
                placeholder="Profession"
                onChange={handleChange}
                required
              />
              {errors.profession && <p className={styles.error}>{errors.profession[0]}</p>}

              <select name="status_familiale" onChange={handleChange}>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
              </select>
            </div>

            <div className={styles["form-column"]}>
              <select name="groupe_sanguin" onChange={handleChange}>
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
                placeholder="Allergies"
                onChange={handleChange}
              />
              <input
                type="date"
                name="date_naissance"
                onChange={handleChange}
                required
              />
              {errors.date_naissance && <p className={styles.error}>{errors.date_naissance[0]}</p>}

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              {errors.email && <p className={styles.error}>{errors.email[0]}</p>}
            </div>
          </div>

          <textarea
            name="note"
            placeholder="Notes"
            onChange={handleChange}
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </form>

        <button className={styles["btn-close"]} onClick={() => navigate(-1)}>
          ❌ Fermer
        </button>
      </div>
    </div>
  );
}
