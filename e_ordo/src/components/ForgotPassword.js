import React, { useState } from 'react';
import axios from '../axiosConfig';
import styles from '../assets/css/ForgotPassword.module.css';




function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/forgot-password', { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Erreur");
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
        <h2 className={styles.formTitle}>Mot de passe oublié</h2>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input 
            type="email" 
            id="email"
            placeholder="Saisir votre email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.formInput}
            required 
          />
        </div>
        <button type="submit" className={styles.formButton}>Envoyer le lien</button>
        {message && <p className={message.includes("erreur") ? styles.errorMessage : styles.successMessage}>{message}</p>}
      </form>
    </div>
  );
}
export default ForgotPasswordForm;
