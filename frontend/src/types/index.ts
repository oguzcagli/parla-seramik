export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'USER' | 'ADMIN';
    enabled: boolean;
}

export interface Product {
    id: number;
    nameTr: string;
    nameEn: string;
    descriptionTr: string;
    descriptionEn: string;
    price: number;
    stock: number;
    images: string[];
    categoryId: number;
    categoryNameTr: string;
    categoryNameEn: string;
    active: boolean;
    featured: boolean;
    averageRating: number;
    reviewCount: number;
    shopierLink?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    nameTr: string;
    nameEn: string;
    descriptionTr: string;
    descriptionEn: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    userEmail: string;
    orderItems: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress?: Address;
    paymentId?: string;
    trackingNumber?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Address {
    id?: number;
    title: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface Review {
    id: number;
    productId: number;
    productName?: string;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    adminReply?: string;
    approved: boolean;
    createdAt: string;
    updatedAt?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface AuthResponse {
    token: string;
    refreshToken: string;
    type: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}
