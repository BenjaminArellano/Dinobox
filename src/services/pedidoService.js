import axios from "axios";

const API_URL = "http://localhost:8099/api/v1/encomienda";

export const crearPedido = (pedido) => {
  return axios.post(API_URL, pedido);
};

export const obtenerPedido = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const actualizarPedido = (id, pedido) => {
  return axios.put(`${API_URL}/${id}`, pedido);
};
