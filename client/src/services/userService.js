import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    getDashboard: async () => {
        const response = await api.get('/users/dashboard');
        return response.data;
    },
};
