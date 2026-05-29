import { Navigate, Route, Routes } from "react-router-dom";
import LeadCreatePage from "../pages/LeadCreatePage";
import LeadEditPage from "../pages/LeadEditPage";
import LeadListPage from "../pages/LeadListPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/leads" element={<LeadListPage />} />
        <Route path="/leads/new" element={<LeadCreatePage />} />
        <Route path="/leads/:id/edit" element={<LeadEditPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
