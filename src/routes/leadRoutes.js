const express = require('express');
const leadController = require('../controllers/leadController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const leadSchema = {
  name: { type: 'string', required: true },
  phone: { type: 'string', required: true, phone: true },
  source: { type: 'string', required: true, enum: ['facebook', 'whatsapp', 'website'] },
  status: { type: 'string', required: true, enum: ['new', 'contacted', 'converted'] }
};

router.post('/', validateRequest(leadSchema), leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', validateRequest(leadSchema, { allowPartial: true }), leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

module.exports = router;
