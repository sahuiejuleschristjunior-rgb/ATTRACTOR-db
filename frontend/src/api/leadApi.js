import http from './http';

export const getLeadsApi = async (params) => {
  const { data } = await http.get('/leads', { params });
  return data;
};

export const createLeadApi = async (payload) => {
  const { data } = await http.post('/leads', payload);
  return data;
};

export const updateLeadApi = async (id, payload) => {
  const { data } = await http.put(`/leads/${id}`, payload);
  return data;
};

export const assignLeadApi = async (id, assignedTo) => {
  const { data } = await http.patch(`/leads/${id}/assign`, { assignedTo });
  return data;
};
