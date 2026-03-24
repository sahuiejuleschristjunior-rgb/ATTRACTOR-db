const Lead = require('../models/Lead');
const AppError = require('../utils/appError');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const parsePagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

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

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilter = (companyId, query = {}) => {
  const filter = { companyId };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  if (query.search && typeof query.search === 'string') {
    const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
  }

  return filter;
};

const createLead = async (companyId, userId, payload) =>
  Lead.create({ ...payload, companyId, createdBy: userId, updatedBy: userId });

const getAllLeads = async (companyId, queryParams = {}) => {
  const { page, limit } = parsePagination(queryParams);
  const sort = parseSort(queryParams.sort);
  const filter = buildFilter(companyId, queryParams);

  const [total, leads] = await Promise.all([
    Lead.countDocuments(filter),
    Lead.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
  ]);

  const pages = Math.max(Math.ceil(total / limit), 1);

  return {
    data: leads,
    meta: {
      total,
      page,
      limit,
      pages
    }
  };
};

const getLeadById = async (companyId, leadId) => {
  const lead = await Lead.findOne({ _id: leadId, companyId }).lean();

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

const updateLead = async (companyId, leadId, userId, payload) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  const nextStatus = payload.status;
  if (nextStatus && nextStatus !== lead.status) {
    lead.statusHistory.push({
      from: lead.status,
      to: nextStatus,
      changedBy: userId,
      changedAt: new Date()
    });
  }

  Object.assign(lead, payload, { updatedBy: userId });
  await lead.save();

  return lead;
};

const assignLead = async (companyId, leadId, userId, assignedTo) => {
  if (!assignedTo) {
    throw new AppError('assignedTo is required', 400);
  }

  const lead = await Lead.findOne({ _id: leadId, companyId });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  lead.assignedTo = assignedTo;
  lead.updatedBy = userId;
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
  assignLead,
  deleteLead
};
