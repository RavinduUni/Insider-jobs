import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [companies, setCompanies] = useState([]);

    const fetchUserProfile = async () => {
        if (!token) return;

        const endpoint = role === 'student' ? 'http://localhost:5000/api/student/profile' : 'http://localhost:5000/api/recruiter/profile';

        try {
            const { success, student, recruiter } = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json());
            if (success) {
                setUser(student || recruiter);
            }

        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
            const expiryTime = decoded.exp * 1000 - Date.now();

            if (expiryTime <= 0) {
                setToken(null);
                setRole(null);
                setUser(null);
                localStorage.removeItem('token');
                return;
            }

            const timer = setTimeout(() => {
                setToken(null);
                setRole(null);
                setUser(null);
                localStorage.removeItem('token');
            }, expiryTime);

            return () => clearTimeout(timer);
        } catch (error) {
            setToken(null);
            setRole(null);
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (role && token) {
            fetchUserProfile();
        }
    }, [token, role]);


    //Get All projects
    const fetchAllProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/projects');
            const data = await response.json();
            setProjects(data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    //Get All companies
    const fetchAllCompanies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/companies');
            const data = await response.json();
            
            if (data.success) {
                console.log('Companies:', data.companies);
                setCompanies(data.companies);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    }

    useEffect(() => {
        fetchAllProjects();
        fetchAllCompanies();
    }, [token]);

    const value = {
        token,
        setToken,
        role,
        user,
        setUser,
        projects,
        setProjects,
        companies,
        setCompanies
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;