import React, { useState, useEffect } from 'react';

const ProgresoAutomatico = () => {
  const [envios, setEnvios] = useState([]);

  // Función para calcular el próximo estado y tiempo estimado
  const calcularProximoEstado = (envio) => {
    const estados = ['En Recepción', 'En Despacho', 'En Tránsito', 'Entregado'];
    const estadoActual = envio.estado;
    const indexActual = estados.indexOf(estadoActual);
    
    if (indexActual < estados.length - 1) {
      const proximoEstado = estados[indexActual + 1];
      const tiemposEstimados = {
        'En Recepción': 2, // 2 horas en recepción
        'En Despacho': 4,  // 4 horas en despacho
        'En Tránsito': 8   // 8 horas en tránsito
      };
      
      const tiempoRestante = tiemposEstimados[estadoActual] || 1;
      return { proximoEstado, tiempoRestante };
    }
    
    return { proximoEstado: null, tiempoRestante: 0 };
  };

  // Simular el paso del tiempo y actualización automática
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvios(prevEnvios => 
        prevEnvios.map(envio => {
          const { proximoEstado, tiempoRestante } = calcularProximoEstado(envio);
          
          if (proximoEstado && envio.tiempoTranscurrido >= tiempoRestante) {
            // Actualizar al próximo estado
            return {
              ...envio,
              estado: proximoEstado,
              tiempoTranscurrido: 0,
              fechaUltimaActualizacion: new Date().toLocaleString()
            };
          }
          
          // Incrementar tiempo transcurrido
          return {
            ...envio,
            tiempoTranscurrido: (envio.tiempoTranscurrido || 0) + 0.5 // +30 minutos
          };
        })
      );
    }, 3000); // Actualizar cada 3 segundos (simula 30 minutos)

    return () => clearInterval(interval);
  }, []);

  const agregarEnvio = (nuevoEnvio) => {
    const envioConTiempo = {
      ...nuevoEnvio,
      tiempoTranscurrido: 0,
      fechaCreacion: new Date().toLocaleString(),
      fechaUltimaActualizacion: new Date().toLocaleString()
    };
    setEnvios(prev => [...prev, envioConTiempo]);
  };

  return {
    envios,
    agregarEnvio,
    calcularProximoEstado
  };
};

export default ProgresoAutomatico;