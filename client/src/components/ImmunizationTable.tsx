import React, { useState } from 'react';
import Image from 'next/image';
import { Immunization } from '@/types/Immunization';
import SweetAlert from './SweetAlert';
import ImmunizationModal from './ImmunizationModal';
import { formatDate } from './formatDate';

interface TableProps {
  immunizations: Immunization[];
  onSort: (key: keyof Immunization) => void;
  sortConfig: { key: keyof Immunization; direction: string } | null;
  onEdit: (immunization: Immunization) => void;
  onArchive: (immunization: Immunization) => void;
  onRowClick: (immunization: Immunization) => void;
  onViewDetails: (immunization: Immunization) => void;
}

const ImmunizationTable: React.FC<TableProps> = ({ immunizations, onSort, sortConfig, onEdit, onArchive, onRowClick, onViewDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImmunization, setSelectedImmunization] = useState<Immunization | null>(null);

  const handleEditClick = async (immunization: Immunization) => {
    const isConfirmed = await SweetAlert.showConfirm("Do you want to edit this immunization?");
    if (isConfirmed) {
      setSelectedImmunization(immunization);
      setIsModalOpen(true);
    }
  };

  const handleSave = (updatedImmunization: Immunization) => {
    onEdit(updatedImmunization);
    setIsModalOpen(false);
  };

  console.log(immunizations);

  return (
    <div className='w-full px-[1.5rem]'>
      <table className="min-w-full border-collapse border border-[#CCCCCC] bg-white text-sm rounded-lg">
        <thead>
          <tr>
            {['id', 'name', 'sex', 'date of birth', 'health center', 'barangay', 'family no.'].map((key) => (
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
            <tr key={index}>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{immunization.record_id}</td>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{`${immunization.child.first_name || ''} ${immunization.child.middle_name || ''} ${immunization.child.last_name || ''} ${immunization.child.suffix || ''}`.trim()}</td>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{immunization.child.sex}</td>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{formatDate(immunization.child.dateOfBirth)}</td>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{immunization.health_center}</td>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{immunization.barangay}</td>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer" onClick={() => onViewDetails(immunization)}>{immunization.family_number}</td>
              <td className="border py-2 flex flex-row justify-center gap-2">
                <Image
                  src="/svg/edit.svg"
                  alt="Edit"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(immunization);
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
      {isModalOpen && selectedImmunization && (
        <ImmunizationModal
          onClose={() => setIsModalOpen(false)}
          immunization={selectedImmunization}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ImmunizationTable; 