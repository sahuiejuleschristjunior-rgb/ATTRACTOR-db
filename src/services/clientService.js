const Client = require('../models/Client');
const AppError = require('../utils/appError');

const DEFAULT_LIMIT = 20;

const parsePagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1);

  return { page, limit };
};

const parseSort = (sort) => {
  if (!sort || typeof sort !== 'string') {
    return { createdAt: -1 };
  }

  return sort
    .split(',')
    .map((sortField) => sortField.trim())
    .filter(Boolean)
    .reduce((acc, sortField) => {
      if (sortField.startsWith('-')) {
        acc[sortField.slice(1)] = -1;
      } else {
        acc[sortField] = 1;
      }

      return acc;
    }, {});
};

const buildFilter = (companyId, query = {}) => {
  const filter = { companyId };

  Object.entries(query).forEach(([key, value]) => {
    if (!['page', 'limit', 'sort'].includes(key) && value !== undefined && value !== '') {
      filter[key] = value;
    }
  });

  return filter;
};

const createClient = async (companyId, payload) => {
  const existingClient = await Client.findOne({ companyId, email: payload.email });

  if (existingClient) {
    throw new AppError('Client with this email already exists', 409);
  }

  return Client.create({ ...payload, companyId });
};

const getAllClients = async (companyId, queryParams = {}) => {
  const { page, limit } = parsePagination(queryParams);
  const sort = parseSort(queryParams.sort);
  const filter = buildFilter(companyId, queryParams);

  const total = await Client.countDocuments(filter);
  const pages = Math.max(Math.ceil(total / limit), 1);

  const clients = await Client.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: clients,
    metadata: {
      total,
      page,
      pages
    }
  };
};

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
