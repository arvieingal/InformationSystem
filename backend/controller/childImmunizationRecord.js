const ChildImmunizationRecord = require('../models/childImmunizationRecord');

let records = []; 

exports.createRecord = (req, res) => {
  const newRecord = new ChildImmunizationRecord(req.body);
  records.push(newRecord);
  res.status(201).json(newRecord);
};

exports.getRecords = (req, res) => {
  res.json(records);
};

exports.getRecordById = (req, res) => {
  const record = records.find(r => r.record_id === parseInt(req.params.id));
  if (record) {
    res.json(record);
  } else {
    res.status(404).send('Record not found');
  }
}; 