import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getProductName } from '@/utils/helpers';

export const Cart = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold mb-8">{t('cart.title')}</h1>
                <p className="text-gray-600 mb-8">{t('cart.empty')}</p>
                <Link
                    to="/products"
                    className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                    {t('cart.continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('cart.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.product.id}
                            className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
                        >
                            <img
                                src={item.product.images?.[0] || '/placeholder.png'}
                                alt={getProductName(item.product, i18n.language)}
                                className="w-24 h-24 object-cover rounded"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">
                                    {getProductName(item.product, i18n.language)}
                                </h3>
                                <p className="text-primary font-bold">
                                    {formatPrice(item.product.price)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                                    disabled={item.quantity >= item.product.stock}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-lg mb-2">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                                <button
                                    onClick={() => removeItem(item.product.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                        <h2 className="text-2xl font-bold mb-4">{t('cart.total')}</h2>
                        <div className="border-t pt-4">
                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>{t('cart.total')}</span>
                                <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition mb-4"
                            >
                                {t('cart.checkout')}
                            </button>
                            <Link
                                to="/products"
                                className="block text-center text-primary hover:text-primary-dark"
                            >
                                {t('cart.continueShopping')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
