import { Link } from 'react-router-dom';

const SkillCard = ({ skill, showActions = false, onDelete }) => {
    const levelBadgeClass = {
        BEGINNER: 'badge-beginner',
        INTERMEDIATE: 'badge-intermediate',
        ADVANCED: 'badge-advanced',
        EXPERT: 'badge-expert',
    };

    return (
        <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{skill.title}</h3>
                <span className={`badge ${levelBadgeClass[skill.level]}`}>
                    {skill.level}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{skill.category}</p>
            <p className="text-gray-700 mb-4 line-clamp-3">{skill.description}</p>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {skill.duration}h
                </div>
                <div className="text-lg font-bold text-primary-600">
                    {skill.credits} credits
                </div>
            </div>

            {skill.averageRating !== undefined && (
                <div className="text-sm text-gray-600 mb-4">
                    ⭐ {skill.averageRating > 0 ? skill.averageRating.toFixed(1) : 'No reviews'}
                    {skill.reviewCount > 0 && ` (${skill.reviewCount} reviews)`}
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-600">
                    by {skill.owner?.name || 'Unknown'}
                </span>
                <div className="flex space-x-2">
                    {showActions ? (
                        <>
                            <Link to={`/skills/edit/${skill.id}`} className="btn btn-secondary text-sm">
                                Edit
                            </Link>
                            <button onClick={() => onDelete(skill.id)} className="btn btn-danger text-sm">
                                Delete
                            </button>
                        </>
                    ) : (
                        <Link to={`/skills/${skill.id}`} className="btn btn-primary text-sm">
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
