'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import { useForm } from 'react-hook-form';

interface UserProps {
    isOpen: boolean;
    onClose: () => void;
    onUserSubmit: () => void;
}

interface FormData {
    role: string;
    name: string;
    username: string;
    email: string;
    password: string;
    userId: string;
}

export default function UserModal({ isOpen, onClose, onUserSubmit }: UserProps) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormData>();

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
        const selectedUserId = getValues("userId");

        if (data.newPassword !== data.confirmNewPassword) {
            setMessage("New passwords do not match");
            return;
        }

        try {
            const response = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUserId,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            if (response.ok) {
                alert("Password changed successfully");
                onClose();
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setMessage("An error occurred");
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleSubmit(onUserSubmit)}>
                {isOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white w-[40%] p-4 rounded-[10px] shadow-lg">
                        <div className="px-[1rem] mt-[1rem]">
                            <div>
                                <div><Image src={'/svg/add_people.svg'} alt='Add User' height={100} width={100} className='p-2 border-gray-400 border-[1px] rounded-[7px] w-[40px] h-[40px]' /></div>
                                <div className='text-[20px]'>Create new User</div>
                                <div className='text-[12px] text-[#545454]'>Enter new user info</div>
                            </div>
                            <label className="text-[14px]">Select Role</label>
                            <select
                                id="role"
                                className={`text-[12px] border py-2 mt-2 w-full rounded-[5px] outline-none text-gray-500 px-4 ${errors.role ? 'border-red-500' : 'border-[#C8C8C8]'
                                    }`}
                                {...register("role", {
                                    required: "Role is required"
                                })}
                            >
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="editor">Editor</option>
                            </select>
                            {errors.role && (
                                <p className="mt-2 text-red-600 text-[12px]">{errors.role.message}</p>
                            )}
                            {message && <p className="mt-4 text-center text-red-600">{message}</p>}

                            <label className="text-[14px]">Email</label>
                            <input
                                type="email"
                                id="email"
                                className={`text-[12px] border py-1 mt-2 w-full rounded-[5px] outline-none placeholder:text-gray-500 px-4 ${errors.email ? 'border-red-500' : 'border-[#C8C8C8]'
                                    }`}
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required"
                                })}
                            />
                            {errors.email && (
                                <p className="mt-2 text-red-600 text-[12px]">{errors.email.message}</p>
                            )}
                            {message && <p className="mt-4 text-center text-red-600">{message}</p>}

                            <label className="text-[14px]">Email</label>
                            <input
                                type="email"
                                id="email"
                                className={`text-[12px] border py-1 mt-2 w-full rounded-[5px] outline-none placeholder:text-gray-500 px-4 ${errors.email ? 'border-red-500' : 'border-[#C8C8C8]'
                                    }`}
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required"
                                })}
                            />
                            {errors.email && (
                                <p className="mt-2 text-red-600 text-[12px]">{errors.email.message}</p>
                            )}
                            {message && <p className="mt-4 text-center text-red-600">{message}</p>}

                            <label className="text-[14px]">Email</label>
                            <input
                                type="email"
                                id="email"
                                className={`text-[12px] border py-1 mt-2 w-full rounded-[5px] outline-none placeholder:text-gray-500 px-4 ${errors.email ? 'border-red-500' : 'border-[#C8C8C8]'
                                    }`}
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required"
                                })}
                            />
                            {errors.email && (
                                <p className="mt-2 text-red-600 text-[12px]">{errors.email.message}</p>
                            )}
                            {message && <p className="mt-4 text-center text-red-600">{message}</p>}

                            <label className="text-[14px]">Email</label>
                            <input
                                type="email"
                                id="email"
                                className={`text-[12px] border py-1 mt-2 w-full rounded-[5px] outline-none placeholder:text-gray-500 px-4 ${errors.email ? 'border-red-500' : 'border-[#C8C8C8]'
                                    }`}
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required"
                                })}
                            />
                            {errors.email && (
                                <p className="mt-2 text-red-600 text-[12px]">{errors.email.message}</p>
                            )}
                            {message && <p className="mt-4 text-center text-red-600">{message}</p>}

                            <div className="w-full mt-4 flex gap-5">
                                <button
                                    className="bg-white w-full py-2 rounded-[5px] border-[1px] border-black"
                                    type="button"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-[#24968B] w-full text-white  py-2 rounded-[5px]"
                                    type="submit"
                                >
                                    {loading ? "Creating..." : "Create Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </form>
        </div>
    )
}
