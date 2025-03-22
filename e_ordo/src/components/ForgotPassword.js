import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../assets/css/ForgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie"); // Récupération du token CSRF

      const response = await axios.post("/forgot-password", { email });

      setMessage(response.data.message || "Un email de réinitialisation a été envoyé !");
      
      // Redirection après 3 secondes
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
        <h2>🔐 Mot de passe oublié ?</h2>
        <p>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Adresse e-mail</label>
          <div className="input-container">
            <span>📧</span>
            <input
              type="email"
              name="email"
              placeholder="Entrez votre e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading || !email}>
            {loading ? "Envoi en cours..." : "📩 Envoyer le lien"}
          </button>
        </form>

        <p className="back-to-login">
          🔙 <a href="/login">Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
}
