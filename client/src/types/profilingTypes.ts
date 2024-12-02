export type Resident = {
    resident_id: number | null;
    household_number: number | null;
    family_name: string;
    given_name: string;
    middle_name?: string;
    extension?: string;
    relationship:
    | "Husband"
    | "Wife"
    | "Son"
    | "Daughter"
    | "Grandmother"
    | "Grandfather"
    | "Son in law"
    | "Daughter in law"
    | "Others"
    | "";
    other_relationship?: string;
    gender: "Male" | "Female" | "";
    civil_status: "Married" | "Separated" | "Single" | "Widowed" | "Divorced" | "";
    birthdate: string;
    age: number | null;
    highest_educational_attainment?:
    | "Elementary Level"
    | "Elementary Graduate"
    | "High School Level"
    | "High School Graduate"
    | "College Level"
    | "College Graduate"
    | "";
    occupation?: string;
    monthly_income: number | null;
    block_number: number | null;
    lot_number: number | null;
    sitio_purok:
    | "Abellana"
    | "City Central"
    | "Kalinao"
    | "Lubi"
    | "Mabuhay"
    | "Nangka"
    | "Regla"
    | "San Antonio"
    | "San Roque"
    | "San Vicente"
    | "Sta. Cruz"
    | "Sto. Nino 1"
    | "Sto. Nino 2"
    | "Sto. Nino 3"
    | "Zapatera"
    | "";
    barangay: string;
    city: string;
    birthplace: string;
    religion: string;
    sectoral:
    | "LGBT"
    | "PWD"
    | "Senior Citizen"
    | "Solo Parent"
    | "Habal - Habal"
    | "Erpat"
    | "Others"
    | "";
    other_sectoral?: string;
    is_registered_voter: "Yes" | "No" | "";
    is_business_owner: "Yes" | "No" | "";
    is_household_head: "Yes" | "No" | "";
    status: "Active" | "Inactive" | "";
};

export type Renter = {
    renter_id: number | null;
    rent_number: number;
    family_name: string;
    given_name: string;
    middle_name?: string;
    extension?: string;
    civil_status: "Married" | "Separated" | "Single" | "Widowed" | "Divorced" | "";
    gender: "Male" | "Female" | "";
    birthdate: string;
    months_year_of_stay: number;
    work: string;
    sitio_purok:
    | "Abellana"
    | "City Central"
    | "Kalinao"
    | "Lubi"
    | "Mabuhay"
    | "Nangka"
    | "Regla"
    | "San Antonio"
    | "San Roque"
    | "San Vicente"
    | "Sta. Cruz"
    | "Sto. Nino 1"
    | "Sto. Nino 2"
    | "Sto. Nino 3"
    | "Zapatera"
    | "";
    status: "Active" | "Inactive" | "";
};

export type RentOwner = {
    rent_number: number,
    rent_owner: string,
    sitio_purok: | "Abellana"
    | "City Central"
    | "Kalinao"
    | "Lubi"
    | "Mabuhay"
    | "Nangka"
    | "Regla"
    | "San Antonio"
    | "San Roque"
    | "San Vicente"
    | "Sta. Cruz"
    | "Sto. Nino 1"
    | "Sto. Nino 2"
    | "Sto. Nino 3"
    | "Zapatera"
    | "";
}