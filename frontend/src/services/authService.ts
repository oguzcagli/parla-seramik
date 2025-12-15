import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/users/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.put<User>('/users/profile', data);
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
        await api.put('/users/password', data);
    },
};
