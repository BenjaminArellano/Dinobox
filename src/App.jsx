import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import Header from "./components/Header";
import EnvioForm from "./components/EnvioForm";
import ConsultaEnvio from "./components/ConsultaEnvio";
import SeguimientoEnVivo from "./components/SeguimientoEnVivo";
import ControlTiempo from "./components/ControlTiempo";
import { ProgresoAutomaticoProvider } from "./context/ProgresoAutomaticoContext";

function App() {
  const [activeTab, setActiveTab] = useState("nuevo");

  return (
    <ProgresoAutomaticoProvider>
      <div className="App">
        <Header />
        
        <div className="container mt-4">
          {/* Control de tiempo visible en todas las pestañas */}
          <ControlTiempo />
          
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "nuevo" ? "active" : ""}`}
                onClick={() => setActiveTab("nuevo")}
              >
                📦 Nuevo Envío
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "consulta" ? "active" : ""}`}
                onClick={() => setActiveTab("consulta")}
              >
                🔍 Consultar Estado
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "seguimiento" ? "active" : ""}`}
                onClick={() => setActiveTab("seguimiento")}
              >
                📊 Seguimiento en Vivo
              </button>
            </li>
          </ul>

          <div className="tab-content mt-3">
            {activeTab === "nuevo" && <EnvioForm />}
            {activeTab === "consulta" && <ConsultaEnvio />}
            {activeTab === "seguimiento" && <SeguimientoEnVivo />}
          </div>
        </div>
      </div>
    </ProgresoAutomaticoProvider>
  );
}

export default App;