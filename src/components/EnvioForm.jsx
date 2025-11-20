import React, { useState, useContext } from 'react';
import { useProgresoAutomatico } from '../context/ProgresoAutomaticoContext';

const EnvioForm = () => {
  const { agregarEnvio } = useProgresoAutomatico();
  
  const [formData, setFormData] = useState({
    remitente: '',
    destinatario: '',
    direccionOrigen: '',
    direccionDestino: '',
    telefonoRemitente: '',
    telefonoDestinatario: '',
    descripcionPaquete: '',
    peso: '',
    dimensiones: ''
  });

  const [codigoSeguimiento, setCodigoSeguimiento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generarCodigoSeguimiento = () => {
    return 'DINO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // CONEXIÓN CON BACKEND SPRING BOOT - ENDPOINT: POST /dinolbox.cl/api/v1/encomienda
      // const response = await enviarEncomienda(formData);
      // const codigo = response.data.codigoSeguimiento;
      
      // Por ahora usamos datos de prueba
      setTimeout(() => {
        const codigo = generarCodigoSeguimiento();
        setCodigoSeguimiento(codigo);
        
        // Agregar envío al sistema de progreso automático
        const nuevoEnvio = {
          codigoSeguimiento: codigo,
          ...formData,
          estado: 'En Recepción'
        };
        
        agregarEnvio(nuevoEnvio);
        setLoading(false);
        
        // Limpiar formulario
        setFormData({
          remitente: '',
          destinatario: '',
          direccionOrigen: '',
          direccionDestino: '',
          telefonoRemitente: '',
          telefonoDestinatario: '',
          descripcionPaquete: '',
          peso: '',
          dimensiones: ''
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error al enviar encomienda:', error);
      setLoading(false);
      alert('Error al procesar la solicitud. Intente nuevamente.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Nueva Solicitud de Encomienda</h4>
        <small className="text-muted">El estado se actualizará automáticamente cada cierto tiempo</small>
      </div>
      <div className="card-body">
        {codigoSeguimiento ? (
          <div className="alert alert-success">
            <h5>¡Envío registrado exitosamente!</h5>
            <p className="mb-2">Tu código de seguimiento es:</p>
            <h3 className="text-primary">{codigoSeguimiento}</h3>
            <p className="mt-2 mb-0">
              <strong>Estado inicial:</strong> En Recepción<br/>
              El estado se actualizará automáticamente según el progreso del envío.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <h5 className="border-bottom pb-2">Información del Remitente</h5>
                
                <div className="mb-3">
                  <label className="form-label">Nombre del Remitente *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="remitente"
                    value={formData.remitente}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Dirección de Origen *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="direccionOrigen"
                    value={formData.direccionOrigen}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefonoRemitente"
                    value={formData.telefonoRemitente}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <h5 className="border-bottom pb-2">Información del Destinatario</h5>
                
                <div className="mb-3">
                  <label className="form-label">Nombre del Destinatario *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="destinatario"
                    value={formData.destinatario}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Dirección de Destino *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="direccionDestino"
                    value={formData.direccionDestino}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefonoDestinatario"
                    value={formData.telefonoDestinatario}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="row mt-3">
              <div className="col-12">
                <h5 className="border-bottom pb-2">Información del Paquete</h5>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Descripción del Paquete *</label>
                  <textarea
                    className="form-control"
                    name="descripcionPaquete"
                    value={formData.descripcionPaquete}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Peso (kg) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    step="0.1"
                    min="0.1"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Dimensiones (LxAxA cm)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="dimensiones"
                    value={formData.dimensiones}
                    onChange={handleChange}
                    placeholder="30x20x15"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Procesando...
                  </>
                ) : (
                  'Registrar Envío'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnvioForm;