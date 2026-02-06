import api from './api';

export const skillService = {
    getAllSkills: async (params = {}) => {
        const response = await api.get('/skills', { params });
        return response.data;
    },

    getSkillById: async (id) => {
        const response = await api.get(`/skills/${id}`);
        return response.data;
    },

    createSkill: async (skillData) => {
        const response = await api.post('/skills', skillData);
        return response.data;
    },

    updateSkill: async (id, skillData) => {
        const response = await api.put(`/skills/${id}`, skillData);
        return response.data;
    },

    deleteSkill: async (id) => {
        const response = await api.delete(`/skills/${id}`);
        return response.data;
    },
};
