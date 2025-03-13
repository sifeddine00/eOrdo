import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/InscriptionForm.css";
import axios from 'axios';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [medecinsData, setMedecinsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Pour afficher les erreurs
  const navigate = useNavigate();

  useEffect(() => {
    // Charger les données des médecins depuis l'API
    axios.get("http://localhost:5000/medecins")
      .then(response => {
        setMedecinsData(response.data); // Stocker les données dans l'état
      })
      .catch(error => {
        console.error("Erreur lors du chargement des données : ", error);
        setErrorMessage("Impossible de charger les données des médecins.");
      });
  }, []); // Effectue cette requête une seule fois au montage du composant

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Recherche du médecin par email et mot de passe
    const user = medecinsData.find(m => m.email === formData.email);
    
    if (user) {
      // Si le médecin est trouvé, vérifier le mot de passe
      if (user.mot_de_passe === formData.password) {
        alert("Connexion réussie !");
        navigate("/dashboard"); // Redirige vers le tableau de bord
      } else {
        setErrorMessage("Mot de passe incorrect !");
      }
    } else {
      setErrorMessage("Email non trouvé !");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Connexion</h2>
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
          <button type="submit" className="submit-btn">Se connecter</button>
        </form>
        
        {errorMessage && <p className="error">{errorMessage}</p>} {/* Affichage de l'erreur */}

        <p>Pas encore inscrit ? <a href="/inscription">Créer un compte</a></p>
      </div>
    </div>
  );
}
