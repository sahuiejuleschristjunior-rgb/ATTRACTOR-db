const leadService = require('../services/leadService');
const asyncHandler = require('../utils/asyncHandler');

const getCompanyId = (req) => req.user.companyId;

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(getCompanyId(req), req.validatedBody);
  res.status(201).json({ success: true, data: lead });
});

const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await leadService.getAllLeads(getCompanyId(req));
  res.status(200).json({ success: true, data: leads });
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(getCompanyId(req), req.params.id);
  res.status(200).json({ success: true, data: lead });
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(getCompanyId(req), req.params.id, req.validatedBody);
  res.status(200).json({ success: true, data: lead });
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(getCompanyId(req), req.params.id);
  res.status(204).send();
});

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
};
