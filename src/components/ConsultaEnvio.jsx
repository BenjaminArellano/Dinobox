import React, { useState } from 'react';
import axios from "axios";

const ConsultaEnvio = () => {
  const [codigo, setCodigo] = useState('');
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsulta = async (e) => {
    e.preventDefault();

    if (!codigo.trim()) return;

    setLoading(true);
    setError("");
    setEnvio(null);

    try {
      const response = await axios.get(
        `http://localhost:8099/api/v1/encomienda/${codigo}`
      );

      if (!response.data) {
        setError("Código no encontrado");
      } else {
        setEnvio(response.data);
      }

    } catch (err) {
      setError("Envío no encontrado");
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>Consultar Envío</h4>
      </div>

      <div className="card-body">
        <form onSubmit={handleConsulta}>
          <label>Código de Seguimiento</label>
          <input
            className="form-control"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <button className="btn btn-primary mt-3" disabled={loading}>
            {loading ? "Buscando..." : "Consultar"}
          </button>
        </form>

        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}

        {envio && (
          <div className="mt-4 card p-3">
            <h5>Datos del Envío</h5>

            <p><strong>Remitente:</strong> {envio.nombreRemi}</p>
            <p><strong>Destinatario:</strong> {envio.nombreDestinatario}</p>
            <p><strong>Origen:</strong> {envio.direccionOrigen}</p>
            <p><strong>Destino:</strong> {envio.direccionDestino}</p>
            <p><strong>Teléfono Origen:</strong> {envio.telefonoOrigen}</p>
            <p><strong>Teléfono Destino:</strong> {envio.telefonoDestino}</p>
            <p><strong>Descripción:</strong> {envio.descripcion}</p>
            <p><strong>Peso:</strong> {envio.peso}</p>
            <p><strong>Dimensiones:</strong> {envio.dimenciones}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaEnvio;
