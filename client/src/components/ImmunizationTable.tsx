import React from 'react';
import Image from 'next/image';

interface Immunization {
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
  administeredBy: string;
  sideEffects: string;
  location: string;
}

interface TableProps {
  immunizations: Immunization[];
  onSort: (key: keyof Immunization) => void;
  sortConfig: { key: keyof Immunization; direction: string } | null;
  onEdit: (immunization: Immunization) => void;
  onArchive: (immunization: Immunization) => void;
  onRowClick: (immunization: Immunization) => void;
}

const ImmunizationTable: React.FC<TableProps> = ({ immunizations, onSort, sortConfig, onEdit, onArchive, onRowClick }) => {
  return (
    <div className='w-full px-[1.5rem]'>
      <table className="min-w-full border-collapse border border-[#CCCCCC] bg-white text-sm rounded-lg">
        <thead>
          <tr>
            {['id', 'name', 'date of birth', 'place of birth', 'address', 'mother name', 'father name', 'birth height', 'birth weight', 'sex', 'health center', 'barangay', 'family number', 'administered by', 'side effects', 'location'].map((key) => (
              <th
                key={key}
                className="border border-gray-600 bg-gray-300 py-2"
                onClick={() => onSort(key as keyof Immunization)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                {sortConfig?.key === key && (
                  <span>
                    {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </th>
            ))}
            <th className="border border-gray-600 bg-gray-300 py-2">Option</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {immunizations.map((immunization, index) => (
            <tr key={index} onClick={() => onRowClick(immunization)}>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer">{immunization.record_id}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.first_name}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.date_of_birth}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.place_of_birth}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.address}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.mother_name}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.father_name}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.birth_height}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.birth_weight}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.sex}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.health_center}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.barangay}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.family_number}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.administeredBy}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.sideEffects}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.location}</td>
              <td className="border py-2 flex flex-row justify-center gap-2">
                <Image
                  src="/svg/edit.svg"
                  alt="Edit"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(immunization);
                  }}
                />
                <Image
                  src="/svg/archive.svg"
                  alt="Archive"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(immunization);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImmunizationTable; 