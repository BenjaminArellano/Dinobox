import React, { useContext } from 'react';
import { useProgresoAutomatico } from '../context/ProgresoAutomaticoContext';

const ControlTiempo = () => {
  const { adelantarTiempo, tiempoAcelerado } = useProgresoAutomatico();

  return (
    <div className="card mb-4">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0">Control de Tiempo de Simulación</h5>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-8">
            <p className="mb-2">
              <strong>Modo demostración:</strong> Adelanta el tiempo para ver cómo cambian los estados automáticamente.
            </p>
            <small className="text-muted">
              Tiempo acelerado total: <strong>{tiempoAcelerado} minutos</strong>
            </small>
          </div>
          <div className="col-md-4">
            <div className="d-grid gap-2">
              <button 
                className="btn btn-time-skip"
                onClick={() => adelantarTiempo(30)}
              >
                +30 min
              </button>
              <button 
                className="btn btn-time-skip"
                onClick={() => adelantarTiempo(60)}
              >
                +1 hora
              </button>
              <button 
                className="btn btn-time-skip"
                onClick={() => adelantarTiempo(120)}
              >
                +2 horas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTiempo;