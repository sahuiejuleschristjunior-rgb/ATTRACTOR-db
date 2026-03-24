const express = require('express');
const leadController = require('../controllers/leadController');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

const leadSchema = {
  name: { type: 'string', required: true },
  phone: { type: 'string', required: true, phone: true },
  email: { type: 'string', required: false, email: true },
  source: { type: 'string', required: true, enum: ['facebook', 'whatsapp', 'website'] },
  status: { type: 'string', required: true, enum: ['new', 'contacted', 'converted'] },
  assignedTo: { type: 'string', required: false }
};

const leadAssignmentSchema = {
  assignedTo: { type: 'string', required: true }
};

router.post('/', validateRequest(leadSchema), leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', validateRequest(leadSchema, { allowPartial: true }), leadController.updateLead);
router.patch('/:id/assign', validateRequest(leadAssignmentSchema), leadController.assignLead);
router.delete('/:id', leadController.deleteLead);

module.exports = router;
