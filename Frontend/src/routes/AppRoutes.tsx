import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../Components/Layout/Layout"

import Dashboard from "../Pages/Dashboard";
import Chat from "../Pages/Chat";
import Configurações from "../Pages/Settings";
import Documentos from "../Pages/Documentos";
import Relatorio from "../Pages/Relatorio";

function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>

                    <Route path="/" element={<Dashboard />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                    <Route path="/chat/:id" element={<Chat />} />
                    <Route path="/documents" element={<Documentos />}></Route>
                    <Route path="/settings" element={<Configurações />}></Route>
                    <Route path="/relatorio" element={<Relatorio />}></Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes
