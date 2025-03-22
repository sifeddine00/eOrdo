import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Importer Axios
import styles from "../assets/css/Form.module.css"; // Fichier CSS

export default function AddPatientForm() {
  const [formData, setFormData] = useState({
    num_dossier: "",
    nom: "",
    prenom: "",
    téléphone: "",
    adresse: "",
    genre: "Homme",
    profession: "",
    status_familiale: "Célibataire",
    groupe_sanguin: "O+",
    allergies: "",
    note: "",
    date_naissance: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await api.get("/sanctum/csrf-cookie"); // Sécurisation CSRF
      await api.post("/patients", formData);

      alert("Patient ajouté avec succès !");
      navigate("/patients"); // Redirection vers la liste des patients
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erreur lors de l'ajout du patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1); // Retourner à la page précédente
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Ajouter un Patient</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formColumn}>
              <input type="text" name="num_dossier" placeholder="N° Dossier" onChange={handleChange} required />
              <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
              <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
              <input type="text" name="téléphone" placeholder="Téléphone" onChange={handleChange} required />
            </div>
            <div className={styles.formColumn}>
              <input type="text" name="adresse" placeholder="Adresse" onChange={handleChange} required />
              <select name="genre" onChange={handleChange}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
              <input type="text" name="profession" placeholder="Profession" onChange={handleChange} required />
              <select name="status_familiale" onChange={handleChange}>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
              </select>
            </div>
            <div className={styles.formColumn}>
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
              <input type="text" name="allergies" placeholder="Allergies" onChange={handleChange} />
              <input type="date" name="date_naissance" placeholder="Date de naissance" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
          </div>
          <textarea name="note" placeholder="Notes" onChange={handleChange}></textarea>
          <button type="submit" disabled={loading}>{loading ? "Ajout en cours..." : "Ajouter"}</button>
        </form>
        <div className={styles.buttonGroup}>
          <button className={styles.btnClose} onClick={handleClose}>❌ Fermer</button>
        </div>
      </div>
    </div>
  );
}