import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../axiosConfig";  // Assure-toi d'importer ta configuration axios

export default function ResetPasswordForm() {
  const { token } = useParams();  // Récupère le token depuis l'URL
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");  // Pour stocker l'email
  const [password, setPassword] = useState("");  // Nouveau mot de passe
  const [passwordConfirmation, setPasswordConfirmation] = useState("");  // Confirmation du mot de passe
  const [error, setError] = useState("");  // Erreurs potentielles
  const [loading, setLoading] = useState(false);  // Pour indiquer le statut de la soumission

  // Effectuer des vérifications lorsque le composant est monté
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");

    if (!token || !emailParam) {
      navigate("/404"); // Redirige vers la page 404 si le token ou l'email est manquant
    } else {
      setEmail(emailParam);  // Si tout est valide, on set l'email
    }
  }, [token, location, navigate]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Faire une requête POST vers l'API Laravel pour réinitialiser le mot de passe
      const response = await api.post("/reset-password", {
        token,
        email,
        password,
      });

      if (response.data.success) {
        // Rediriger l'utilisateur vers la page de connexion après réinitialisation
        navigate("/login");
      } else {
        setError(response.data.message || "Une erreur est survenue");
      }
    } catch (error) {
      setError("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Réinitialiser votre mot de passe</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label className="reset-password-label" htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            className="reset-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="reset-password-label" htmlFor="password_confirmation">Confirmer le mot de passe</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            className="reset-password-input"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="reset-password-button"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  );
}
