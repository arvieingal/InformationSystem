import ImmunizationRecordHistory from '@/components/ImmunizationRecordHistory';
import NutritionalStatusHistory from '@/components/NutritionalStatusHistory';
import SearchBar from '@/components/SearchBar'
import debounce from 'lodash.debounce';
import React from 'react'

// const handleSearch = React.useCallback(
//     debounce((query: string) => {
//         if (query.trim() === '') {
//             // If the search query is empty, reset to the original immunizations
//             fetchImmunizations(); // Assuming fetchImmunizations is accessible here
//             return;
//         }

//         const lowerCaseQuery = query.toLowerCase();
//         const filteredImmunizations = immunizations.filter((immunization) => {
//             const fullName = immunization.full_name ? immunization.full_name.toLowerCase() : '';
//             const vaccineType = immunization.vaccine_type ? immunization.vaccine_type.toLowerCase() : '';
//             const healthCenter = immunization.health_center ? immunization.health_center.toLowerCase() : '';
//             const remarks = immunization.remarks ? immunization.remarks.toLowerCase() : '';
//             const dateVaccinated = immunization.date_vaccinated ? formatDate(immunization.date_vaccinated.toString()).toLowerCase() : '';

//             return (
//                 fullName.includes(lowerCaseQuery) ||
//                 vaccineType.includes(lowerCaseQuery) ||
//                 (immunization.doses ? immunization.doses.toString().includes(lowerCaseQuery) : false) ||
//                 dateVaccinated.includes(lowerCaseQuery) ||
//                 healthCenter.includes(lowerCaseQuery) ||
//                 remarks.includes(lowerCaseQuery)
//             );
//         });
//         setImmunizations(filteredImmunizations);
//     }, 300), // Adjust the debounce delay as needed
//     [immunizations]
// );

export default function ChildHistory() {
    return (
        <div className='h-full w-full pt-[1rem] px-[3rem]'>
            <ImmunizationRecordHistory />
        </div>
    )
}
