import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, getProductName } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const Checkout = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: '',
    });

    if (items.length === 0 && !orderComplete) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate order number
        const newOrderNumber = 'PS-' + Date.now().toString().slice(-8);
        setOrderNumber(newOrderNumber);
        setOrderComplete(true);
        clearCart();
        setLoading(false);
        toast.success('Siparişiniz alındı!');
    };

    if (orderComplete) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-lg mx-auto text-center">
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Siparişiniz Alındı!</h1>
                    <p className="text-gray-600 mb-2">Sipariş numaranız:</p>
                    <p className="text-2xl font-bold text-primary mb-6">{orderNumber}</p>
                    <p className="text-gray-600 mb-8">
                        Siparişiniz en kısa sürede hazırlanıp kargoya verilecektir.
                        Sipariş durumunuz hakkında e-posta ile bilgilendirileceksiniz.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Sipariş Tamamla</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-6">Teslimat Bilgileri</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">E-posta</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Adres</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Şehir</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Posta Kodu</label>
                                    <input
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Sipariş Notu (Opsiyonel)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    rows={2}
                                />
                            </div>

                            {/* Payment Info */}
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-bold mb-4">Ödeme Bilgileri</h3>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <p className="text-yellow-800 text-sm">
                                        💳 Ödeme sistemi yakında aktif olacaktır. Şu an siparişler kapıda ödeme olarak alınmaktadır.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <input type="radio" id="cod" name="payment" defaultChecked />
                                    <label htmlFor="cod">Kapıda Ödeme</label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                        <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>

                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex gap-4">
                                    <img
                                        src={item.product.images?.[0] || '/placeholder.png'}
                                        alt={getProductName(item.product, i18n.language)}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{getProductName(item.product, i18n.language)}</h4>
                                        <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                                        <p className="text-primary font-semibold">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Ara Toplam</span>
                                <span>{formatPrice(getTotalPrice())}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Kargo</span>
                                <span className="text-green-600">Ücretsiz</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                <span>Toplam</span>
                                <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
