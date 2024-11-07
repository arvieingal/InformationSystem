'use client'
import HealthCard from '@/components/HealthCard'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

const Settings: React.FC = () => {
    const router = useRouter();

    function handleCardClick(path: string) {
        router.push(path);
    }

    // Sample data
    const adminName = "Juan dela Cruz";
    const backupFrequency = "Weekly";
    const lastBackupDate = "2024-10-28";

    return (
        <div>
            <div className="flex flex-row md:flex md:flex-row justify-center gap-[4rem] ">
                <div onClick={() => router.push("/main/health/nutritional_status")}>
                    <Image
                        className="mt-[2rem]"
                        src="/svg/immunization_records.svg"
                        alt="Nutritional Status"
                        width={250}
                        height={50}
                    />
                </div>
                <div onClick={() => router.push("/main/health/immunization_record")}>
                    <Image
                        src="/svg/health_image.svg"
                        alt="Nutritional Status"
                        width={250}
                        height={50}
                    />
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-6 flex items-center justify-center">System Settings & Maintenance</h1>
      
      {/* User Management Section */}
      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add User</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Update User</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove User</button>
        </div>
      </div>

      {/* Data Backup & Restore Section */}
      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Data Backup & Restore</h2>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Backup Now</button>
          <div>
            <p className="text-gray-600">Last Backup: <span className="font-medium">October 28, 2024</span></p>
            <p className="text-gray-600">Backup Frequency: <span className="font-medium">Weekly</span></p>
            <p className="text-gray-600">Backup Status: <span className="font-medium text-green-600">Success</span></p>
          </div>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
        <div className="flex items-center gap-4 mb-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">View Logs</button>
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" 
          />
          <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Export Logs</button>
        </div>
        <div className="text-gray-600">
          <p>Last User Action: <span className="font-medium">Login by Juan dela Cruz</span> (10:35 AM, Nov 1, 2024)</p>
          <p>Last Backup Action: <span className="font-medium">Automatic Weekly Backup</span> (Oct 28, 2024)</p>
        </div>
      </div>
    </div>
  );
};

export default Settings
