const Client = require('../models/Client');
const Lead = require('../models/Lead');

const groupByStatus = async (Model, companyId) => {
  const rows = await Model.aggregate([
    { $match: { companyId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } }
  ]);

  return rows;
};

const getDashboardStats = async (companyId) => {
  const [totalClients, totalLeads, leadsByStatus, clientsByStatus] = await Promise.all([
    Client.countDocuments({ companyId }),
    Lead.countDocuments({ companyId }),
    groupByStatus(Lead, companyId),
    groupByStatus(Client, companyId)
  ]);

  return {
    totalClients,
    totalLeads,
    leadsByStatus,
    clientsByStatus
  };
};

module.exports = {
  getDashboardStats
};
