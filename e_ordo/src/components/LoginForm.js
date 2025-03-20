import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/InscriptionForm.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", formData, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.token);
      alert("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Connectez-Vous</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          <button type="submit" className="submit-btn">Se connecter</button>
        </form>
        <p>Pas encore inscrit ? <a href="/inscription">Créer un compte</a></p>
      </div>
    </div>
  );
}
