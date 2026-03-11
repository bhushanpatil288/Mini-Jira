// ============================================================
// Navbar Component
// ============================================================
// Shows the app brand, a link to boards, and a logout button
// when the user is logged in.
// ============================================================

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/boards" className="navbar__brand">
                📋 Mini Jira
            </Link>

            {user && (
                <div className="navbar__links">
                    <Link to="/boards">Boards</Link>
                    <span className="navbar__user">Hi, {user.name}</span>
                    <button className="btn btn-outline btn-sm" onClick={logout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
