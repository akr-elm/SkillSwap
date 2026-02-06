import { useState, useEffect } from 'react';
import { skillService } from '../services/skillService';
import SkillCard from '../components/SkillCard';
import Pagination from '../components/Pagination';

const Marketplace = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 9,
        total: 0,
        totalPages: 0,
    });

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: '',
        sortBy: 'createdAt',
        order: 'desc',
    });

    const categories = ['Programming', 'Music', 'Languages', 'Cooking', 'Photography', 'Wellness', 'Other'];
    const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

    useEffect(() => {
        fetchSkills();
    }, [pagination.page, filters]);

    const fetchSkills = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...filters,
            };

            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '') delete params[key];
            });

            const data = await skillService.getAllSkills(params);
            setSkills(data.skills);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (err) {
            setError('Failed to load skills. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Skill Marketplace</h1>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="grid md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search skills..."
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <select
                                name="level"
                                value={filters.level}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="">All Levels</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="createdAt">Newest</option>
                                <option value="credits">Credits</option>
                                <option value="title">Title</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <select
                                name="order"
                                value={filters.order}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-xl">Loading skills...</div>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No skills found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {skills.map(skill => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
