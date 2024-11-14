export const dummyHouseholds = [
    {
        id: 1,
        householdHead: "John Doe",
        purok: "Purok 1",
        isBusinessOwner: "Yes",
    },
    {
        id: 2,
        householdHead: "Maria Santos",
        purok: "Purok 3",
        isBusinessOwner: "No",
    },
    {
        id: 3,
        householdHead: "Pedro Garcia",
        purok: "Purok 2",
        isBusinessOwner: "Yes",
    },
    {
        id: 4,
        householdHead: "Ana Reyes",
        purok: "Purok 1",
        isBusinessOwner: "No",
    },
    {
        id: 5,
        householdHead: "Miguel Cruz",
        purok: "Purok 4",
        isBusinessOwner: "Yes",
    },
];

export const dummyRenters = [
    {
        id: 1,
        householdOwner: "John Doe",
        renterName: "John Doe",
        civilStatus: "Married", // Added field
        sex: "Male", // Added field
        birthdate: "1985-05-15", // Added field
        monthsYearsOfStay: "5 years", // Added field
        work: "Engineer", // Added field
    },
    {
        id: 2,
        householdOwner: "Maria Santos",
        renterName: "John Doe",
        civilStatus: "Single", // Added field
        sex: "Female", // Added field
        birthdate: "1990-08-22", // Added field
        monthsYearsOfStay: "2 years", // Added field
        work: "Teacher", // Added field
    },
    {
        id: 3,
        householdOwner: "Pedro Garcia",
        renterName: "John Doe",
        civilStatus: "Married", // Added field
        sex: "Male", // Added field
        birthdate: "1980-12-01", // Added field
        monthsYearsOfStay: "10 years", // Added field
        work: "Businessman", // Added field
    },
    {
        id: 4,
        householdOwner: "Ana Reyes",
        renterName: "John Doe",
        civilStatus: "Widowed", // Added field
        sex: "Female", // Added field
        birthdate: "1975-03-30", // Added field
        monthsYearsOfStay: "3 years", // Added field
        work: "Nurse", // Added field
    },
    {
        id: 5,
        householdOwner: "Miguel Cruz",
        renterName: "John Doe",
        civilStatus: "Married", // Added field
        sex: "Male", // Added field
        birthdate: "1995-07-19", // Added field
        monthsYearsOfStay: "1 year", // Added field
        work: "Chef", // Added field
    },
];

export const dummySectorData = [
    { number: 1, name: "Purok 1" },
    { number: 2, name: "Purok 2" },
    { number: 3, name: "Purok 3" },
    { number: 4, name: "Purok 4" },
    { number: 5, name: "Purok 5" },
];

export const dummyPurokZone = [
    {
      id: 1,
      purokZoneName: 'Abellana',
      population: 540,
      totalHouseholdNumber: 208,
      totalNumberOfRenters: 208,
    },
    {
      id: 2,
      purokZoneName: 'Banilad',
      population: 600,
      totalHouseholdNumber: 250,
      totalNumberOfRenters: 150,
    },
    {
      id: 3,
      purokZoneName: 'Cebu City',
      population: 1200,
      totalHouseholdNumber: 500,
      totalNumberOfRenters: 300,
    },
    {
      id: 4,
      purokZoneName: 'Mandaue',
      population: 800,
      totalHouseholdNumber: 350,
      totalNumberOfRenters: 200,
    },
    {
      id: 5,
      purokZoneName: 'Lapu-Lapu',
      population: 700,
      totalHouseholdNumber: 300,
      totalNumberOfRenters: 180,
    },
  ];