const express = require('express');
const clientController = require('../controllers/clientController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const clientSchema = {
  name: { type: 'string', required: true },
  phone: { type: 'string', required: true, phone: true },
  email: { type: 'string', required: true, email: true },
  company: { type: 'string', required: true },
  status: { type: 'string', required: true, enum: ['prospect', 'client', 'lost'] }
};

router.post('/', validateRequest(clientSchema), clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.put('/:id', validateRequest(clientSchema, { allowPartial: true }), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
