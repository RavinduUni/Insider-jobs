import { Briefcase } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar2 = () => {

    const { token, role, setToken } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsDropdownOpen(false);
        navigate('/');
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Insider<span className="text-blue-600">jobs</span></span>
                </NavLink>
                <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
                    <NavLink to="/projects">Projects</NavLink>
                    <NavLink to="/companies">Companies</NavLink>
                    <NavLink to="/">Pricing</NavLink>
                    <NavLink to="/">About</NavLink>
                </div>
                {token ? (
                    <div className='w-10 h-10 relative bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        AJ
                        {isDropdownOpen && (
                            <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-md py-2 min-w-max z-50">
                                <button onClick={() => { navigate(role === 'student' ? '/student-dashboard' : '/owner-dashboard'); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Dashboard</button>
                                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100">Sign Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/auth?type=recruiter&mode=login')} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Recruiter Login</button>
                        <button onClick={() => navigate('/auth?type=student&mode=login')} className="text-sm px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium cursor-pointer">Student Login</button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar2