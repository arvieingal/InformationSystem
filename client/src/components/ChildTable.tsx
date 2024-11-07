import React from 'react';
import Image from 'next/image';

interface Child {
  id: number;
  name: string;
  age: number;
  sex: string;
  birthdate: string;
  heightCm: number;
  weightKg: number;
  nutritionalStatus: string;
  address?: string;
  email?: string;
  purok?: string;
  phoneNumber?: string;
}

interface TableProps {
  children: Child[];
  onSort: (key: keyof Child) => void;
  sortConfig: { key: keyof Child; direction: string } | null;
  onEdit: (child: Child) => void;
  onArchive: (child: Child) => void;
  onRowClick: (child: Child) => void;
}

const ChildTable: React.FC<TableProps> = ({ children, onSort, sortConfig, onEdit, onArchive, onRowClick }) => {
  return (
    <div className='w-full px-[1.5rem]'>
      <table className="min-w-full border-collapse border border-[#CCCCCC] bg-white text-sm rounded-lg">
        <thead>
          <tr>
            {['id', 'name', 'age', 'sex', 'birthdate', 'heightCm', 'weightKg', 'nutritionalStatus'].map((key) => (
              <th
                key={key}
                className="border border-gray-600 bg-gray-300 py-2"
                onClick={() => onSort(key as keyof Child)}
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
          {children.map((child, index) => (
            <tr key={index} onClick={() => onRowClick(child)}>
              <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer">{child.id}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.name.split(" ")[0]}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.age}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.sex}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.birthdate}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.heightCm}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.weightKg}</td>
              <td className="border border-[#CCCCCC] px-4 py-2">{child.nutritionalStatus}</td>
              <td className="border py-2 flex flex-row justify-center gap-2">
                <Image
                  src="/svg/edit.svg"
                  alt="Edit"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(child);
                  }}
                />
                <Image
                  src="/svg/archive.svg"
                  alt="Archive"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(child);
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

export default ChildTable; 