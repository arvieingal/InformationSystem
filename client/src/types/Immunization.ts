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
  remarks: string;
  doses(doses: any): import("react").ReactNode;
  date_vaccinated(date_vaccinated: any): import("react").ReactNode;
  barangay: ReactNode;
  child_immunization_id: number;
  child_id: number;
  resident_id: number;
  full_name: string;
  birthdate: string; // Stored as 'date' in the database, represented as a string in ISO format
  age: number | null; // `decimal(4,1)` can represent fractional years
  sex: "Male" | "Female"; // Enum type based on database definition
  vaccine_type: string | null; // Nullable VARCHAR
  health_center: string | null; // Nullable VARCHAR
  address: string | null; // Nullable VARCHAR
  height_at_birth: number | null; // `decimal(5,2)` for height
  weight_at_birth: number | null; // `decimal(5,2)` for weight
  mother_name: string | null; // Nullable VARCHAR
  father_name: string | null; // Nullable VARCHAR
  household_number: number | null; // Nullable INT
  status: "Active" | "Inactive"; // Enum type based on database definition
  created_at: string; // Stored as 'timestamp', represented as a string in ISO format
  updated_at: string; // Stored as 'timestamp', represented as a string in ISO format
} 