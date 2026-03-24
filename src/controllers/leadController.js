const leadService = require('../services/leadService');
const asyncHandler = require('../utils/asyncHandler');

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.validatedBody);
  res.status(201).json({ success: true, data: lead });
});

const getAllLeads = asyncHandler(async (_req, res) => {
  const leads = await leadService.getAllLeads();
  res.status(200).json({ success: true, data: leads });
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);
  res.status(200).json({ success: true, data: lead });
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.validatedBody);
  res.status(200).json({ success: true, data: lead });
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.id);
  res.status(204).send();
});

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
};
