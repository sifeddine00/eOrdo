import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
 
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

    adresse: ""

  });
 
  const navigate = useNavigate();
 
  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });

  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register", formData);
      alert("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      alert("Erreur lors de l'inscription !");
    }
  };
  
 
  return (
<div className="container">
<div className="card">
<h2>Inscription</h2>
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
<button type="submit" className="submit-btn">S'inscrire</button>
</form>
<p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
</div>
</div>

  );

}

 