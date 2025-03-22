import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axiosConfig"; // Importer la configuration axios
import "../assets/css/ResetPassword.module.css"; // Style pour la page de réinitialisation

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("");

  useEffect(() => {
    // Extraire le token de la query string de l'URL
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "");
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Récupérer le token CSRF
      await axios.get("/sanctum/csrf-cookie");

      // Envoyer la demande de réinitialisation du mot de passe
      const response = await axios.post("/reset-password", {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(response.data.message || "Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur s'est produite !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔐 Réinitialisation du mot de passe</h2>
        <p>Veuillez saisir votre nouveau mot de passe.</p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="Entrez votre nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirmez votre nouveau mot de passe"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={6}
          />

          <button type="submit" className="submit-btn" disabled={loading || !password || !passwordConfirmation}>
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </form>

        <p className="back-to-login">
          🔙 <a href="/login">Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
}
