import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ArrowLeft, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { formatPrice, getProductName, getProductDescription } from '@/utils/helpers';
import toast from 'react-hot-toast';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    // Lightbox
    const [showLightbox, setShowLightbox] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        if (id) {
            loadProduct(parseInt(id));
        }
    }, [id]);

    const loadProduct = async (productId: number) => {
        try {
            const data = await productService.getById(productId);
            setProduct(data);
        } catch (error) {
            console.error('Error loading product:', error);
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = () => {
        if (product?.shopierLink) {
            window.open(product.shopierLink, '_blank');
        } else {
            toast.error(t('productDetail.noShopierLink'));
        }
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setZoomLevel(1);
        setShowLightbox(true);
    };

    const closeLightbox = () => {
        setShowLightbox(false);
        setZoomLevel(1);
    };

    const nextImage = () => {
        if (product?.images) {
            setLightboxIndex((prev) => (prev + 1) % product.images!.length);
            setZoomLevel(1);
        }
    };

    const prevImage = () => {
        if (product?.images) {
            setLightboxIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
            setZoomLevel(1);
        }
    };

    const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p>{t('productDetail.productNotFound')}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8"
            >
                <ArrowLeft className="w-5 h-5" />
                {t('productDetail.goBack')}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images */}
                <div>
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer" onClick={() => openLightbox(selectedImage)}>
                        <img
                            src={product.images?.[selectedImage] || '/placeholder.png'}
                            alt={getProductName(product, i18n.language)}
                            className="w-full h-96 object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">
                        {getProductName(product, i18n.language)}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock > 0 ? `${product.stock} ${t('productDetail.inStock')}` : t('productDetail.outOfStock')}
                        </span>
                    </div>

                    <p className="text-4xl font-bold text-primary mb-6">
                        {formatPrice(product.price)}
                    </p>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {getProductDescription(product, i18n.language)}
                    </p>

                    <button
                        onClick={handleBuyNow}
                        disabled={!product.shopierLink}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-lg transition ${product.shopierLink
                            ? 'bg-primary hover:bg-primary-dark text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ExternalLink className="w-6 h-6" />
                        {product.shopierLink ? t('productDetail.buyNow') : t('productDetail.comingSoon')}
                    </button>
                    {product.shopierLink && (
                        <p className="text-center text-sm text-gray-500 mt-2">
                            {t('productDetail.securePayment')}
                        </p>
                    )}

                    <div className="mt-8 pt-8 border-t">
                        <p className="text-gray-600">
                            <span className="font-medium">{t('productDetail.category')}:</span>{' '}
                            {i18n.language === 'tr' ? product.categoryNameTr : product.categoryNameEn}
                        </p>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {showLightbox && product?.images && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeLightbox}>
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                        <button
                            onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
                        >
                            <ZoomOut className="w-6 h-6" />
                        </button>
                        <span className="bg-white/20 text-white px-4 py-2 rounded-lg">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
                        >
                            <ZoomIn className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <div className="max-w-[90vw] max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={product.images[lightboxIndex]}
                            alt={getProductName(product, i18n.language)}
                            className="transition-transform duration-300"
                            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                        />
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-lg">
                        {lightboxIndex + 1} / {product.images.length}
                    </div>
                </div>
            )}
        </div>
    );
};
