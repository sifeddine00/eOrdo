import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../axiosConfig";
import styles from "../assets/css/ForgotPassword.module.css";

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
    <div className={styles.forgotPasswordContainer}>
      <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
        <h2 className={styles.formTitle}>Réinitialiser votre mot de passe</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            className={styles.formInput}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password_confirmation" className={styles.formLabel}>Confirmer le mot de passe</label>
          <input
            type="password"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>

        <button type="submit" disabled={loading} className={styles.formButton}>
          {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  );
}
