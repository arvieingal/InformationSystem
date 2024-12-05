const express = require('express');
const router = express.Router();
const childrenController = require('../controller/childrenController');
const authenticate = require('../middleware/authMiddleware');

router.get('/children/count/categorized', childrenController.getCategorizedChildren);
router.get('/children', childrenController.getAllChildren);
router.get('/children/inactive', childrenController.getAllChildrenInactive);

router.get('/children/:child_id', childrenController.getChildById);
router.post('/children', childrenController.addChild);
router.put('/children/:child_id', childrenController.updateChild);
router.get('/residents', childrenController.getAllResidents);
router.get('/children/household/:resident_id', childrenController.getChildrenByHouseholdId);
router.put('/children/:childId/archive', childrenController.archiveChildController);
router.get('/status/purok', childrenController.getStatusByPurok);
module.exports = router;