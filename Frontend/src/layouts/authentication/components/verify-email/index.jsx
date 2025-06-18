import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Vérification en cours...");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token manquant.");
      return;
    }

    axios.get(`http://localhost:8090/api/auth/verify?token=${token}`)
      .then(() => {
        setMessage("Votre email a bien été vérifié !");
        setTimeout(() => {
          // Forcer reload complet sur page login
          window.location.href = "/authentication/sign-in";
        }, 3000);
      })
      .catch(error => {
        setMessage("Échec de la vérification : " + (error.response?.data?.message || error.message));
      });
  }, [token]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Vérification de l'email</h2>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;


