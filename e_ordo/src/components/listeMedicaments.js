import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSync, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
import styles from "../assets/css/ListeMedicaments.module.css";
import AjouterMedicament from "./ajouterMedicament";
import api from "../axiosConfig";
 
const ListeMedicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [allMedicaments, setAllMedicaments] = useState([]); // Garde tous les médicaments pour la recherche
  const [searchCommercial, setSearchCommercial] = useState("");
  const [searchDci, setSearchDci] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const navigate = useNavigate();
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
  useEffect(() => {
    fetchMedicaments();
  }, []);
 
  const fetchMedicaments = async () => {
    try {
      const response = await api.get("/medicaments");
      setAllMedicaments(response.data); // Stocke tous les médicaments
<<<<<<< HEAD
      console.log(response.data);
=======
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
      setMedicaments(response.data.slice(-10)); // Affiche les 10 derniers
    } catch (error) {
      console.error("Erreur lors de la récupération des médicaments :", error);
    }
  };
 
  const handleAdd = () => {
    setModalVisible(true);
    setSelectedMedicament(null);
  };
 
  const handleEdit = (medicament) => {
    setModalVisible(true);
    setSelectedMedicament(medicament);
  };
<<<<<<< HEAD

  const handleDelete = async (id, nomCommercial) => {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer "${nomCommercial}" ?`);
    if (!confirmDelete) return;

=======
 
  const handleDelete = async (id, nomCommercial) => {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer "${nomCommercial}" ?`);
    if (!confirmDelete) return;
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
    try {
      await api.delete(`/medicaments/${id}`);
      fetchMedicaments();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
 
  const handleClearSearch = () => {
    setSearchCommercial("");
    setSearchDci("");
  };
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
  // Recherche dynamique dans allMedicaments
  const filteredMedicaments = allMedicaments.filter((med) =>
    med.nom_commercial.toLowerCase().includes(searchCommercial.toLowerCase()) &&
    med.nom_dci.toLowerCase().includes(searchDci.toLowerCase())
  );
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
  return (
    <div className={styles.container}>
      <button className="back-button" onClick={() => navigate("/dashboard")}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
      <h2 className={styles.title}>&#128137; Liste Des Médicaments</h2>
      <div className={styles["search-container"]}>
        <input
          type="text"
          placeholder="Rechercher par nom commercial..."
          className={styles["search-input"]}
          value={searchCommercial}
          onChange={(e) => setSearchCommercial(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rechercher par nom DCI..."
          className={styles["search-input"]}
          value={searchDci}
          onChange={(e) => setSearchDci(e.target.value)}
        />
        <button className={styles["refresh-btn"]} onClick={handleClearSearch}>
          <FontAwesomeIcon icon={faSync} />
        </button>
      </div>
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
      <div className={styles["button-container"]}>
        <button className={styles["add-btn"]} onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> Nouveau
        </button>
      </div>
<<<<<<< HEAD

=======
 
>>>>>>> b79a4d46bf6c010811d07456c71b86b9620c49e7
      <table className={styles["med-table"]}>
        <thead>
          <tr>
            <th>Nom Commercial</th>
            <th>Nom DCI</th>
            <th>Forme</th>
            <th>Dosage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchCommercial || searchDci
            ? filteredMedicaments.length > 0
              ? filteredMedicaments.map((med) => (
                  <tr key={med.id}>
                    <td>{med.nom_commercial}</td>
                    <td>{med.nom_dci}</td>
                    <td>{med.forme}</td>
                    <td>{med.dosage}</td>
                    <td className={styles.actions}>
                      <button className={styles["edit-btn"]} onClick={() => handleEdit(med)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className={styles["delete-btn"]} onClick={() => handleDelete(med.id, med.nom_commercial)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>Aucun médicament trouvé.</td>
                </tr>
              )
            : medicaments.map((med) => (
                <tr key={med.id}>
                  <td>{med.nom_commercial}</td>
                  <td>{med.nom_dci}</td>
                  <td>{med.forme}</td>
                  <td>{med.dosage}</td>
                  <td className={styles.actions}>
                    <button className={styles["edit-btn"]} onClick={() => handleEdit(med)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className={styles["delete-btn"]} onClick={() => handleDelete(med.id, med.nom_commercial)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
 
      {modalVisible && (
        <AjouterMedicament
          onClose={() => setModalVisible(false)}
          medicament={selectedMedicament}
          fetchMedicaments={fetchMedicaments}
        />
      )}
    </div>
  );
};
 
export default ListeMedicaments;
 
 