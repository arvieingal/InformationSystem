'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch, FaUser, FaDatabase, FaClipboardList } from 'react-icons/fa';

const Settings: React.FC = () => {
    // const router = useRouter(); // Commented out as it's not used
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/logs');
                const data = await response.json();
                // Filter logs for health-related actions
                const healthLogs = data.filter((log: any) => log.action.includes('health'));
                setLogs(healthLogs);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, []);

    function handleCardClick(content: string) {
        setModalContent(content);
    }

    function closeModal() {
        setModalContent(null);
    }

    return (
        <div className="min-h-screen bg-[#EDF3F8] p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Settings</h1>
            <div className="flex items-center">
              <FaSearch className="mr-2 text-gray-600" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* User Management Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><FaUser className="mr-2" />User Management</h2>
              <div className="space-y-4 ">
                <Card title="Add User" description="Create a new user account with required details, roles, and access permissions." imageSrc="/svg/people2.svg" onClick={() => handleCardClick('Add User')} />
                <Card title="Update User" description="Edit an existing user’s profile, role, or permissions to reflect changes in access or information." imageSrc="/svg/update.svg" onClick={() => handleCardClick('Update User')} />
                <Card 
                  title="Change my Password" 
                  description="Change your current password to a new one." 
                  imageSrc="/svg/password.svg" 
                  onClick={() => handleCardClick('Account Details')} 
                />
              </div>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center"><FaDatabase className="mr-2" />Data Backup & Restore</h2>
              <div className="space-y-4">
                <Card title="Backup Now" description="Backup Frequency: Weekly\nBackup Status: Active" />
              </div>
            </div>
    
            {/* Audit Logs Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><FaClipboardList className="mr-2" />Audit Logs</h2>
              <div className="space-y-4">
                {logs.length > 0 ? logs.map((log, index) => (
                    <LogEntry key={index} name={`${log.user}: ${log.action}`} />
                )) : <LogEntry name="No health-related logs available" />}
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
  <div className="bg-white p-4 rounded-lg shadow flex items-start cursor-pointer hover:bg-gray-100 transition" onClick={onClick}>
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
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: '',
    user_id: ''
  });
  const [users, setUsers] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  useEffect(() => {
    if (content === 'Update User') {
      fetch('http://localhost:3001/api/users')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error('Error fetching users:', error));
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateClick = (user: any) => {
    setFormData(user);
    setIsUpdateModal(true);
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('User deleted successfully');
        setUsers(users.filter(user => user.user_id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response;
      switch (content) {
        case 'Add User':
          response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          break;
        case 'Update User':
          response = await fetch(`http://localhost:3001/api/users/${formData.user_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          break;
        case 'Remove User':
          response = await fetch(`http://localhost:3001/api/users/${formData.user_id}`, {
            method: 'DELETE',
          });
          break;
        default:
          return;
      }

      if (response.ok) {
        alert(`${content} action successful`);
        onClose();
      } else {
        alert(`Failed to ${content.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error during ${content.toLowerCase()}:`, error);
      alert('An error occurred');
    }
  };

  const renderUserList = () => (
    <div>
      {users.map(user => (
        <div key={user.user_id} className="flex justify-between items-center mb-2">
          <span>{user.username} ({user.email})</span>
          <div>
            <button onClick={() => handleUpdateClick(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Update</button>
            <button onClick={() => handleDeleteClick(user.user_id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUpdateForm = () => (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div>
        <label>Role:</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div className="relative">
        <label>Password:</label>
        <input 
          type={showPassword ? "text" : "password"} 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          className="w-full mb-2 p-2 border rounded-md pr-10"
        />
        <Image 
          src={showPassword ? "/svg/visible.svg" : "/svg/hidden.svg"} 
          alt={showPassword ? "Hide Password" : "Show Password"} 
          width={20} 
          height={20} 
          onClick={togglePasswordVisibility} 
          className="cursor-pointer absolute mt-2 right-2 top-1/2 transform -translate-y-1/2"
        />
      </div>
      <div className="relative">
        <label>Confirm Password:</label>
        <input 
          type={showConfirmPassword ? "text" : "password"} 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md pr-10"
        />
        <Image 
          src={showConfirmPassword ? "/svg/visible.svg" : "/svg/hidden.svg"} 
          alt={showConfirmPassword ? "Hide Password" : "Show Password"} 
          width={20} 
          height={20} 
          onClick={toggleConfirmPasswordVisibility} 
          className="cursor-pointer absolute mt-2 right-2 top-1/2 transform -translate-y-1/2"
        />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>      
      <div>
        <label>Role:</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md" />
      </div>
      <div className="flex justify-end col-span-2 gap-4">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Add User</button>
      </div>
    </div>
  );

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
        {content === 'Add User' ? renderAddUserForm() : (isUpdateModal ? renderUpdateForm() : renderUserList())}
      </div>
    </div>
  );
};

export default Settings
