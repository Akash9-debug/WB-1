import { useEffect } from 'react';

export const useRealtime = (fetchFunction, interval = 5000) => {
    useEffect(() => {
        // Initial fetch
        fetchFunction();

        // Set up polling
        const intervalId = setInterval(fetchFunction, interval);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [fetchFunction]);
}; 