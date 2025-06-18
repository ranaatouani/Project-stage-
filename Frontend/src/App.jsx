import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Importe tes layouts/pages
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import VerifyEmail from "layouts/authentication/components/verify-email";// <-- import du nouveau component

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} /> {/* <-- nouvelle route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;



