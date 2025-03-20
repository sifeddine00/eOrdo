import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";  // Importer la configuration axios
import "../assets/css/InscriptionForm.css";

export default function InscriptionForm() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    username: "",
    specialite: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    adresse: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser les erreurs
    setLoading(true); // Activer le chargement

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    try {
      // Étape 1 : Récupérer le token CSRF
      await api.get("/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Étape 2 : Envoi des données d'inscription
      const response = await api.post("/register", formData, {
        withCredentials: true,
      });

      // Vérifier si l'inscription est réussie
      if (response.status === 200) {
        alert("Inscription réussie !");
        
        // Rediriger vers la page de connexion après l'inscription réussie
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Affichage détaillé des erreurs Laravel
        const errors = Object.values(error.response.data.errors).flat().join("\n");
        setErrorMessage(errors);
      } else {
        setErrorMessage(error.response?.data?.message || "Erreur lors de l'inscription !");
      }
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Inscription</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
          <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
          <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
          <input type="text" name="specialite" placeholder="Spécialité" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" onChange={handleChange} required />
          <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} required />
          <input type="text" name="adresse" placeholder="Adresse" onChange={handleChange} required />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
      </div>
    </div>
  );
}
