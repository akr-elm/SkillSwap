import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skillService } from '../services/skillService';

const SkillForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        level: 'BEGINNER',
        description: '',
        duration: '',
        credits: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Programming', 'Music', 'Languages', 'Cooking', 'Photography', 'Wellness', 'Other'];
    const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

    useEffect(() => {
        if (isEditMode) {
            fetchSkill();
        }
    }, [id]);

    const fetchSkill = async () => {
        try {
            const skill = await skillService.getSkillById(id);
            setFormData({
                title: skill.title,
                category: skill.category,
                level: skill.level,
                description: skill.description,
                duration: skill.duration.toString(),
                credits: skill.credits.toString(),
            });
        } catch (err) {
            setError('Failed to load skill details.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                duration: parseInt(formData.duration),
                credits: parseInt(formData.credits),
            };

            if (isEditMode) {
                await skillService.updateSkill(id, submitData);
            } else {
                await skillService.createSkill(submitData);
            }

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save skill.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {isEditMode ? 'Edit Skill' : 'Create New Skill'}
                </h1>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Skill Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="e.g., Web Development with React"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                                    Skill Level *
                                </label>
                                <select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="input"
                                placeholder="Describe what you'll teach, what students will learn, prerequisites, etc."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (hours) *
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="input"
                                    placeholder="e.g., 10"
                                />
                            </div>

                            <div>
                                <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                                    Credits Required *
                                </label>
                                <input
                                    type="number"
                                    id="credits"
                                    name="credits"
                                    value={formData.credits}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="input"
                                    placeholder="e.g., 5"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                                {loading ? 'Saving...' : isEditMode ? 'Update Skill' : 'Create Skill'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SkillForm;
