const express = require('express');
const clientRoutes = require('./clientRoutes');
const leadRoutes = require('./leadRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/clients', clientRoutes);
router.use('/leads', leadRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
