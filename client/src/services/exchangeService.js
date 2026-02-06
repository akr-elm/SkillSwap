import api from './api';

export const exchangeService = {
    createExchange: async (exchangeData) => {
        const response = await api.post('/exchanges', exchangeData);
        return response.data;
    },

    getUserExchanges: async () => {
        const response = await api.get('/exchanges');
        return response.data;
    },

    updateExchangeStatus: async (id, status) => {
        const response = await api.patch(`/exchanges/${id}/status`, { status });
        return response.data;
    },
};
