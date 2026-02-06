import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-primary-600">
                        SkillSwap
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/marketplace" className="text-gray-700 hover:text-primary-600">
                            Marketplace
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                                    Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">
                                        {user.name} | <span className="font-semibold text-primary-600">{user.creditBalance} credits</span>
                                    </span>
                                    <button onClick={logout} className="btn btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
