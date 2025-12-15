import api from './api';
import { Order, OrderStatus, Address } from '@/types';

export interface CreateOrderRequest {
    items: { productId: number; quantity: number }[];
    shippingAddress: Address;
    notes?: string;
}

export const orderService = {
    // Admin endpoints
    getAll: async (page = 0, size = 20): Promise<{ content: Order[]; totalElements: number }> => {
        const response = await api.get('/admin/orders', { params: { page, size } });
        return response.data;
    },

    getById: async (id: number): Promise<Order> => {
        const response = await api.get<Order>(`/admin/orders/${id}`);
        return response.data;
    },

    updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
        const response = await api.patch<Order>(`/admin/orders/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    // User endpoints
    getMyOrders: async (status?: OrderStatus): Promise<Order[]> => {
        const params = status ? { status } : {};
        const response = await api.get<Order[]>('/orders/my', { params });
        return response.data;
    },

    getMyOrderById: async (id: number): Promise<Order> => {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },

    create: async (data: CreateOrderRequest): Promise<Order> => {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    cancel: async (id: number): Promise<Order> => {
        const response = await api.patch<Order>(`/orders/${id}/cancel`);
        return response.data;
    },
};
