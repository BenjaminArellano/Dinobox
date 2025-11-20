import React, { useContext } from 'react';
import { useProgresoAutomatico } from '../context/ProgresoAutomaticoContext';

const SeguimientoEnVivo = () => {
  const { envios, calcularProximoEstado } = useProgresoAutomatico();

  const formatTiempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = Math.floor(minutos % 60);
    
    if (horas > 0) {
      return `${horas}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins} minutos`;
  };

  if (envios.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <h5>No hay envíos en progreso</h5>
          <p className="text-muted">Los envíos aparecerán aquí una vez registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Seguimiento en Vivo</h4>
        <small className="text-muted">Monitorea el progreso automático de todos los envíos</small>
      </div>
      <div className="card-body">
        <div className="row">
          {envios.map(envio => {
            const { proximoEstado, tiempoRestante, porcentaje } = calcularProximoEstado(envio);
            
            return (
              <div key={envio.codigoSeguimiento} className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-header">
                    <strong>{envio.codigoSeguimiento}</strong>
                    <br />
                    <small>{envio.remitente} → {envio.destinatario}</small>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Estado Actual:</strong>
                      <span className={`badge ${
                        envio.estado === 'En Recepción' ? 'bg-secondary' :
                        envio.estado === 'En Despacho' ? 'bg-info' :
                        envio.estado === 'En Tránsito' ? 'bg-warning' : 'bg-success'
                      } ms-2`}>
                        {envio.estado}
                      </span>
                    </div>
                    
                    {proximoEstado && (
                      <div className="mb-3">
                        <strong>Próximo Estado:</strong> {proximoEstado}
                        <div className="progress mt-2" style={{height: '10px'}}>
                          <div 
                            className="progress-bar bg-info" 
                            style={{width: `${porcentaje}%`}}
                          ></div>
                        </div>
                        <small className="text-muted">
                          Tiempo estimado: {formatTiempo(tiempoRestante * 60)}
                        </small>
                      </div>
                    )}
                    
                    <div className="small text-muted">
                      <div>📦 {envio.descripcionPaquete}</div>
                      <div>⚖️ Peso: {envio.peso} kg</div>
                      {envio.dimensiones && <div>📏 Dimensiones: {envio.dimensiones} cm</div>}
                    </div>
                  </div>
                  <div className="card-footer text-muted small">
                    Última actualización: {envio.fechaUltimaActualizacion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeguimientoEnVivo;