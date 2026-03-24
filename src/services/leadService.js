const Lead = require('../models/Lead');
const AppError = require('../utils/appError');

const createLead = async (payload) => Lead.create(payload);

const getAllLeads = async () => Lead.find().sort({ createdAt: -1 });

const getLeadById = async (leadId) => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

const updateLead = async (leadId, payload) => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  Object.assign(lead, payload);
  await lead.save();

  return lead;
};

const deleteLead = async (leadId) => {
  const lead = await Lead.findByIdAndDelete(leadId);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
};
