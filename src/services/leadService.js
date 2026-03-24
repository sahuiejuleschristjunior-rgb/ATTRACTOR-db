const Lead = require('../models/Lead');
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

const createLead = async (companyId, payload) => Lead.create({ ...payload, companyId });

const getAllLeads = async (companyId, queryParams = {}) => {
  const { page, limit } = parsePagination(queryParams);
  const sort = parseSort(queryParams.sort);
  const filter = buildFilter(companyId, queryParams);

  const total = await Lead.countDocuments(filter);
  const pages = Math.max(Math.ceil(total / limit), 1);

  const leads = await Lead.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: leads,
    metadata: {
      total,
      page,
      pages
    }
  };
};

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
