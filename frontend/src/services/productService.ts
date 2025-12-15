import api from './api';
import { Product } from '@/types';

export const productService = {
    getAll: async (page = 0, size = 12, sortBy = 'createdAt', sortDir = 'DESC') => {
        const response = await api.get('/products', {
            params: { page, size, sortBy, sortDir },
        });
        return response.data;
    },

    getAllIncludingInactive: async (page = 0, size = 100, sortBy = 'createdAt', sortDir = 'DESC') => {
        const response = await api.get('/products/all', {
            params: { page, size, sortBy, sortDir },
        });
        return response.data;
    },

    getFeatured: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products/featured');
        return response.data;
    },

    getById: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    getByCategory: async (categoryId: number, page = 0, size = 12) => {
        const response = await api.get(`/products/category/${categoryId}`, {
            params: { page, size },
        });
        return response.data;
    },

    search: async (keyword: string, page = 0, size = 12) => {
        const response = await api.get('/products/search', {
            params: { keyword, page, size },
        });
        return response.data;
    },

    create: async (data: Partial<Product>): Promise<Product> => {
        const response = await api.post<Product>('/admin/products', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Product>): Promise<Product> => {
        const response = await api.put<Product>(`/admin/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/products/${id}`);
    },
};
