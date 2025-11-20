import React, { useState, useContext } from 'react';
import { useProgresoAutomatico } from '../context/ProgresoAutomaticoContext';

const ConsultaEnvio = () => {
  const { buscarEnvioPorCodigo, calcularProximoEstado } = useProgresoAutomatico();
  
  const [codigo, setCodigo] = useState('');
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsulta = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Buscar envío en el sistema de progreso automático
      setTimeout(() => {
        const envioEncontrado = buscarEnvioPorCodigo(codigo);
        
        if (envioEncontrado) {
          setEnvio(envioEncontrado);
        } else {
          setError('Código de seguimiento no encontrado');
        }
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error al consultar envío:', error);
      setError('Error al consultar el envío. Intente nuevamente.');
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      'En Recepción': 'bg-secondary',
      'En Despacho': 'bg-info',
      'En Tránsito': 'bg-warning',
      'Entregado': 'bg-success'
    };
    
    return <span className={`badge ${clases[estado] || 'bg-secondary'}`}>{estado}</span>;
  };

  const formatTiempo = (minutos) => {
    if (minutos < 1) return 'Próximamente';
    const horas = Math.floor(minutos / 60);
    const mins = Math.floor(minutos % 60);
    
    if (horas > 0) {
      return `${horas}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins} minutos`;
  };

  const { proximoEstado, tiempoRestante, porcentaje } = envio ? calcularProximoEstado(envio) : {};

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Consultar Estado de Envío</h4>
        <small className="text-muted">Los estados se actualizan automáticamente</small>
      </div>
      <div className="card-body">
        <form onSubmit={handleConsulta} className="mb-4">
          <div className="row">
            <div className="col-md-8">
              <label className="form-label">Código de Seguimiento</label>
              <input
                type="text"
                className="form-control"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ingresa tu código de seguimiento (ej: DINO-ABC123)"
                required
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Consultando...
                  </>
                ) : (
                  'Consultar Estado'
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {envio && (
          <div className="card bg-light">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Información del Envío</h5>
                  <p><strong>Código:</strong> {envio.codigoSeguimiento}</p>
                  <p><strong>Estado Actual:</strong> {getEstadoBadge(envio.estado)}</p>
                  <p><strong>Fecha de Registro:</strong> {envio.fechaCreacion}</p>
                  <p><strong>Última Actualización:</strong> {envio.fechaUltimaActualizacion}</p>
                  
                  {proximoEstado && (
                    <div className="mt-3 p-3 bg-white rounded">
                      <h6>Próximo Estado</h6>
                      <p className="mb-1"><strong>{proximoEstado}</strong></p>
                      <small className="text-muted">
                        Tiempo estimado: {formatTiempo(tiempoRestante * 60)}
                      </small>
                      <div className="progress mt-2" style={{height: '8px'}}>
                        <div 
                          className="progress-bar bg-info" 
                          style={{width: `${porcentaje}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <h5>Información de Contacto</h5>
                  <p><strong>Remitente:</strong> {envio.remitente}</p>
                  <p><strong>Destinatario:</strong> {envio.destinatario}</p>
                  <p><strong>Origen:</strong> {envio.direccionOrigen}</p>
                  <p><strong>Destino:</strong> {envio.direccionDestino}</p>
                  <p><strong>Teléfono Remitente:</strong> {envio.telefonoRemitente}</p>
                  <p><strong>Teléfono Destinatario:</strong> {envio.telefonoDestinatario}</p>
                </div>
              </div>
              
              {/* Barra de progreso del estado */}
              <div className="mt-4">
                <h6>Progreso del Envío</h6>
                <div className="progress" style={{height: '20px'}}>
                  <div 
                    className={`progress-bar ${
                      envio.estado === 'En Recepción' ? 'bg-secondary' :
                      envio.estado === 'En Despacho' ? 'bg-info' :
                      envio.estado === 'En Tránsito' ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{
                      width: envio.estado === 'En Recepción' ? '25%' :
                            envio.estado === 'En Despacho' ? '50%' :
                            envio.estado === 'En Tránsito' ? '75%' : '100%'
                    }}
                  >
                    {envio.estado}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small>En Recepción</small>
                  <small>En Despacho</small>
                  <small>En Tránsito</small>
                  <small>Entregado</small>
                </div>
              </div>

              {/* Timeline de estados - DENTRO del bloque donde envio existe */}
              <div className="mt-4">
                <h5 className="mb-3">Progreso del Envío</h5>
                <div className="timeline">
                  {['En Recepción', 'En Despacho', 'En Tránsito', 'Entregado'].map((estado, index) => (
                    <div 
                      key={estado}
                      className={`timeline-item ${envio.estado === estado ? 'active' : ''} ${
                        ['En Recepción', 'En Despacho', 'En Tránsito', 'Entregado'].indexOf(envio.estado) >= index ? 'completed' : ''
                      }`}
                    >
                      <div className="timeline-dot"></div>
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{estado}</h6>
                            {envio.estado === estado && (
                              <span className="badge bg-primary">Actual</span>
                            )}
                            {['En Recepción', 'En Despacho', 'En Tránsito', 'Entregado'].indexOf(envio.estado) > index && (
                              <span className="badge bg-success">Completado</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historial de estados */}
              {envio.historialEstados && (
                <div className="mt-4">
                  <h6>Historial de Estados</h6>
                  <div className="list-group">
                    {envio.historialEstados.map((item, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <span>{item.estado}</span>
                          <small className="text-muted">{item.fecha}</small>
                        </div>
                        {item.automatico && (
                          <small className="text-muted">Actualización automática</small>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaEnvio;