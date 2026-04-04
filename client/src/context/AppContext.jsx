import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
            const expiryTime = decoded.exp * 1000 - Date.now();

            if (expiryTime <= 0) {
                setToken(null);
                localStorage.removeItem('token');
                return;
            }

            const timer = setTimeout(() => {
                setToken(null);
                localStorage.removeItem('token');
            }, expiryTime);

            return () => clearTimeout(timer);
        } catch (error) {
            setToken(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    const value = {
        token,
        setToken,
        role,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;