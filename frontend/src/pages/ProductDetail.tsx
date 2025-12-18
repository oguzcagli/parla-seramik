import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Star, ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { productService } from '@/services/productService';
import { reviewService } from '@/services/reviewService';
import { Product, Review } from '@/types';
import { formatPrice, getProductName, getProductDescription } from '@/utils/helpers';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { isAuthenticated } = useAuthStore();

    // Review form
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (id) {
            loadProduct(parseInt(id));
            loadReviews(parseInt(id));
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

    const loadReviews = async (productId: number) => {
        try {
            const data = await reviewService.getByProduct(productId);
            setReviews(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    };

    const handleBuyNow = () => {
        if (product?.shopierLink) {
            window.open(product.shopierLink, '_blank');
        } else {
            toast.error(t('productDetail.noShopierLink'));
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error(t('productDetail.loginToReview'));
            navigate('/login');
            return;
        }
        if (!reviewForm.comment.trim()) {
            toast.error(t('productDetail.yourComment'));
            return;
        }
        setSubmittingReview(true);
        try {
            await reviewService.create({
                productId: parseInt(id!),
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });
            toast.success(t('common.success'));
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('common.error'));
        } finally {
            setSubmittingReview(false);
        }
    };

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
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img
                            src={product.images?.[selectedImage] || '/placeholder.png'}
                            alt={getProductName(product, i18n.language)}
                            className="w-full h-96 object-contain"
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
                        <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{product.averageRating.toFixed(1)}</span>
                            <span className="text-gray-500 ml-1">({product.reviewCount} {t('productDetail.reviews')})</span>
                        </div>
                        <span className="text-gray-300">|</span>
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

            {/* Reviews Section */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        {t('productDetail.customerReviews')} ({reviews.length})
                    </h2>
                    {isAuthenticated && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                        >
                            <Send className="w-4 h-4" />
                            {t('productDetail.writeReview')}
                        </button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold mb-4">{t('productDetail.writeReview')}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">{t('productDetail.yourRating')}</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className="p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= reviewForm.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">{t('productDetail.yourComment')}</label>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                rows={4}
                                placeholder={t('productDetail.commentPlaceholder')}
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                {t('productDetail.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                            >
                                {submittingReview ? t('productDetail.submitting') : t('productDetail.submit')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">{t('productDetail.noReviews')}</p>
                        {!isAuthenticated && (
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 text-primary hover:underline"
                            >
                                {t('productDetail.loginToReview')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white border rounded-lg p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold">{review.userName}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
                                    </span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>

                                {/* Admin Reply */}
                                {review.adminReply && (
                                    <div className="mt-4 ml-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                                        <p className="text-sm font-semibold text-primary mb-1">Parla Seramik</p>
                                        <p className="text-gray-700 text-sm">{review.adminReply}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
