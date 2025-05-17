import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import InscriptionForm from "./components/inscriptionForm";
import DashboardMedical from "./components/dashboard";
import ForgotPasswordForm from "./components/ForgotPassword";
import ResetPasswordForm from "./components/ResetPassword";
import AddPatientForm from "./components/patientForme";
import PatientList from "./components/PatientList";
import EditPatientForm from "./components/EditPatientForm";
import PatientDetails from "./components/PatientDetails";
import AjouterMedicament from "./components/ajouterMedicament";
import ListeMedicaments from "./components/listeMedicaments";
import FicheOrdonnance from "./components/ficheOrdonnance";
import DetailOrdonnance from "./components/DetailOrdonnance";

import api from "./axiosConfig";

export default function App() {
  useEffect(() => {
    // Récupérer le token CSRF dès le chargement de l'application
    api.get("/sanctum/csrf-cookie", { withCredentials: true });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/inscription" element={<InscriptionForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<DashboardMedical />} />
        <Route path="/add-patient" element={<AddPatientForm />} />
        <Route path="/edit-patient/:num_dossier" element={<EditPatientForm />} />
        <Route path="/details-patient/:num_dossier" element={<PatientDetails />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/add-medicament" element={<AjouterMedicament />} />
        <Route path="/medicaments" element={<ListeMedicaments />} />
        <Route path="/cree-ordonnance/:num_dossier" element={<FicheOrdonnance />} />
        <Route path="/detail-ordonnance/:ordonnance_id" element={<DetailOrdonnance />} />
      
      </Routes>
    </Router>
  );
}