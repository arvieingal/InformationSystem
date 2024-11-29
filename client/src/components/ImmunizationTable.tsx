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
    <div className='w-full px-[1.5rem] h-full'>
      <div className='bg-white h-full rounded-[5px] overflow-y-auto'>
        <table className="w-full border-collapse text-[14px]">
          <thead className='text-center'>
            <tr className='sticky top-0 bg-white shadow-gray-300 shadow-sm'>
              {['id', 'name', 'vaccine', 'dose', 'date of vaccination', 'health center', 'barangay'].map((key) => (
                <th
                  key={key}
                  className="py-2 px-6 text-left font-semibold text-[16px]"
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
              <th className="py-4 pr-6 text-left font-semibold text-[16px]">Option</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {immunizations.map((immunization, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 cursor-pointer">
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.child_id}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{`${immunization.full_name || ''}`.trim()}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.vaccine_type}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{`${immunization.doses || ''}`.trim()}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{formatDate(`${immunization.date_vaccinated || ''}`.trim())}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.health_center}</td>
                <td className="py-2 px-6 text-left" onClick={() => onViewDetails(immunization)}>{immunization.barangay}</td>
                <td className="py-2 pr-6 text-left flex items-center">
                  <Image
                    src="/svg/edit.svg"
                    alt="Edit"
                    height={100}
                    width={100}
                    className="w-5 h-5 mr-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(immunization);
                    }}
                  />
                  <Image
                    src="/svg/archive.svg"
                    alt="Archive"
                    height={100}
                    width={100}
                    className="w-5 h-5 mr-2 cursor-pointer"
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