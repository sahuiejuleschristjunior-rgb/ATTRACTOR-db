const Client = require('../models/Client');
const AppError = require('../utils/appError');

const createClient = async (companyId, payload) => {
  const existingClient = await Client.findOne({ companyId, email: payload.email });

  if (existingClient) {
    throw new AppError('Client with this email already exists', 409);
  }

  return Client.create({ ...payload, companyId });
};

const getAllClients = async (companyId) => Client.find({ companyId }).sort({ createdAt: -1 });

const getClientById = async (companyId, clientId) => {
  const client = await Client.findOne({ _id: clientId, companyId });

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  return client;
};

const updateClient = async (companyId, clientId, payload) => {
  const client = await Client.findOne({ _id: clientId, companyId });

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  if (payload.email && payload.email !== client.email) {
    const emailOwner = await Client.findOne({
      companyId,
      email: payload.email,
      _id: { $ne: clientId }
    });

    if (emailOwner) {
      throw new AppError('Client with this email already exists', 409);
    }
  }

  Object.assign(client, payload);
  await client.save();

  return client;
};

const deleteClient = async (companyId, clientId) => {
  const client = await Client.findOneAndDelete({ _id: clientId, companyId });

  if (!client) {
    throw new AppError('Client not found', 404);
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};
