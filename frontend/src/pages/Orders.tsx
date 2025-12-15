import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const Orders = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [isAuthenticated, navigate]);

    const loadOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Siparişler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        if (!window.confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) return;
        try {
            await orderService.cancel(orderId);
            toast.success('Sipariş iptal edildi');
            loadOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Sipariş iptal edilemedi');
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'CONFIRMED': return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'PROCESSING': return <Package className="w-5 h-5 text-purple-500" />;
            case 'SHIPPED': return <Truck className="w-5 h-5 text-indigo-500" />;
            case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        const labels: Record<OrderStatus, string> = {
            PENDING: 'Beklemede',
            CONFIRMED: 'Onaylandı',
            PROCESSING: 'Hazırlanıyor',
            SHIPPED: 'Kargoda',
            DELIVERED: 'Teslim Edildi',
            CANCELLED: 'İptal Edildi',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: OrderStatus) => {
        const colors: Record<OrderStatus, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            PROCESSING: 'bg-purple-100 text-purple-800',
            SHIPPED: 'bg-indigo-100 text-indigo-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'active') return ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(order.status);
        if (filter === 'completed') return order.status === 'DELIVERED';
        if (filter === 'cancelled') return order.status === 'CANCELLED';
        return true;
    });

    const filters = [
        { id: 'all', label: 'Tümü' },
        { id: 'active', label: 'Aktif' },
        { id: 'completed', label: 'Tamamlanan' },
        { id: 'cancelled', label: 'İptal Edilen' },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('profile.myOrders')}</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as typeof filter)}
                        className={`px-4 py-2 rounded-lg transition ${filter === f.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Henüz sipariş bulunmuyor</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {getStatusIcon(order.status)}
                                        <span className="font-bold text-lg">{order.orderNumber}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl text-primary">{formatPrice(order.totalAmount)}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="border-t pt-4 mb-4">
                                <div className="flex flex-wrap gap-4">
                                    {order.orderItems.slice(0, 3).map(item => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            {item.productImage && (
                                                <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">{item.productName}</p>
                                                <p className="text-xs text-gray-500">{item.quantity} adet</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <span className="text-sm text-gray-500 self-center">
                                            +{order.orderItems.length - 3} ürün daha
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 border-t pt-4">
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    <Eye className="w-4 h-4" />
                                    Detayları Gör
                                </button>
                                {order.trackingNumber && (
                                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                                        Kargo Takip: {order.trackingNumber}
                                    </span>
                                )}
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        İptal Et
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Sipariş Detayı</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Sipariş No</p>
                                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tarih</p>
                                    <p className="font-medium">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Durum</p>
                                    <span className={`inline-block px-2 py-1 rounded text-sm ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Toplam</p>
                                    <p className="font-bold text-primary">{formatPrice(selectedOrder.totalAmount)}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="font-semibold mb-3">Ürünler</h4>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {item.productImage && (
                                                    <img src={item.productImage} alt="" className="w-16 h-16 object-cover rounded" />
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatPrice(item.price)} x {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.shippingAddress && (
                                <div>
                                    <h4 className="font-semibold mb-3">Teslimat Adresi</h4>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedOrder.shippingAddress.addressLine1}
                                            {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {selectedOrder.shippingAddress.state}/{selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Tracking */}
                            {selectedOrder.trackingNumber && (
                                <div>
                                    <h4 className="font-semibold mb-3">Kargo Bilgisi</h4>
                                    <p className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                                        Takip No: {selectedOrder.trackingNumber}
                                    </p>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <h4 className="font-semibold mb-3">Notlar</h4>
                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-600">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
