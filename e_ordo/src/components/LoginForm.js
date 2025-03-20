import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // Importer la configuration d'axios
import "../assets/css/InscriptionForm.css";

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
      // Étape 1 : Assurez-vous que le token CSRF est bien récupéré
      await api.get("/sanctum/csrf-cookie", { withCredentials: true });

      // Étape 2 : Envoi des identifiants
      const response = await api.post("/login", formData, { withCredentials: true });

      // Stocker le token dans sessionStorage
      sessionStorage.setItem("token", response.data.token);

      alert("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Email ou mot de passe incorrect !");
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Connectez-Vous</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
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
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p>
          Pas encore inscrit ? <a href="/inscription">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}
