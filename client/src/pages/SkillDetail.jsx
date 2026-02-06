import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { skillService } from '../services/skillService';
import { exchangeService } from '../services/exchangeService';
import { useAuth } from '../context/AuthContext';

const SkillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [duration, setDuration] = useState('');

    useEffect(() => {
        fetchSkill();
    }, [id]);

    const fetchSkill = async () => {
        try {
            const data = await skillService.getSkillById(id);
            setSkill(data);
            setDuration(data.duration.toString());
        } catch (err) {
            setError('Failed to load skill details.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestExchange = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!duration || parseInt(duration) < 1) {
            setError('Please enter a valid duration');
            return;
        }

        setRequestLoading(true);
        setError('');

        try {
            await exchangeService.createExchange({
                skillId: skill.id,
                duration: parseInt(duration),
            });
            alert('Exchange request sent successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create exchange request.');
        } finally {
            setRequestLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Skill not found</div>
            </div>
        );
    }

    const isOwner = user?.id === skill.owner.id;
    const canRequest = isAuthenticated && !isOwner;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <button onClick={() => navigate(-1)} className="btn btn-secondary mb-6">
                    ← Back
                </button>

                <div className="card">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{skill.title}</h1>
                            <p className="text-gray-600">{skill.category}</p>
                        </div>
                        <span className={`badge badge-${skill.level.toLowerCase()}`}>
                            {skill.level}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Teacher</h3>
                            <p className="text-gray-900">{skill.owner.name}</p>
                            <p className="text-sm text-gray-600">{skill.owner.email}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Details</h3>
                            <p className="text-gray-900">Duration: {skill.duration} hours</p>
                            <p className="text-2xl font-bold text-primary-600">{skill.credits} credits</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-900 whitespace-pre-line">{skill.description}</p>
                    </div>

                    {skill.averageRating > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Rating</h3>
                            <p className="text-lg">
                                ⭐ {skill.averageRating.toFixed(1)} ({skill.reviewCount} reviews)
                            </p>
                        </div>
                    )}

                    {/* Reviews */}
                    {skill.reviews && skill.reviews.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Reviews</h3>
                            <div className="space-y-4">
                                {skill.reviews.map(review => (
                                    <div key={review.id} className="border-l-4 border-primary-500 pl-4 py-2">
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                            <span className="text-gray-600 text-sm ml-2">
                                                by {review.exchange.learner.name}
                                            </span>
                                        </div>
                                        {review.comment && <p className="text-gray-700">{review.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Request Exchange */}
                    {canRequest && (
                        <div className="border-t pt-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Request Exchange</h3>
                            <div className="flex items-end space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (hours)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="input"
                                        placeholder="Enter hours"
                                    />
                                </div>
                                <button
                                    onClick={handleRequestExchange}
                                    disabled={requestLoading}
                                    className="btn btn-primary"
                                >
                                    {requestLoading ? 'Sending...' : 'Request Exchange'}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Your current balance: {user.creditBalance} credits
                            </p>
                        </div>
                    )}

                    {isOwner && (
                        <div className="border-t pt-6">
                            <p className="text-gray-600 mb-4">This is your skill</p>
                            <button
                                onClick={() => navigate(`/skills/edit/${skill.id}`)}
                                className="btn btn-primary"
                            >
                                Edit Skill
                            </button>
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="border-t pt-6">
                            <p className="text-gray-600 mb-4">Please login to request this skill exchange</p>
                            <button onClick={() => navigate('/login')} className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillDetail;
