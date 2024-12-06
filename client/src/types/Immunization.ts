export interface VaccineDose {
  administered_by: string;
  sideEffects: string;
  location: string;
  vaccine_type: string;
  dose_description: string;
  scheduled_date: string;
  administered_date: string;
}

export interface Immunization {
  child_immunization_id: number;
  child_id: number;
  resident_id: number;
  full_name: string;
  birthdate: string;
  age: number | null;
  sex: "Male" | "Female";
  vaccine_type:
  | "BCG Vaccine"
  | "Hepatitis B Vaccine"
  | "Pentavalent Vaccine (DPT-Hep B-HIB)"
  | "Inactivated Polio Vaccine (IPV)"
  | "Pneumococcal Conjugate Vaccine (PCV)"
  | "Measles, Mumps, Rubella Vaccine (MMR)"
  | "Vitamin A"
  | "Deworming"
  | "Dental Check-up"
  | "Others"
  | null;
  other_vaccine_type: string | null;
  doses:
  | "First dose"
  | "Second dose"
  | "Third dose"
  | "Fourth dose"
  | "Fifth dose"
  | "Others"
  | null;
  other_doses: string | null;
  date_vaccinated: string | null;
  remarks: string | null;
  health_center: string | null;
  address: string | null;
  height_at_birth: number | null;
  weight_at_birth: number | null;
  mother_name: string | null;
  father_name: string | null;
  household_number: number | null;
  status: "Active" | "Inactive";
  created_at: string;
  updated_at: string;
}