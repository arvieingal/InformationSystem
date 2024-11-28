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
    <div className='w-full px-[1.5rem] h-[90%]'>
      <div className='bg-white h-full rounded-[5px] overflow-y-auto'>
        <table className="w-full border-collapse text-[14px]">
          <thead className='text-[#6C6C6C] text-center'>
            <tr className='sticky top-0 bg-white shadow-gray-300 shadow-sm'>
              {['id', 'name', 'sex', 'date of birth', 'health center', 'barangay', 'family no.'].map((key) => (
                <th
                  key={key}
                  className="py-2 px-6 text-left font-bold text-[16px]"
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
              <th className="py-4 pr-6 text-left font-bold text-[16px]">Option</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {immunizations.map((immunization, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.child_id}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{`${immunization.full_name || ''}`.trim()}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.sex}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{formatDate(immunization.birthdate)}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.health_center}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.address}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.household_number}</td>
                <td className="py-2 pr-6 text-left flex justify-center items-center">
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
      </div>
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