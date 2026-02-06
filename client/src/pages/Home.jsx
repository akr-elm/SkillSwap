import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Exchange Skills, Not Money
                    </h1>
                    <p className="text-xl text-gray-700 mb-8">
                        Join SkillSwap and learn new skills while teaching what you know best.
                        Our credit-based system makes skill exchange fair and rewarding.
                    </p>
                    <div className="flex justify-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/marketplace" className="btn btn-primary text-lg px-8 py-3">
                                    Browse Skills
                                </Link>
                                <Link to="/dashboard" className="btn btn-secondary text-lg px-8 py-3">
                                    My Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                                    Get Started
                                </Link>
                                <Link to="/marketplace" className="btn btn-secondary text-lg px-8 py-3">
                                    Explore Skills
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card text-center">
                        <div className="text-4xl mb-4">🎓</div>
                        <h3 className="text-xl font-semibold mb-2">Learn Anything</h3>
                        <p className="text-gray-600">
                            Access a wide range of skills from programming to cooking, music to languages.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold mb-2">Credit-Based System</h3>
                        <p className="text-gray-600">
                            Earn credits by teaching and spend them to learn. Fair and transparent.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                        <p className="text-gray-600">
                            Connect with passionate people who love sharing their knowledge.
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                            1
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Create Your Profile</h4>
                            <p className="text-gray-600">Sign up and get 10 free credits to start learning.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                            2
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">List Your Skills</h4>
                            <p className="text-gray-600">Share what you know and set your credit price.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                            3
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Exchange Skills</h4>
                            <p className="text-gray-600">Request exchanges, teach others, and earn credits.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                            4
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Keep Learning</h4>
                            <p className="text-gray-600">Use your credits to learn new skills from the community.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
