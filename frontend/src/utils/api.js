import { useAuth } from "@clerk/clerk-react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useAPI = () => {
    const { getToken } = useAuth();
    
    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken();

        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
        console.log("Making request to:", `${API_BASE_URL}api/${endpoint}`, options);

        const response = await fetch(`${API_BASE_URL}api/${endpoint}`, {
            ...defaultOptions,
            ...options
        })
        console.log(response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            if (response.status === 429) {
                throw new Error("Daily quota exceeded. Please try again later.");
            }
            throw new Error(errorData?.detail || "An error occurred while processing your request.");
        }

        return response.json();

    }
    return {
        makeRequest,
    };
}