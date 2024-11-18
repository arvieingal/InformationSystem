export const formatDate = (startDateString: string | null, endDateString?: string | null): string => {
    if (!startDateString) {
      return "";
    }
  
    const startDate = new Date(startDateString);
    const endDate = endDateString ? new Date(endDateString) : undefined;
  
    // Check if startDate is valid
    if (isNaN(startDate.getTime())) {
      return "Invalid Start Date";
    }
  
    // Check if endDate exists and is valid
    if (endDate && isNaN(endDate.getTime())) {
      return "Invalid End Date";
    }
  
    const months = [
      "January", "Febuary", "March.", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
  
    if (!endDate) {
      // Only startDate, return single date
      return `${months[startMonth]} ${startDay}, ${startYear}`;
    }
  
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();
  
    if (startMonth === endMonth && startYear === endYear) {
      // Same month and year, display as "month day1 - day2, year"
      return `${months[startMonth]} ${startDay} - ${endDay}, ${startYear}`;
    } else {
      // Different months or years, display as "month1 day1, year1 - month2 day2, year2"
      return `${months[startMonth]} ${startDay}, ${startYear} - ${months[endMonth]} ${endDay}, ${endYear}`;
    }
  };