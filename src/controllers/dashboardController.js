const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

const getCompanyId = (req) => req.user.companyId;

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(getCompanyId(req));

  res.status(200).json({
    success: true,
    data: stats,
    meta: null
  });
});

module.exports = {
  getDashboardStats
};
