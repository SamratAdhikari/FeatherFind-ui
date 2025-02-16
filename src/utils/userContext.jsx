import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Export custom hook for convenience
export const useUser = () => useContext(UserContext);

// Provider Component
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem("username") || "");

    // Listen for localStorage updates
    useEffect(() => {
        const handleStorageChange = () => {
            setUsername(localStorage.getItem("username") || "");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};
