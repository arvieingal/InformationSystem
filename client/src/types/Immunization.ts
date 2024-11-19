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
  records: any;
  record_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  date_of_birth: string;
  place_of_birth: string;
  address: string;
  mother_name: string;
  father_name: string;
  birth_height: number;
  birth_weight: number;
  sex: string;
  health_center: string;
  barangay: string;
  family_number: string;
  vaccineDoses: VaccineDose[];
  child: {
    address: ReactNode;
    heightAtBirth: ReactNode;
    birthplace: ReactNode;
    father_name: ReactNode;
    birthdate: ReactNode;
    mother_name: ReactNode;
    extension: any;
    given_name: any;
    family_name: any;
    age: any;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    sex: string;
    dateOfBirth: string;
  };
} 