import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InscriptionPage from "./pages/InscriptionPage";
import DashboardPage from "./pages/dashboardPage";
import api from "./axiosConfig";

export default function App() {
  useEffect(() => {
    // Récupérer le token CSRF dès le chargement de l'application
    api.get("/sanctum/csrf-cookie", { withCredentials: true });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
      </Routes>
    </Router>
  );
}

