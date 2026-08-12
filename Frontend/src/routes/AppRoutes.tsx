import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import Chat from "../Pages/Chat";
import Dashboard from "../Pages/Dashboard";
import Documentos from "../Pages/Documentos";
import Relatorio from "../Pages/Relatorio";
import SettingsPage from "../Pages/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/documents" element={<Documentos />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/relatorio" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
