interface GenderData {
    male: number;
    female: number;
}

interface VoterData {
    registered: number;
    nonRegistered: number;
}

export const genderDistribution: GenderData = {
    male: 28130,
    female: 11870,
};

export const voterDistribution: VoterData = {
    registered: 32000,
    nonRegistered: 8000,
};

export const ageData = {
    labels: [
        "Elderly (75+ years)",
        "Senior Citizens (60-74 years)",
        "Adults (35-59 years)",
        "Young Adults (20-34 years)",
        "Youth (13-19 years)",
        "Children (1-12 years)",
        "Infants (0-1 year)",
    ],
    datasets: [
        {
            label: "Population",
            data: [1000, 3000, 12000, 8000, 6000, 10000, 500],
            backgroundColor: "#00C0A9",
            borderRadius: 5, // Rounded corners
            barThickness: 10,
        },
    ],
};

export const populationDonutData = {
    labels: [
        "Purok 1",
        "Purok 2",
        "Purok 3",
        "Purok 4",
        "Purok 5",
        "Purok 6",
        "Purok 7",
        "Purok 8",
        "Purok 9",
        "Purok 10",
        "Purok 11",
        "Purok 12",
        "Purok 13",
        "Purok 14",
        "Purok 15",
    ],
    datasets: [
        {
            label: "Population Percentage",
            data: [10, 15, 5, 20, 12, 8, 6, 7, 9, 10, 13, 5, 8, 6, 7],
            backgroundColor: [
                "#FF0000",
                "#FF4500",
                "#FFD700",
                "#FFFF00",
                "#ADFF2F",
                "#7FFF00",
                "#00FF00",
                "#00FA9A",
                "#00FFFF",
                "#1E90FF",
                "#0000FF",
                "#8A2BE2",
                "#FF00FF",
                "#FF1493",
                "#FF69B4",
            ],
            borderWidth: 1,
        },
    ],
};

export const sectorDonutData = {
    labels: [
        "Severly Underweight",
        "Underweight",
        "Normal",
        "Overweight",
        "Obese",
    ],
    datasets: [
        {
            label: "Population Percentage",
            data: [13.75, 2, 20, 3.75, 7.5, 5.5, 10.5],
            backgroundColor: [
                "#B2E3C3",
                "#FFD7BE",
                "#007F73",
                "#08C44C",
                "#F5F5DC",
                "#FFC2A7",
                "#F7E34D",
            ],
            borderWidth: 1,
        },
    ],
};