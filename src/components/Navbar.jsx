import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, PlusCircle, Search, FileText, ShieldAlert, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
          <Package size={22} color="#1e3a8a" />
          <span>Campus Lost & Found</span>
          <span className="college-badge">Portal</span>
        </Link>

        <nav>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/items?type=LOST" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Lost Items
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/items?type=FOUND" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Found Items
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileText size={16} />
                    My Reports
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <ShieldAlert size={16} />
                      Admin
                    </NavLink>
                  </li>
                )}
                <li>
                  <div className="user-badge" title={`${user?.fullName} (${user?.collegeIdNumber})`}>
                    <strong>{user?.fullName?.split(' ')[0]}</strong>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({user?.role === 'ROLE_ADMIN' ? 'Admin' : user?.role === 'ROLE_STAFF' ? 'Staff' : 'Student'})</span>
                  </div>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log out of account">
                    <LogOut size={14} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/items" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Search size={16} />
                    Browse Items
                  </NavLink>
                </li>
                <li>
                  <Link to="/login" className="btn btn-outline btn-sm">
                    <LogIn size={15} />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    <UserPlus size={15} />
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
