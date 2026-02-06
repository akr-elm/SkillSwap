import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import { exchangeService } from '../services/exchangeService';
import SkillCard from '../components/SkillCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, updateUserCredits } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const data = await userService.getDashboard();
            setDashboardData(data);
            updateUserCredits(data.creditBalance);
        } catch (err) {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSkill = async (skillId) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;

        try {
            await skillService.deleteSkill(skillId);
            fetchDashboard();
        } catch (err) {
            alert('Failed to delete skill.');
        }
    };

    const handleExchangeAction = async (exchangeId, status) => {
        try {
            await exchangeService.updateExchangeStatus(exchangeId, status);
            fetchDashboard();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update exchange.');
        }
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            PENDING: 'badge-pending',
            ACCEPTED: 'badge-accepted',
            REJECTED: 'badge-rejected',
            COMPLETED: 'badge-completed',
        };
        return classes[status] || '';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user.name}!</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-primary-600">{dashboardData.creditBalance}</div>
                        <div className="text-gray-600">Credits</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalSkills}</div>
                        <div className="text-gray-600">My Skills</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalExchangesAsTeacher}</div>
                        <div className="text-gray-600">Teaching</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalExchangesAsLearner}</div>
                        <div className="text-gray-600">Learning</div>
                    </div>
                </div>

                {/* My Skills */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">My Skills</h2>
                        <Link to="/skills/create" className="btn btn-primary">
                            + Add New Skill
                        </Link>
                    </div>

                    {dashboardData.skills.length === 0 ? (
                        <div className="card text-center py-8">
                            <p className="text-gray-600 mb-4">You haven't created any skills yet.</p>
                            <Link to="/skills/create" className="btn btn-primary">
                                Create Your First Skill
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardData.skills.map(skill => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    showActions={true}
                                    onDelete={handleDeleteSkill}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Requests (as Teacher) */}
                {dashboardData.stats.pendingRequests > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Pending Requests ({dashboardData.stats.pendingRequests})
                        </h2>
                        <div className="space-y-4">
                            {dashboardData.exchangesAsTeacher
                                .filter(ex => ex.status === 'PENDING')
                                .map(exchange => (
                                    <div key={exchange.id} className="card">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1">{exchange.skill.title}</h3>
                                                <p className="text-gray-600 mb-2">
                                                    Requested by: {exchange.learner.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Duration: {exchange.duration}h | Credits: {exchange.credits}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleExchangeAction(exchange.id, 'ACCEPTED')}
                                                    className="btn btn-primary"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleExchangeAction(exchange.id, 'REJECTED')}
                                                    className="btn btn-danger"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Exchanges as Learner */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">My Learning Exchanges</h2>
                    {dashboardData.exchangesAsLearner.length === 0 ? (
                        <div className="card text-center py-8">
                            <p className="text-gray-600">No learning exchanges yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dashboardData.exchangesAsLearner.map(exchange => (
                                <div key={exchange.id} className="card">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">{exchange.skill.title}</h3>
                                            <p className="text-gray-600 mb-2">Teacher: {exchange.teacher.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Duration: {exchange.duration}h | Credits: {exchange.credits}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`badge ${getStatusBadgeClass(exchange.status)}`}>
                                                {exchange.status}
                                            </span>
                                            {exchange.status === 'ACCEPTED' && (
                                                <button
                                                    onClick={() => handleExchangeAction(exchange.id, 'COMPLETED')}
                                                    className="btn btn-primary"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Exchanges as Teacher */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">My Teaching Exchanges</h2>
                    {dashboardData.exchangesAsTeacher.length === 0 ? (
                        <div className="card text-center py-8">
                            <p className="text-gray-600">No teaching exchanges yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dashboardData.exchangesAsTeacher.map(exchange => (
                                <div key={exchange.id} className="card">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">{exchange.skill.title}</h3>
                                            <p className="text-gray-600 mb-2">Learner: {exchange.learner.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Duration: {exchange.duration}h | Credits: {exchange.credits}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`badge ${getStatusBadgeClass(exchange.status)}`}>
                                                {exchange.status}
                                            </span>
                                            {exchange.status === 'ACCEPTED' && (
                                                <button
                                                    onClick={() => handleExchangeAction(exchange.id, 'COMPLETED')}
                                                    className="btn btn-primary"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
