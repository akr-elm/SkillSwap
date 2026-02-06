import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { skillService } from '../services/skillService';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersData, skillsData] = await Promise.all([
                adminService.getAllUsers(),
                skillService.getAllSkills({ limit: 100 }),
            ]);
            setUsers(usersData.users);
            setSkills(skillsData.skills);
        } catch (err) {
            setError('Failed to load admin data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This will also delete all their skills and exchanges.')) {
            return;
        }

        try {
            await adminService.deleteUser(userId);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete user.');
        }
    };

    const handleDeleteSkill = async (skillId) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;

        try {
            await adminService.deleteSkill(skillId);
            fetchData();
        } catch (err) {
            alert('Failed to delete skill.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-4 px-2 font-medium ${activeTab === 'users'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Users ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('skills')}
                            className={`pb-4 px-2 font-medium ${activeTab === 'skills'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Skills ({skills.length})
                        </button>
                    </div>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="card overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Name</th>
                                    <th className="text-left py-3 px-4">Email</th>
                                    <th className="text-left py-3 px-4">Role</th>
                                    <th className="text-left py-3 px-4">Credits</th>
                                    <th className="text-left py-3 px-4">Skills</th>
                                    <th className="text-left py-3 px-4">Joined</th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{user.name}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`badge ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{user.creditBalance}</td>
                                        <td className="py-3 px-4">{user._count.skills}</td>
                                        <td className="py-3 px-4">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="btn btn-danger text-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                    <div className="card overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Title</th>
                                    <th className="text-left py-3 px-4">Category</th>
                                    <th className="text-left py-3 px-4">Level</th>
                                    <th className="text-left py-3 px-4">Owner</th>
                                    <th className="text-left py-3 px-4">Credits</th>
                                    <th className="text-left py-3 px-4">Created</th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map(skill => (
                                    <tr key={skill.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{skill.title}</td>
                                        <td className="py-3 px-4">{skill.category}</td>
                                        <td className="py-3 px-4">
                                            <span className={`badge badge-${skill.level.toLowerCase()}`}>
                                                {skill.level}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{skill.owner?.name}</td>
                                        <td className="py-3 px-4">{skill.credits}</td>
                                        <td className="py-3 px-4">
                                            {new Date(skill.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleDeleteSkill(skill.id)}
                                                className="btn btn-danger text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
