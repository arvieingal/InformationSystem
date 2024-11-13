'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const Settings: React.FC = () => {
    const router = useRouter();
    const [modalContent, setModalContent] = useState<string | null>(null);

    function handleCardClick(content: string) {
        setModalContent(content);
    }

    function closeModal() {
        setModalContent(null);
    }

    return (
        <div className="min-h-screen bg-[#EDF3F8] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* User Management Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <div className="space-y-4">
                <Card title="Add User" description="Create a new user account with required details, roles, and access permissions." imageSrc="/svg/people2.svg" onClick={() => handleCardClick('Add User')} />
                <Card title="Update User" description="Edit an existing user’s profile, role, or permissions to reflect changes in access or information." imageSrc="/svg/update.svg" onClick={() => handleCardClick('Update User')} />
                <Card title="Remove User" description="Delete a user account and revoke all associated system access and permissions." imageSrc="/svg/delete.svg" onClick={() => handleCardClick('Remove User')} />
              </div>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Data Backup & Restore</h2>
              <div className="space-y-4">
                <Card title="Backup Now" description="Backup Frequency: Weekly\nBackup Status: Active" />
              </div>
            </div>
    
            {/* Audit Logs Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
              <div className="space-y-4">
                <Card title="View Logs" description="Last User Action: Login by John Vincent Rosales (2:07 PM, Nov 6, 2024)\nLast Backup Action: Automated Weekly Backup (Sep 9, 2023)" imageSrc="/svg/list.svg" />
                <LogEntry name="Mariz Gutib" />
                <LogEntry name="" />
                <LogEntry name="" />
                <LogEntry name="" />
                <LogEntry name="" />
              </div>
            </div>
          </div>

          {modalContent && (
            <Modal content={modalContent} onClose={closeModal} />
          )}
        </div>
    );
};

// Reusable Card Component
const Card = ({ title, description, imageSrc, onClick }: { title: string; description: string; imageSrc?: string; onClick?: () => void }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-start cursor-pointer" onClick={onClick}>
    {imageSrc && (
      <Image src={imageSrc} alt={title} width={30} height={30} className="mr-4" />
    )}
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 whitespace-pre-line mt-2">{description}</p>
    </div>
  </div>
);

const LogEntry = ({ name }: { name: string | undefined }) => (
  <div className="bg-white p-4 rounded-lg shadow text-gray-700">
    {name ? name : "No logs available"}
  </div>
);

// Modal Component
const Modal = ({ content, onClose }: { content: string; onClose: () => void }) => {
  const renderContent = () => {
    switch (content) {
      case 'Add User':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input type="email" className="w-full mb-2 p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username:</label>
                <input type="text" className="w-full mb-2 p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input type="password" className="w-full mb-2 p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                <input type="password" className="w-full mb-2 p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role:</label>
                <input type="text" className="w-full mb-2 p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status:</label>
                <input type="text" className="w-full mb-2 p-2 border rounded-md" />
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button className="bg-gray-200 text-black px-4 py-2 rounded-md ">Cancel</button>
              <button className="bg-[#007F73] text-white px-4 py-2 rounded-md ">Update</button>
            </div>
          </>
        );
      case 'Update User':
        return (
          <>
            <p>Update the user details here...</p>
            {/* Add fields similar to 'Add User' if needed */}
          </>
        );
      case 'Remove User':
        return (
          <>
            <p>Are you sure you want to delete this user?</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </>
        );
      default:
        return <p>Here you can add more details or forms related to {content}.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 w-[50%] h-[50%] rounded-lg shadow-lg relative">
        <button
          className="absolute top-0 right-0 text-gray-600 hover:text-gray-900 text-[3rem]"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center mt-[2rem]">{content}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings
