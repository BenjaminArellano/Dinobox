import axios from "axios";

const API = "http://localhost:8099/api/v1/encomienda";

export const enviarEncomienda = async (data) => {
  return axios.post(API, data);
};

export const consultarEncomienda = async (codigo) => {
  return axios.get(`${API}/${codigo}`);
};
