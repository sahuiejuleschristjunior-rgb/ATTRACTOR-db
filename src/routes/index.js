const express = require('express');
const clientRoutes = require('./clientRoutes');
const leadRoutes = require('./leadRoutes');

const router = express.Router();

router.use('/clients', clientRoutes);
router.use('/leads', leadRoutes);

module.exports = router;
