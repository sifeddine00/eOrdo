import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../axiosConfig";

export default function ResetPasswordForm() {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ message de succès
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");

    if (!token || !emailParam) {
      navigate("/404");
    } else {
      setEmail(emailParam);
    }
  }, [token, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.message === "Password reset successfully.") {
        setSuccessMessage("Mot de passe mis à jour avec succès 🎉");
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Une erreur est survenue");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(error.response?.data?.message || "Une erreur est survenue, veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Réinitialiser votre mot de passe</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
          <input
            type="password"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  );
}
