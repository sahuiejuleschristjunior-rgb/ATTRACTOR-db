const clientService = require('../services/clientService');
const asyncHandler = require('../utils/asyncHandler');

const getCompanyId = (req) => req.user.companyId;
const getUserId = (req) => req.user.sub || req.user.userId || req.user.id;

const createClient = asyncHandler(async (req, res) => {
  const client = await clientService.createClient(getCompanyId(req), getUserId(req), req.validatedBody);
  res.status(201).json({ success: true, data: client, meta: null });
});

const getAllClients = asyncHandler(async (req, res) => {
  const clients = await clientService.getAllClients(getCompanyId(req), req.query);
  res.status(200).json({ success: true, data: clients.data, meta: clients.meta });
});

const getClientById = asyncHandler(async (req, res) => {
  const client = await clientService.getClientById(getCompanyId(req), req.params.id);
  res.status(200).json({ success: true, data: client, meta: null });
});

const updateClient = asyncHandler(async (req, res) => {
  const client = await clientService.updateClient(
    getCompanyId(req),
    req.params.id,
    getUserId(req),
    req.validatedBody
  );
  res.status(200).json({ success: true, data: client, meta: null });
});

const deleteClient = asyncHandler(async (req, res) => {
  await clientService.deleteClient(getCompanyId(req), req.params.id);
  res.status(200).json({ success: true, data: null, meta: null });
});

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};
