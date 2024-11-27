export const logUserAction = async (action: string, userId: string) => {
    try {
        await fetch('http://localhost:3001/api/user-actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, userId, timestamp: new Date().toISOString() }),
        });
    } catch (error) {
        console.error('Error logging user action:', error);
    }
};