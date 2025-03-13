import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InscriptionPage from "./pages/InscriptionPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

