const db = require('../config/db');

class ChildImmunizationRecord {
  constructor(data) {
    this.record_id = data.record_id;
    this.health_center = data.health_center;
    this.barangay = data.barangay;
    this.dose_id = data.dose_id;
    this.child_id = data.child_id;
    this.vaccine_type = data.vaccine_type;
    this.dose_description = data.dose_description;
    this.scheduled_date = data.scheduled_date;
    this.dose_number = data.dose_number;
    this.administered_date = data.administered_date;
    this.administered_by = data.administered_by;
    this.side_effects = data.side_effects;
    this.location = data.location;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }
}

module.exports = ChildImmunizationRecord; 