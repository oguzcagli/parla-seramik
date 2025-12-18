import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { Product } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatPrice, getProductName } from '@/utils/helpers';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { i18n } = useTranslation();

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
                {product.shopierLink && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Satışta
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
                    <span className="text-sm text-primary font-medium group-hover:underline">
                        Detaylar →
                    </span>
                </div>
            </div>
        </Link>
    );
};
