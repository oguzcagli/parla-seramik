import api from './api';
import { Category } from '@/types';

export const categoryService = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    getAllIncludingInactive: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories/all');
        return response.data;
    },

    getById: async (id: number): Promise<Category> => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    create: async (data: Partial<Category>): Promise<Category> => {
        const response = await api.post<Category>('/admin/categories', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Category>): Promise<Category> => {
        const response = await api.put<Category>(`/admin/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/categories/${id}`);
    },
};
