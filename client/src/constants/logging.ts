export const logUserAction = async (action: string, userId: string) => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, userId, timestamp: new Date().toISOString() }),
        });
    } catch (error) {
        console.error('Error logging user action:', error);
    }
};