const Client = require('../models/Client');
const AppError = require('../utils/appError');

const createClient = async (payload) => {
  const existingClient = await Client.findOne({ email: payload.email });

  if (existingClient) {
    throw new AppError('Client with this email already exists', 409);
  }

  return Client.create(payload);
};

const getAllClients = async () => Client.find().sort({ createdAt: -1 });

const getClientById = async (clientId) => {
  const client = await Client.findById(clientId);

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  return client;
};

const updateClient = async (clientId, payload) => {
  const client = await Client.findById(clientId);

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  if (payload.email && payload.email !== client.email) {
    const emailOwner = await Client.findOne({ email: payload.email, _id: { $ne: clientId } });

    if (emailOwner) {
      throw new AppError('Client with this email already exists', 409);
    }
  }

  Object.assign(client, payload);
  await client.save();

  return client;
};

const deleteClient = async (clientId) => {
  const client = await Client.findByIdAndDelete(clientId);

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
