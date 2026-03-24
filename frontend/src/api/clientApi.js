import http from './http';

export const getClientsApi = async (params) => {
  const { data } = await http.get('/clients', { params });
  return data;
};

export const createClientApi = async (payload) => {
  const { data } = await http.post('/clients', payload);
  return data;
};

export const updateClientApi = async (id, payload) => {
  const { data } = await http.put(`/clients/${id}`, payload);
  return data;
};

export const deleteClientApi = async (id) => {
  const { data } = await http.delete(`/clients/${id}`);
  return data;
};
