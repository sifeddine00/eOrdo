import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import styles from "../assets/css/InscriptionForm.module.css";

export default function InscriptionForm() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    username: "",
    specialite: "",
    email: "",
    password: "",
    password_confirmation: "",
    telephone: "",
    adresse: "",
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

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage("Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie", { withCredentials: true });
      const response = await api.post("/register", formData, { withCredentials: true });

      if (response.status === 201) {
        window.alert("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat().join("\n");
        setErrorMessage(errors);
      } else {
        setErrorMessage(error.response?.data?.message || "Erreur lors de l'inscription !");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Inscription</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <h3>Informations en français</h3>
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
          <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
          <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
          <input type="text" name="specialite" placeholder="Spécialité" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          <input type="password" name="password_confirmation" placeholder="Confirmer le mot de passe" onChange={handleChange} required />
          <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} required />
          <input type="text" name="adresse" placeholder="Adresse" onChange={handleChange} required />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
      </div>
    </div>
  );
}