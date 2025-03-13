import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/InscriptionForm.css";
// Importation d'axios pour faciliter les requêtes HTTP
import axios from "axios";

export default function InscriptionForm() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    specialite: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    // Création du nouvel utilisateur (Médecin) selon la structure JSON donnée
    const newMedecin = {
      id: new Date().getTime(), // Générer un ID unique basé sur l'heure actuelle
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      mot_de_passe: formData.password, // ⚠️ À hasher côté backend !
      specialite: formData.specialite,
      patients: [] // Liste vide des patients pour cet utilisateur
    };

    try {
      // Envoi des données au serveur json-server
      await axios.post("http://localhost:5000/medecins", newMedecin);
      alert("Inscription réussie !");
      navigate("/login"); // Redirection vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="prenom" 
            placeholder="Prénom" 
            onChange={handleChange} 
            value={formData.prenom} 
            required 
          />
          <input 
            type="text" 
            name="nom" 
            placeholder="Nom" 
            onChange={handleChange} 
            value={formData.nom} 
            required 
          />
          <input 
            type="text" 
            name="specialite" 
            placeholder="Spécialité" 
            onChange={handleChange} 
            value={formData.specialite} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            value={formData.email} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            onChange={handleChange} 
            value={formData.password} 
            required 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirmer le mot de passe" 
            onChange={handleChange} 
            value={formData.confirmPassword} 
            required 
          />
          <button type="submit" className="submit-btn">S'inscrire</button>
        </form>
        <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
      </div>
    </div>
  );
}
