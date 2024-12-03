"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaUser, FaClipboardList } from "react-icons/fa";
import Image from "next/image";
import { formatDate } from "@/components/formatDate";
import AdminHeader from "@/components/AdminHeader";
import { useSession } from "next-auth/react";

const Settings: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [displayedLogsCount, setDisplayedLogsCount] = useState<number>(15);

  const fetchLogs = async () => {
    console.log("fetchLogs function called");
    try {
      const response = await fetch("http://localhost:3001/api/logs");
      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Parsed logs:", data);

      // Flatten the array if it's nested
      const flattenedLogs = data.flat();
      setLogs(flattenedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };
  console.log(logs, "LssOGS");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users");

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response as JSON
      const data = await response.json();
      console.log("Fetched users:", data); // Debugging log
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    fetchLogs();
    fetchUsers();
  }, []);

  const handleCardClick = (content: string) => {
    setModalContent(content);
    if (content === "Change Password") {
      fetchUsers();
    }
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const loadMoreLogs = () => {
    setDisplayedLogsCount((prevCount) => prevCount + 15);
  };

  return (

    <>
      <div className="w-full h-screen bg-gray-100">
        <div className="w-full h-[10vh]">
          <AdminHeader />
        </div>
        <div className="flex flex-col items-center mt-[3rem]">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="bg-[#007F73] text-white px-2 py-2 text-[16px] rounded hover:bg-[#005f5a] w-[10rem] h-[3rem] transition"
            >
              Back
            </button>
            <div className="flex items-center bg-white p-2 rounded-md shadow-md w-[70rem] h-[3rem] ">
              <FaSearch className="mr-2 text-gray-600" />
              <input
                type="text"
                placeholder="Search..........................."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border-none outline-none w-full "
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
            {/* User Management Section */}
            <div className="col-span-1 lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">User Management</h2>
              <div className="space-y-4">
                {session?.user.role === "Admin" &&
                  <>
                    <Card
                      title="Add User"
                      description="Create a new user account with required details, roles, and access permissions."
                      imageSrc="/svg/people2.svg"
                      onClick={() => handleCardClick("Add User")}
                    />
                    <Card
                      title="Update User"
                      description="Edit an existing user’s profile, role, or permissions to reflect changes in access or information."
                      imageSrc="/svg/update.svg"
                      onClick={() => handleCardClick("Update User")}
                    />
                  </>
                }
                <Card
                  title="Change my Password"
                  description="Change your current password to a new one."
                  imageSrc="/svg/reset-password.png"
                  onClick={() => handleCardClick("Change Password")}
                />
              </div>

            </div>

            {/* Log Management Section */}
            {session?.user.role === "Admin" &&
              <div className="col-span-1 lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Log Management</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-2 gap-4">
                  {logs.length > 0 ? (
                    logs
                      .filter(log => log.username && log.action && log.timestamp)
                      .slice(0, displayedLogsCount)
                      .map((log) => (
                        <div key={log.id} className="mb-2">
                          {`${log.username} - ${log.action} - ${formatDate(log.timestamp)}`}
                        </div>
                      ))
                  ) : (
                    <div>No logs available</div>
                  )}
                  {logs.length > displayedLogsCount && (
                    <button
                      onClick={loadMoreLogs}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Load More
                    </button>
                  )}
                </div>
              </div>}
          </div>
        </div>

        {modalContent && (
          <Modal
            content={modalContent}
            onClose={closeModal}
            handleCardClick={handleCardClick}
          />
        )}
      </div>
    </>
  );
};

// Reusable Card Component
const Card = ({
  title,
  description,
  imageSrc,
  onClick,
}: {
  title: string;
  description: string;
  imageSrc?: string;
  onClick?: () => void;
}) => (
  <div
    className="bg-white p-4 rounded-lg shadow-lg flex items-start cursor-pointer hover:bg-gray-100 transition-transform transform hover:scale-105"
    onClick={onClick}
  >
    {imageSrc && (
      <Image
        src={imageSrc}
        alt={title}
        width={30}
        height={30}
        className="mr-4"
      />
    )}
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 whitespace-pre-line mt-2">{description}</p>
    </div>
  </div>
);

