const leadService = require('../services/leadService');
const asyncHandler = require('../utils/asyncHandler');

const getCompanyId = (req) => req.user.companyId;
const getUserId = (req) => req.user.sub || req.user.userId || req.user.id;

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(getCompanyId(req), getUserId(req), req.validatedBody);
  res.status(201).json({ success: true, data: lead, meta: null });
});

const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await leadService.getAllLeads(getCompanyId(req), req.query);
  res.status(200).json({ success: true, data: leads.data, meta: leads.meta });
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(getCompanyId(req), req.params.id);
  res.status(200).json({ success: true, data: lead, meta: null });
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(
    getCompanyId(req),
    req.params.id,
    getUserId(req),
    req.validatedBody
  );
  res.status(200).json({ success: true, data: lead, meta: null });
});

const assignLead = asyncHandler(async (req, res) => {
  const lead = await leadService.assignLead(
    getCompanyId(req),
    req.params.id,
    getUserId(req),
    req.validatedBody.assignedTo
  );
  res.status(200).json({ success: true, data: lead, meta: null });
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(getCompanyId(req), req.params.id);
  res.status(200).json({ success: true, data: null, meta: null });
});

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  assignLead,
  deleteLead
};
