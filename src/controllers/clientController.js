const clientService = require('../services/clientService');
const asyncHandler = require('../utils/asyncHandler');

const getCompanyId = (req) => req.user.companyId;

const createClient = asyncHandler(async (req, res) => {
  const client = await clientService.createClient(getCompanyId(req), req.validatedBody);
  res.status(201).json({ success: true, data: client });
});

const getAllClients = asyncHandler(async (req, res) => {
  const clients = await clientService.getAllClients(getCompanyId(req));
  res.status(200).json({ success: true, data: clients });
});

const getClientById = asyncHandler(async (req, res) => {
  const client = await clientService.getClientById(getCompanyId(req), req.params.id);
  res.status(200).json({ success: true, data: client });
});

const updateClient = asyncHandler(async (req, res) => {
  const client = await clientService.updateClient(getCompanyId(req), req.params.id, req.validatedBody);
  res.status(200).json({ success: true, data: client });
});

const deleteClient = asyncHandler(async (req, res) => {
  await clientService.deleteClient(getCompanyId(req), req.params.id);
  res.status(204).send();
});

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};
