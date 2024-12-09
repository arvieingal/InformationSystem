'use client';
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const IdleTimer = ({ timeout = 10 * 60 * 1000 }) => {
    const timer = useRef<NodeJS.Timeout | null>(null);
    const endTime = useRef<number | null>(null);

    const resetTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        endTime.current = Date.now() + timeout;

        timer.current = setTimeout(() => {
            signOut()
        }, timeout);
    };

    useEffect(() => {
        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners for user activity
        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);
        window.addEventListener("click", handleActivity);
        window.addEventListener("scroll", handleActivity);

        // Set the initial timer
        resetTimer();

        return () => {
            // Cleanup event listeners and timer
            if (timer.current) clearTimeout(timer.current);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            window.removeEventListener("click", handleActivity);
            window.removeEventListener("scroll", handleActivity);
        };
    }, [timeout]);

    // Periodically log remaining time, can remove anytime
    useEffect(() => {
        const interval = setInterval(() => {
            if (endTime.current) {
                const remainingTime = endTime.current - Date.now();
                if (remainingTime > 0) {
                }
            }
        }, 1000); // Log every second

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return null; // This component doesn't render anything
};

export default IdleTimer;
