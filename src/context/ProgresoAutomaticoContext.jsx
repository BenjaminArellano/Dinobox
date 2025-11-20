import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgresoAutomaticoContext = createContext();

export const useProgresoAutomatico = () => {
  const context = useContext(ProgresoAutomaticoContext);
  if (!context) {
    throw new Error('useProgresoAutomatico debe usarse dentro de ProgresoAutomaticoProvider');
  }
  return context;
};

export const ProgresoAutomaticoProvider = ({ children }) => {
  const [envios, setEnvios] = useState([]);
  const [tiempoAcelerado, setTiempoAcelerado] = useState(0);

  // Configuración de tiempos para cada estado (en minutos para la simulación)
  const configuracionTiempos = {
    'En Recepción': 2,    // 2 minutos en simulación (2 horas reales)
    'En Despacho': 4,     // 4 minutos en simulación (4 horas reales)
    'En Tránsito': 8      // 8 minutos en simulación (8 horas reales)
  };

  // Función para adelantar el tiempo
  const adelantarTiempo = (minutos = 60) => {
    setEnvios(prevEnvios => 
      prevEnvios.map(envio => {
        if (envio.estado === 'Entregado') {
          return envio;
        }

        let nuevoEnvio = { ...envio };
        const tiempoAAgregar = minutos / 30; // Convertir a unidades de simulación

        for (let i = 0; i < tiempoAAgregar; i++) {
          const { proximoEstado, tiempoEstimado } = calcularProximoEstado(nuevoEnvio);
          const nuevoTiempoTranscurrido = (nuevoEnvio.tiempoTranscurrido || 0) + 0.5;
          
          if (proximoEstado && nuevoTiempoTranscurrido >= tiempoEstimado) {
            nuevoEnvio = {
              ...nuevoEnvio,
              estado: proximoEstado,
              tiempoTranscurrido: 0,
              fechaUltimaActualizacion: new Date().toLocaleString('es-ES'),
              historialEstados: [
                ...(nuevoEnvio.historialEstados || []),
                {
                  estado: proximoEstado,
                  fecha: new Date().toLocaleString('es-ES'),
                  automatico: true,
                  acelerado: true
                }
              ]
            };
          } else {
            nuevoEnvio = {
              ...nuevoEnvio,
              tiempoTranscurrido: nuevoTiempoTranscurrido
            };
          }
        }

        return nuevoEnvio;
      })
    );
    setTiempoAcelerado(prev => prev + minutos);
  };

  // Calcular próximo estado y tiempo restante
  const calcularProximoEstado = (envio) => {
    const estados = ['En Recepción', 'En Despacho', 'En Tránsito', 'Entregado'];
    const estadoActual = envio.estado;
    const indexActual = estados.indexOf(estadoActual);
    
    if (indexActual < estados.length - 1) {
      const proximoEstado = estados[indexActual + 1];
      const tiempoEstimado = configuracionTiempos[estadoActual] || 1;
      const tiempoTranscurrido = envio.tiempoTranscurrido || 0;
      const tiempoRestante = Math.max(0, tiempoEstimado - tiempoTranscurrido);
      
      return { 
        proximoEstado, 
        tiempoEstimado,
        tiempoTranscurrido,
        tiempoRestante,
        porcentaje: Math.min(100, (tiempoTranscurrido / tiempoEstimado) * 100)
      };
    }
    
    return { 
      proximoEstado: null, 
      tiempoEstimado: 0,
      tiempoTranscurrido: 0,
      tiempoRestante: 0,
      porcentaje: 100
    };
  };

  // Simular el paso del tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvios(prevEnvios => 
        prevEnvios.map(envio => {
          if (envio.estado === 'Entregado') {
            return envio;
          }

          const { proximoEstado, tiempoEstimado } = calcularProximoEstado(envio);
          const nuevoTiempoTranscurrido = (envio.tiempoTranscurrido || 0) + 0.5;
          
          if (proximoEstado && nuevoTiempoTranscurrido >= tiempoEstimado) {
            return {
              ...envio,
              estado: proximoEstado,
              tiempoTranscurrido: 0,
              fechaUltimaActualizacion: new Date().toLocaleString('es-ES'),
              historialEstados: [
                ...(envio.historialEstados || []),
                {
                  estado: proximoEstado,
                  fecha: new Date().toLocaleString('es-ES'),
                  automatico: true
                }
              ]
            };
          }
          
          return {
            ...envio,
            tiempoTranscurrido: nuevoTiempoTranscurrido
          };
        })
      );
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const agregarEnvio = (nuevoEnvio) => {
    const envioConTiempo = {
      ...nuevoEnvio,
      tiempoTranscurrido: 0,
      fechaCreacion: new Date().toLocaleString('es-ES'),
      fechaUltimaActualizacion: new Date().toLocaleString('es-ES'),
      historialEstados: [
        {
          estado: 'En Recepción',
          fecha: new Date().toLocaleString('es-ES'),
          automatico: true
        }
      ]
    };
    setEnvios(prev => [...prev, envioConTiempo]);
  };

  const buscarEnvioPorCodigo = (codigo) => {
    return envios.find(envio => envio.codigoSeguimiento === codigo);
  };

  const value = {
    envios,
    agregarEnvio,
    buscarEnvioPorCodigo,
    calcularProximoEstado,
    configuracionTiempos,
    adelantarTiempo,
    tiempoAcelerado
  };

  return (
    <ProgresoAutomaticoContext.Provider value={value}>
      {children}
    </ProgresoAutomaticoContext.Provider>
  );
};

export default ProgresoAutomaticoContext;