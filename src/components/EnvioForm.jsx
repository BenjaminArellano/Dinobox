import React, { useState } from 'react';
import axios from "axios";
import { useProgresoAutomatico } from '../context/ProgresoAutomaticoContext';

const EnvioForm = () => {
  const { agregarEnvio } = useProgresoAutomatico();

  const [formData, setFormData] = useState({
    nombreRemi: '',
    nombreDestinatario: '',
    direccionOrigen: '',
    direccionDestino: '',
    telefonoOrigen: '',
    telefonoDestino: '',
    descripcion: '',
    peso: '',
    dimenciones: ''
  });

  const [codigoSeguimiento, setCodigoSeguimiento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8099/api/v1/encomienda",
        formData
      );

      const envio = response.data;
      setCodigoSeguimiento(envio.id);

      agregarEnvio(envio);

      setFormData({
        nombreRemi: '',
        nombreDestinatario: '',
        direccionOrigen: '',
        direccionDestino: '',
        telefonoOrigen: '',
        telefonoDestino: '',
        descripcion: '',
        peso: '',
        dimenciones: ''
      });

    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al registrar envío");
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>Nueva Encomienda</h4>
      </div>

      <div className="card-body">
        {codigoSeguimiento ? (
          <div className="alert alert-success">
            <h5>¡Envío registrado!</h5>
            <h3 className="text-primary">{codigoSeguimiento}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-md-6">
                <label>Remitente</label>
                <input className="form-control" name="nombreRemi" value={formData.nombreRemi} onChange={handleChange} required />

                <label>Dirección Origen</label>
                <input className="form-control" name="direccionOrigen" value={formData.direccionOrigen} onChange={handleChange} required />

                <label>Teléfono Remitente</label>
                <input className="form-control" name="telefonoOrigen" value={formData.telefonoOrigen} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label>Destinatario</label>
                <input className="form-control" name="nombreDestinatario" value={formData.nombreDestinatario} onChange={handleChange} required />

                <label>Dirección Destino</label>
                <input className="form-control" name="direccionDestino" value={formData.direccionDestino} onChange={handleChange} required />

                <label>Teléfono Destinatario</label>
                <input className="form-control" name="telefonoDestino" value={formData.telefonoDestino} onChange={handleChange} required />
              </div>
            </div>

            <div className="mt-3">
              <label>Descripción</label>
              <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required />

              <label>Peso</label>
              <input className="form-control" type="number" name="peso" value={formData.peso} onChange={handleChange} required />

              <label>Dimensiones</label>
              <input className="form-control" name="dimenciones" value={formData.dimenciones} onChange={handleChange} />
            </div>

            <button className="btn btn-primary mt-3" disabled={loading}>
              {loading ? "Procesando..." : "Registrar Envío"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnvioForm;
