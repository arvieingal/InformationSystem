import React from 'react';
import Image from 'next/image';

interface Immunization {
  id: number;
  fullName: string;
  ageMonths: number;
  vaccineType: string;
  doseNumber: number;
  sex: string;
  scheduledDate: string;
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
            {['id', 'fullName', 'ageMonths', 'vaccineType', 'doseNumber', 'sex', 'scheduledDate', 'administeredBy', 'sideEffects', 'location'].map((key) => (
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
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer">{immunization.id}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.fullName}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.ageMonths}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.vaccineType}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.doseNumber}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.sex}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{immunization.scheduledDate}</td>
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