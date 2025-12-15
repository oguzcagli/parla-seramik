import api from './api';
import { Review } from '@/types';

export interface CreateReviewRequest {
    productId: number;
    rating: number;
    comment: string;
}

export interface AdminReplyRequest {
    adminReply: string;
}

export const reviewService = {
    // Public endpoints
    getByProduct: async (productId: number): Promise<Review[]> => {
        const response = await api.get<Review[]>(`/reviews/product/${productId}`);
        return response.data;
    },

    // User endpoints
    create: async (data: CreateReviewRequest): Promise<Review> => {
        const response = await api.post<Review>('/reviews', data);
        return response.data;
    },

    getMyReviews: async (): Promise<Review[]> => {
        const response = await api.get<Review[]>('/reviews/my');
        return response.data;
    },

    // Admin endpoints
    getAll: async (page = 0, size = 20): Promise<{ content: Review[]; totalElements: number }> => {
        const response = await api.get('/admin/reviews', { params: { page, size } });
        return response.data;
    },

    getPending: async (): Promise<Review[]> => {
        const response = await api.get<Review[]>('/admin/reviews/pending');
        return response.data;
    },

    approve: async (id: number): Promise<Review> => {
        const response = await api.patch<Review>(`/admin/reviews/${id}/approve`);
        return response.data;
    },

    reply: async (id: number, data: AdminReplyRequest): Promise<Review> => {
        const response = await api.patch<Review>(`/admin/reviews/${id}/reply`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/reviews/${id}`);
    },
};
