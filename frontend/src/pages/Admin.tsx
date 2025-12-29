import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, FolderTree, ShoppingBag, MessageSquare, Plus, Pencil, Trash2, X, Check, Star, Reply, Upload } from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';
import { Product, Category, Order, Review, OrderStatus } from '@/types';
import { formatPrice } from '@/utils/helpers';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        cloudinary: any;
    }
}

export const Admin = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [replyingReview, setReplyingReview] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const [productForm, setProductForm] = useState({
        nameTr: '', descriptionTr: '',
        price: '', stock: '', categoryId: '', featured: false, shopierLink: '',
    });

    const [categoryForm, setCategoryForm] = useState({
        nameTr: '', descriptionTr: '',
    });

    useEffect(() => { loadData(); }, []);

    const openCloudinaryWidget = () => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'dhhodtwg3',
                uploadPreset: 'parla_seramik',
                sources: ['local', 'camera'],
                multiple: true,
                maxFiles: 10,
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
                maxFileSize: 10000000,
                folder: 'parla-seramik/products',
                language: 'tr',
                text: {
                    'tr': {
                        'or': 'veya',
                        'menu': { 'files': 'Dosyalarım', 'camera': 'Kamera' },
                        'local': { 'browse': 'Dosya Seç', 'dd_title_single': 'Resmi buraya sürükleyin', 'dd_title_multi': 'Resimleri buraya sürükleyin' }
                    }
                }
            },
            (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    setUploadedImages(prev => [...prev, result.info.secure_url]);
                }
            }
        );
        widget.open();
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData, ordersData, reviewsData] = await Promise.all([
                productService.getAllIncludingInactive(0, 100).catch(() => ({ content: [] })),
                categoryService.getAllIncludingInactive().catch(() => []),
                orderService.getAll().catch(() => ({ content: [] })),
                reviewService.getAll().catch(() => ({ content: [] })),
            ]);
            // Sadece aktif ürünleri göster
            const activeProducts = (productsData.content || []).filter((p: any) => p.active !== false);
            // Sadece aktif kategorileri göster
            const activeCategories = (categoriesData || []).filter((c: any) => c.active !== false);
            setProducts(activeProducts);
            setCategories(activeCategories);
            setOrders(ordersData.content || ordersData || []);
            setReviews(reviewsData.content || reviewsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleOrderStatusChange = async (orderId: number, status: OrderStatus) => {
        try {
            await orderService.updateStatus(orderId, status);
            toast.success('Sipariş durumu güncellendi');
            loadData();
        } catch { toast.error('Bir hata oluştu'); }
    };

    const handleApproveReview = async (reviewId: number) => {
        try {
            await reviewService.approve(reviewId);
            toast.success('Yorum onaylandı');
            loadData();
        } catch { toast.error('Bir hata oluştu'); }
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
            try {
                await reviewService.delete(reviewId);
                toast.success('Yorum silindi');
                loadData();
            } catch { toast.error('Bir hata oluştu'); }
        }
    };

    const handleReplyReview = async () => {
        if (!replyingReview || !replyText.trim()) return;
        try {
            await reviewService.reply(replyingReview.id, { adminReply: replyText });
            toast.success('Cevap gönderildi');
            setShowReplyModal(false);
            setReplyingReview(null);
            setReplyText('');
            loadData();
        } catch { toast.error('Bir hata oluştu'); }
    };

    const openReplyModal = (review: Review) => {
        setReplyingReview(review);
        setReplyText(review.adminReply || '');
        setShowReplyModal(true);
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

    const getStatusLabel = (status: OrderStatus) => {
        const labels: Record<OrderStatus, string> = {
            PENDING: 'Beklemede', CONFIRMED: 'Onaylandı', PROCESSING: 'Hazırlanıyor',
            SHIPPED: 'Kargoda', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal Edildi',
        };
        return labels[status] || status;
    };

    const resetProductForm = () => {
        setProductForm({ nameTr: '', descriptionTr: '', price: '', stock: '', categoryId: '', featured: false, shopierLink: '' });
        setUploadedImages([]);
        setEditingProduct(null);
    };

    const resetCategoryForm = () => {
        setCategoryForm({ nameTr: '', descriptionTr: '' });
        setEditingCategory(null);
    };

    const openProductModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                nameTr: product.nameTr,
                descriptionTr: product.descriptionTr || '',
                price: product.price.toString(), stock: product.stock.toString(),
                categoryId: product.categoryId?.toString() || '',
                featured: product.featured, shopierLink: product.shopierLink || '',
            });
            setUploadedImages(product.images || []);
        } else { resetProductForm(); }
        setShowProductModal(true);
    };

    const openCategoryModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                nameTr: category.nameTr,
                descriptionTr: category.descriptionTr || '',
            });
        } else { resetCategoryForm(); }
        setShowCategoryModal(true);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (uploadedImages.length === 0) {
            toast.error('En az bir resim eklemelisiniz');
            return;
        }
        try {
            const data = {
                nameTr: productForm.nameTr, nameEn: productForm.nameTr,
                descriptionTr: productForm.descriptionTr, descriptionEn: productForm.descriptionTr,
                price: parseFloat(productForm.price), stock: parseInt(productForm.stock),
                categoryId: parseInt(productForm.categoryId),
                images: uploadedImages,
                featured: productForm.featured,
                shopierLink: productForm.shopierLink || undefined,
            };
            if (editingProduct) {
                await productService.update(editingProduct.id, data);
                toast.success('Ürün güncellendi');
            } else {
                await productService.create(data);
                toast.success('Ürün eklendi');
            }
            setShowProductModal(false);
            resetProductForm();
            loadData();
        } catch { toast.error('Bir hata oluştu'); }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                nameTr: categoryForm.nameTr, nameEn: categoryForm.nameTr,
                descriptionTr: categoryForm.descriptionTr, descriptionEn: categoryForm.descriptionTr,
            };
            if (editingCategory) {
                await categoryService.update(editingCategory.id, data);
                toast.success('Kategori güncellendi');
            } else {
                await categoryService.create(data);
                toast.success('Kategori eklendi');
            }
            setShowCategoryModal(false);
            resetCategoryForm();
            loadData();
        } catch { toast.error('Bir hata oluştu'); }
    };

    const handleDeleteProduct = async (id: number) => {
        if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            try { await productService.delete(id); toast.success('Ürün silindi'); loadData(); }
            catch { toast.error('Bir hata oluştu'); }
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            try { await categoryService.delete(id); toast.success('Kategori silindi'); loadData(); }
            catch { toast.error('Bir hata oluştu'); }
        }
    };

    const tabs = [
        { id: 'products', label: t('admin.products'), icon: Package },
        { id: 'categories', label: t('admin.categories'), icon: FolderTree },
        { id: 'orders', label: t('admin.orders'), icon: ShoppingBag },
        { id: 'reviews', label: t('admin.reviews'), icon: MessageSquare },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('admin.dashboard')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                                    <Icon className="w-5 h-5" />{tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Products Tab */}
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">{t('admin.products')}</h2>
                                    <button onClick={() => openProductModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                                        <Plus className="w-5 h-5" />{t('admin.addProduct')}
                                    </button>
                                </div>
                                {loading ? <p>{t('common.loading')}</p> : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-3 px-2">Resim</th>
                                                    <th className="text-left py-3 px-2">{t('common.name')}</th>
                                                    <th className="text-left py-3 px-2">{t('common.price')}</th>
                                                    <th className="text-left py-3 px-2">{t('common.stock')}</th>
                                                    <th className="text-left py-3 px-2">{t('common.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                                        <td className="py-3 px-2">
                                                            <img src={product.images?.[0] || '/placeholder.png'} alt={product.nameTr} className="w-12 h-12 object-cover rounded" />
                                                        </td>
                                                        <td className="py-3 px-2">{product.nameTr}</td>
                                                        <td className="py-3 px-2">{formatPrice(product.price)}</td>
                                                        <td className="py-3 px-2">{product.stock}</td>
                                                        <td className="py-3 px-2">
                                                            <div className="flex gap-2">
                                                                <button onClick={() => openProductModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Categories Tab */}
                        {activeTab === 'categories' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">{t('admin.categories')}</h2>
                                    <button onClick={() => openCategoryModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                                        <Plus className="w-5 h-5" />{t('admin.addCategory')}
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead><tr className="border-b"><th className="text-left py-3 px-2">İsim (TR)</th><th className="text-left py-3 px-2">İsim (EN)</th><th className="text-left py-3 px-2">{t('common.actions')}</th></tr></thead>
                                        <tbody>
                                            {categories.map((category) => (
                                                <tr key={category.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-2">{category.nameTr}</td>
                                                    <td className="py-3 px-2">{category.nameEn}</td>
                                                    <td className="py-3 px-2">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => openCategoryModal(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">{t('admin.orders')}</h2>
                                {loading ? <p>{t('common.loading')}</p> : orders.length === 0 ? (
                                    <p className="text-gray-500">Henüz sipariş bulunmuyor.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4">
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                                    <div>
                                                        <p className="font-bold text-lg">{order.orderNumber}</p>
                                                        <p className="text-sm text-gray-500">{order.userEmail}</p>
                                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg text-primary">{formatPrice(order.totalAmount)}</p>
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                                                    </div>
                                                </div>
                                                <div className="border-t pt-3 mb-3">
                                                    <p className="text-sm font-medium mb-2">Ürünler:</p>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {order.orderItems.map((item) => (
                                                            <li key={item.id}>{item.productName} x {item.quantity} = {formatPrice(item.subtotal)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {order.shippingAddress && (
                                                    <div className="border-t pt-3 mb-3">
                                                        <p className="text-sm font-medium mb-1">Teslimat Adresi:</p>
                                                        <p className="text-sm text-gray-600">{order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.state}/{order.shippingAddress.city}</p>
                                                    </div>
                                                )}
                                                <div className="border-t pt-3 flex items-center gap-3">
                                                    <label className="text-sm font-medium">Durum Güncelle:</label>
                                                    <select value={order.status} onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)} className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-primary">
                                                        <option value="PENDING">Beklemede</option>
                                                        <option value="CONFIRMED">Onaylandı</option>
                                                        <option value="PROCESSING">Hazırlanıyor</option>
                                                        <option value="SHIPPED">Kargoda</option>
                                                        <option value="DELIVERED">Teslim Edildi</option>
                                                        <option value="CANCELLED">İptal Edildi</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">{t('admin.reviews')}</h2>
                                {loading ? <p>{t('common.loading')}</p> : reviews.length === 0 ? (
                                    <p className="text-gray-500">Henüz yorum bulunmuyor.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className={`border rounded-lg p-4 ${!review.approved ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">{review.userName}</p>
                                                        {review.productName && <p className="text-sm text-gray-500">Ürün: {review.productName}</p>}
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {!review.approved ? (
                                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">Onay Bekliyor</span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">Onaylı</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 mb-3">{review.comment}</p>
                                                {review.adminReply && (
                                                    <div className="ml-4 p-3 bg-primary/5 border-l-4 border-primary rounded-r-lg mb-3">
                                                        <p className="text-sm font-semibold text-primary mb-1">Cevabınız:</p>
                                                        <p className="text-sm text-gray-700">{review.adminReply}</p>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openReplyModal(review)} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                                                            <Reply className="w-4 h-4" />{review.adminReply ? 'Düzenle' : 'Cevapla'}
                                                        </button>
                                                        {!review.approved && (
                                                            <button onClick={() => handleApproveReview(review.id)} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
                                                                <Check className="w-4 h-4" />Onayla
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteReview(review.id)} className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                                                            <Trash2 className="w-4 h-4" />Sil
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">{editingProduct ? t('admin.editProduct') : t('admin.addProduct')}</h3>
                            <button onClick={() => setShowProductModal(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ürün Adı</label>
                                <input type="text" value={productForm.nameTr} onChange={(e) => setProductForm({ ...productForm, nameTr: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Açıklama</label>
                                <textarea value={productForm.descriptionTr} onChange={(e) => setProductForm({ ...productForm, descriptionTr: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" rows={3} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('common.price')} (₺)</label>
                                    <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('common.stock')}</label>
                                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('common.category')}</label>
                                    <select value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required>
                                        <option value="">Seçiniz</option>
                                        {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nameTr}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ürün Resimleri</label>
                                <button
                                    type="button"
                                    onClick={openCloudinaryWidget}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition"
                                >
                                    <Upload className="w-5 h-5" />
                                    Resim Yükle (Birden fazla seçebilirsiniz)
                                </button>
                                {uploadedImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-4 gap-2">
                                        {uploadedImages.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img src={img} alt={`Ürün ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">{uploadedImages.length} resim yüklendi</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Shopier Ürün Linki</label>
                                <input type="url" value={productForm.shopierLink} onChange={(e) => setProductForm({ ...productForm, shopierLink: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="https://www.shopier.com/..." />
                                <p className="text-xs text-gray-500 mt-1">Kullanıcı "Satın Al" butonuna tıkladığında bu linke yönlendirilecek</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="featured" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="w-4 h-4" />
                                <label htmlFor="featured" className="text-sm">Öne Çıkan Ürün</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">{t('common.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">{editingCategory ? t('admin.editCategory') : t('admin.addCategory')}</h3>
                            <button onClick={() => setShowCategoryModal(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Kategori Adı</label><input type="text" value={categoryForm.nameTr} onChange={(e) => setCategoryForm({ ...categoryForm, nameTr: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required /></div>
                            <div><label className="block text-sm font-medium mb-1">Açıklama</label><textarea value={categoryForm.descriptionTr} onChange={(e) => setCategoryForm({ ...categoryForm, descriptionTr: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" rows={2} /></div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">{t('common.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && replyingReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Yoruma Cevap Ver</h3>
                            <button onClick={() => { setShowReplyModal(false); setReplyingReview(null); }}><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{replyingReview.userName}</p>
                                <p className="text-gray-600 mt-1">{replyingReview.comment}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cevabınız</label>
                                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary" rows={4} placeholder="Müşteriye cevabınızı yazın..." />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => { setShowReplyModal(false); setReplyingReview(null); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                                <button onClick={handleReplyReview} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Gönder</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
