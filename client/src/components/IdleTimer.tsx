'use client'
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const IdleTimer = ({ timeout = 10 * 60 * 1000 }) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            signOut(); // Automatically log out the user
        }, timeout);
    };

    useEffect(() => {
        // Reset timer on user activity
        const handleActivity = () => resetTimer();

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);

        // Set the initial timer
        resetTimer();

        // Cleanup on component unmount
        return () => {
            if (timer.current) clearTimeout(timer.current);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
        };
    }, [timeout]);

    return null; // This component doesn't render anything
};

export default IdleTimer;
