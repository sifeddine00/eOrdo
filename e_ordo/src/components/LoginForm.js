import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Importer la configuration d'axios
import styles from "../assets/css/InscriptionForm.module.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // État de chargement
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser les erreurs
    setLoading(true); // Activer le chargement

    try {
      // Envoi des identifiants à l'API Laravel
      const response = await api.post("/login", formData, { withCredentials: true });

      // Stocker les informations utilisateur et le token dans sessionStorage
      sessionStorage.setItem("token", response.data.token); // Si vous retournez un token d'authentification
      sessionStorage.setItem("medecin", JSON.stringify(response.data.medecin)); // Stocke les informations utilisateur

      alert("Connexion réussie !");
      navigate("/dashboard"); // Rediriger vers le tableau de bord
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Email ou mot de passe incorrect !");
    } finally {
      setLoading(false); // Désactiver le chargement
    }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Connectez-Vous</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p>
          <a href="/forgot-password" className={styles.forgotPassword}>Mot de passe oublié ?</a>
        </p>
        <p>
          Pas encore inscrit ? <a href="/inscription">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}