// Modal Component
const Modal = ({
  content,
  onClose,
  handleCardClick,
}: {
  content: string;
  onClose: () => void;
  handleCardClick: (content: string) => void;
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: "",
    user_id: "",
    showPassword: false,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmCurrentPassword, setConfirmCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (content === "Update User" || content === "Change Password") {
      fetch("http://localhost:3001/api/users")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched users:", data); // Debugging log
          setUsers(data);
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [content]);

  const handleVerifyPassword = () => {
    if (currentPassword === confirmCurrentPassword) {
      setIsVerified(true);
    } else {
      alert("Current passwords do not match");
    }
  };

  const handlePasswordChangeSubmit = async (userId: string) => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully");
        onClose();
      } else {
        alert("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred");
    }
  };

  const renderUserList = () => (
    <div>
      {users.map((user) => (
        <div
          key={user.user_id}
          className="flex justify-between items-center mb-2 shadow-md p-2 rounded-md"
        >
          <span>
            {user.username} ({user.email})
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateClick(user)}
              className="bg-gradient-to-l from-green-500 to-yellow-500 text-white px-2 py-1 rounded hover:from-green-600 hover:to-yellow-600 transition"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteClick(user.user_id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUpdateForm = () => (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <label>Status:</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className=" bg-gradient-to-l from-green-500 to-yellow-500 text-white px-4 py-2 rounded hover:from-green-600 hover:to-yellow-600 transition"
        >
          Save
        </button>
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="mt-4 grid grid-cols-2 gap-4 shadow-md p-4 rounded-md">
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div className="relative">
        <label>Password:</label>
        <input
          type={formData.showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md pr-10"
        />
        <Image
          src={formData.showPassword ? "/svg/visible.svg" : "/svg/hidden.svg"}
          alt={formData.showPassword ? "Hide Password" : "Show Password"}
          width={20}
          height={20}
          onClick={() =>
            setFormData((prevState) => ({
              ...prevState,
              showPassword: !prevState.showPassword,
            }))
          }
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
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="cursor-pointer absolute mt-2 right-2 top-1/2 transform -translate-y-1/2"
        />
      </div>
      <div>
        <label>Status:</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div>
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end col-span-2 gap-4">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className=" bg-gradient-to-l from-green-500 to-yellow-500 text-white px-4 py-2 rounded hover:from-green-600 hover:to-yellow-600 transition"
        >
          Add User
        </button>
      </div>
    </div>
  );

  const renderChangePasswordForm = (user: any) => (
    <div className="mt-4 flex flex-col gap-4 shadow-md p-4 rounded-md">
      {!isVerified ? (
        <>
          <div className="flex flex-col gap-2 ">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded-md"
            />
          </div>
          <div>
            <label>Confirm Current Password:</label>
            <input
              type="password"
              value={confirmCurrentPassword}
              onChange={(e) => setConfirmCurrentPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyPassword}
              className="bg-gradient-to-l from-green-500 to-yellow-500 text-white px-4 py-2 rounded hover:from-green-600 hover:to-yellow-600 transition"
            >
              Verify
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded-md"
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handlePasswordChangeSubmit(user.user_id)}
              className="bg-gradient-to-l from-green-500 to-yellow-500 text-white px-4 py-2 rounded hover:from-green-600 hover:to-yellow-600 transition"
            >
              Change Password
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderChangePasswordList = () => (
    <div>
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user.user_id}
            className="flex justify-between items-center mb-2"
          >
            <span>
              {user.username} ({user.email})
            </span>
            <button
              onClick={() => setFormData(user)}
              className="bg-gradient-to-l from-green-500 to-yellow-500 text-white px-2 py-1 rounded hover:from-green-600 hover:to-yellow-600 transition"
            >
              Change Password
            </button>
          </div>
        ))
      ) : (
        <div>No users available</div>
      )}
    </div>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User added successfully");
        onClose();
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred");
    }
  };

  const handleUpdateClick = (user: any) => {
    console.log("Update user:", user);
    setFormData(user);
    setIsUpdateModal(true);
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("User deleted successfully");
        setUsers(users.filter((user) => user.user_id !== userId));
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 w-[50%] h-[50%] rounded-lg shadow-lg relative">
        <button
          className="absolute top-0 right-0 text-gray-600 hover:text-gray-900 text-[3rem] transition-transform transform hover:scale-110"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center mt-8 text-gray-800">
          {content}
        </h2>
        {content === "Add User"
          ? renderAddUserForm()
          : content === "Change Password"
            ? renderChangePasswordForm(formData)
            : isUpdateModal
              ? renderUpdateForm()
              : renderUserList()}
      </div>
    </div>
  );
};

export default Settings;