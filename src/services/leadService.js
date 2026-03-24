const Lead = require('../models/Lead');
const AppError = require('../utils/appError');

const createLead = async (companyId, payload) => Lead.create({ ...payload, companyId });

const getAllLeads = async (companyId) => Lead.find({ companyId }).sort({ createdAt: -1 });

const getLeadById = async (companyId, leadId) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

const updateLead = async (companyId, leadId, payload) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  Object.assign(lead, payload);
  await lead.save();

  return lead;
};

const deleteLead = async (companyId, leadId) => {
  const lead = await Lead.findOneAndDelete({ _id: leadId, companyId });

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
