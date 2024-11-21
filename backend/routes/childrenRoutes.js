const express = require('express');
const router = express.Router();
const childrenController = require('../controller/childrenController');

router.get('/children', childrenController.getAllChildren);
router.get('/children/:child_id', childrenController.getChildById);
router.post('/children', childrenController.addChild);
router.put('/children/:child_id', childrenController.updateChild);
router.get('/residents', childrenController.getAllResidents);
router.get('/children/household/:household_id', childrenController.getChildrenByHouseholdId);
module.exports = router; 