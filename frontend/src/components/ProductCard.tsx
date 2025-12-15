import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatPrice, getProductName } from '@/utils/helpers';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { t, i18n } = useTranslation();
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.stock > 0) {
            addItem(product);
            toast.success(t('products.addToCart'));
        }
    };

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative h-64 overflow-hidden bg-gray-200">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={getProductName(product, i18n.language)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                {product.featured && (
                    <span className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm">
                        Featured
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {getProductName(product, i18n.language)}
                </h3>

                <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                        {product.averageRating.toFixed(1)} ({product.reviewCount})
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`p-2 rounded-full transition ${product.stock > 0
                                ? 'bg-primary text-white hover:bg-primary-dark'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>

                {product.stock === 0 && (
                    <p className="text-red-500 text-sm mt-2">{t('products.outOfStock')}</p>
                )}
            </div>
        </Link>
    );
};
