import api from './api';

export const adminService = {
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    deleteSkill: async (id) => {
        const response = await api.delete(`/admin/skills/${id}`);
        return response.data;
    },
};
