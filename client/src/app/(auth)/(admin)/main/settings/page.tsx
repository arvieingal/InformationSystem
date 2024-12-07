"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { formatDate } from "@/components/formatDate";
import AdminHeader from "@/components/AdminHeader";
import SweetAlert from "@/components/SweetAlert";
import { useSession } from "next-auth/react";

const Settings: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [modalContent, setModalContent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const logsPerPage = 13  ;
  const usersPerPage = 10;
  const [userPage, setUserPage] = useState<number>(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/logs/${session?.user.user_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched logs:", data);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };
  console.log(logs, 'DATA LOGS')

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  const handleCardClick = (content: string) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent("");
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * logsPerPage < logs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredLogs = logs?.filter(log =>
    log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
            {session?.user.role === "Admin" && (
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
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
            {/* User Management Section */}
            <div className="col-span-1 lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">User Management</h2>
              <div className="space-y-4">
                {session?.user.role === "Admin" && (
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
                )}
                <Card
                  title="Change my Password"
                  description="Change your current password to a new one."
                  imageSrc="/svg/reset-password.png"
                  onClick={() => handleCardClick("ChangeMyPassword")}
                />
              </div>
            </div>
            {/* Log Management Section */}
            {session?.user.role === "Admin" && (
              <div className="col-span-1 lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Log Management</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  {filteredLogs.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {filteredLogs
                          .slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage)
                          .map((log) => (
                            <div key={log.id} className="mb-2">
                              {`${log.username} - ${log.action} - ${formatDate(log.timestamp)}`}
                            </div>
                          ))}
                      </div>
                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 0}
                          className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={handleNextPage}
                          disabled={(currentPage + 1) * logsPerPage >= filteredLogs.length}
                          className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition w-[6rem] disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>No logs available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {modalContent === "Update User" && (
          <Modal
            content="Update User"
            onClose={closeModal}
            handleCardClick={handleCardClick}
            setModalContent={setModalContent}
          />
        )}
        {modalContent === "ChangeMyPassword" && (
          <ChangeMyPasswordModal onClose={closeModal} />
        )}
        {modalContent === "Add User" && (
          <Modal
            content="Add User"
            onClose={closeModal}
            handleCardClick={handleCardClick}
            setModalContent={setModalContent}
          />
        )}
      </div>
    </>
  );
};
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
  setModalContent,
}: {
  content: string;
  onClose: () => void;
  handleCardClick: (content: string) => void;
  setModalContent: (value: string) => void;
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmCurrentPassword, setShowConfirmCurrentPassword] = useState(false);
  const usersPerPage = 5;
  const [userPage, setUserPage] = useState<number>(0);
  const { data: session } = useSession(); // Access session data

  useEffect(() => {
    if (content === "Update User" || content === "Change Password") {
      fetch("http://localhost:3001/api/users")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched users:", data); 
          setUsers(data);
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [content]);

  const handleVerifyPassword = async () => {
    if (currentPassword !== confirmCurrentPassword) {
      alert("Current passwords do not match");
      return;
    }

    try {
      if (!session) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/users/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`, // Use session token
          },
          body: JSON.stringify({ currentPassword }),
        }
      );

      if (response.ok) {
        alert("Password verified!");
      } else {
        const error = await response.json();
        alert(error.message || "Current password is incorrect");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("An error occurred");
    }
  };

  const handlePasswordChangeSubmit = async (userId: string) => {
    if (currentPassword !== confirmCurrentPassword) {
      alert("Current passwords do not match");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }
  
      const response = await fetch(
        `http://localhost:3001/api/users/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token
          },
          body: JSON.stringify({ currentPassword }),
        }
      );
  
      if (response.ok) {
        alert("Password verified!");
      } else {
        const error = await response.json();
        alert(error.message || "Current password is incorrect");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("An error occurred");
    }
  };

  const handleNextUserPage = () => {
    if ((userPage + 1) * usersPerPage < users.length) {
      setUserPage(userPage + 1);
    }
  };

  const handlePreviousUserPage = () => {
    if (userPage > 0) {
      setUserPage(userPage - 1);
    }
  };

  const renderUserList = () => (
    <div>
      {users
        .slice(userPage * usersPerPage, (userPage + 1) * usersPerPage)
        .map((user) => (
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
                className="bg-[#007F73] text-white px-2 py-1 rounded hover:bg-[#005f5a] transition"
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
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePreviousUserPage}
          disabled={userPage === 0}
          className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextUserPage}
          disabled={(userPage + 1) * usersPerPage >= users.length}
          className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
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
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="not active">Not Active</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status}</p>}
      </div>
      <div>
        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role}</p>}
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
          className=" bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition"
        >
          Save
        </button>
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="mt-4 grid grid-cols-2 gap-4 shadow-md p-4 rounded-md">
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md outline-none"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="relative">
        <label>Password:</label>
        <input
          type={formData.showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md pr-10 outline-none"
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
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md outline-none"
        />
      </div>
      <div className="relative">
        <label>Confirm Password:</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded-md pr-10 outline-none"
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
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md outline-none"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="not active">Not Active</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status}</p>}
      </div>
      <div>
        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-md outline-none"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role}</p>}
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
          className=" bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition"
        >
          Add User
        </button>
      </div>
    </div>
  );

  const renderChangePasswordForm = () => (
    <div className="mt-4 flex flex-col gap-4 shadow-md p-4 rounded-md">
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
          onClick={() => handlePasswordChangeSubmit(formData.user_id)}
          className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition"
        >
          Change Password
        </button>
      </div>
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
              className="bg-[#007F73] text-white px-2 py-1 rounded hover:bg-[#005f5a] transition"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the field as the user types
    const newErrors: { [key: string]: string } = {};

    if (name === "email") {
      if (!value) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Email is invalid make sure to add @ and it is active.";
      }
    }

    if (name === "username" && !value) {
      newErrors.username = "Username is required.";
    }

    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required.";
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }
    }

    if (name === "confirmPassword" && value !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (name === "status" && !value) {
      newErrors.status = "Status is required.";
    }

    if (name === "role" && !value) {
      newErrors.role = "Role is required.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    // Validate username
    if (!formData.username) {
      newErrors.username = "Username is required.";
    }

    // Validate status
    if (!formData.status) {
      newErrors.status = "Status is required.";
    }

    // Validate role
    if (!formData.role) {
      newErrors.role = "Role is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const confirmMessage = isUpdateModal
      ? "Are you sure you want to update this user?"
      : "Are you sure you want to add this user?";
    const confirm = await SweetAlert.showConfirm(confirmMessage);
    if (!confirm) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${isUpdateModal ? formData.user_id : ""}`,
        {
          method: isUpdateModal ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await SweetAlert.showSuccess(
          isUpdateModal ? "User updated successfully" : "User added successfully"
        );
        onClose();
      } else {
        SweetAlert.showError(
          isUpdateModal ? "Failed to update user" : "Failed to add user"
        );
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      SweetAlert.showError("An error occurred");
    }
  };

  const handleUpdateClick = (user: any) => {
    setFormData(user);
    setIsUpdateModal(true);
    setModalContent("Update User");
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      const confirm = await SweetAlert.showConfirm("Are you sure you want to delete this user?");
      if (!confirm) return;

      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.user_id !== userId));
        await SweetAlert.showSuccess("User deleted successfully");
      } else {
        SweetAlert.showError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      SweetAlert.showError("An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 w-[50%] rounded-lg shadow-lg relative">
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
            ? renderChangePasswordForm()
            : isUpdateModal
              ? renderUpdateForm()
              : renderUserList()}
      </div>
    </div>
  );
};

// New ChangeMyPasswordModal Component
const ChangeMyPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmCurrentPassword, setConfirmCurrentPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmCurrentPassword, setShowConfirmCurrentPassword] = useState(false);
  const { data: session } = useSession(); // Access session data

  const handleVerifyCurrentPassword = async () => {
    if (currentPassword !== confirmCurrentPassword) {
      alert("Current passwords do not match");
      return;
    }

    try {
      if (!session) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/users/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`, // Use session token
          },
          body: JSON.stringify({ currentPassword }),
        }
      );

      if (response.ok) {
        setIsVerified(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Current password is incorrect");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("An error occurred while verifying the password");
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
          {isVerified ? "Enter New Password" : "Verify Current Password"}
        </h2>
        {isVerified ? (
          <NewPasswordModal onClose={onClose} />
        ) : (
          <div className="mt-4 flex flex-col gap-4 shadow-md p-4 rounded-md">
            <div>
              <label>Current Password:</label>
              <div className="relative">
                <input
                  type={currentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full mb-2 p-2 border rounded-md pr-10 outline-none"
                />
                <Image
                  src={currentPassword ? "/svg/visible.svg" : "/svg/hidden.svg"}
                  alt={currentPassword ? "Hide Password" : "Show Password"}
                  width={20}
                  height={20}
                  onClick={() => setCurrentPassword(currentPassword ? "" : "")}
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div>
              <label>Confirm Current Password:</label>
              <div className="relative">
                <input
                  type={confirmCurrentPassword ? "text" : "password"}
                  value={confirmCurrentPassword}
                  onChange={(e) => setConfirmCurrentPassword(e.target.value)}
                  className="w-full mb-2 p-2 border rounded-md pr-10 outline-none"
                />
                <Image
                  src={confirmCurrentPassword ? "/svg/visible.svg" : "/svg/hidden.svg"}
                  alt={confirmCurrentPassword ? "Hide Password" : "Show Password"}
                  width={20}
                  height={20}
                  onClick={() => setConfirmCurrentPassword(confirmCurrentPassword ? "" : "")}
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyCurrentPassword}
                className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition"
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NewPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handlePasswordChangeSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/change-my-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
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

  return (
    <div className="mt-4 flex flex-col gap-4 shadow-md p-4 rounded-md">
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
          onClick={handlePasswordChangeSubmit}
          className="bg-[#007F73] text-white px-4 py-2 rounded hover:bg-[#005f5a] transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Settings;
