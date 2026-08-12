import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute";
import Layout from "../Components/Layout/Layout";
import Chat from "../Pages/Chat";
import Dashboard from "../Pages/Dashboard";
import Documentos from "../Pages/Documentos";
import Relatorio from "../Pages/Relatorio";
import SettingsPage from "../Pages/Settings";
import Login from "../Pages/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/documents" element={<Documentos />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/relatorio" element={<Relatorio />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
