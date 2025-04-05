import React, { useState } from 'react';
import axios from '../axiosConfig';

import '../assets/css/ForgotPassword.module.css';




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
    <form onSubmit={handleSubmit}>
      <h2>Mot de passe oublié</h2>
      <input type="email" placeholder="Saisir Votre email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Envoyer le lien</button>
      {message && <p>{message}</p>}
    </form>
  );
}
export default ForgotPasswordForm;
