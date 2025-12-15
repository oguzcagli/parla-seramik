import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Product, Category } from '@/types';

export const Products = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('DESC');

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [selectedCategory, sortBy, sortDir]);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            let data;
            if (selectedCategory) {
                data = await productService.getByCategory(selectedCategory, 0, 100);
            } else {
                data = await productService.getAll(0, 100, sortBy, sortDir);
            }
            const productList = data?.content || data || [];
            setProducts(Array.isArray(productList) ? productList : []);
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            setLoading(true);
            try {
                const data = await productService.search(searchTerm);
                const productList = data?.content || data || [];
                setProducts(Array.isArray(productList) ? productList : []);
            } catch (error) {
                console.error('Error searching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        } else {
            loadProducts();
        }
    };

    const getCategoryName = (category: Category) => {
        return i18n.language === 'tr' ? category.nameTr : category.nameEn;
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12">{t('products.title')}</h1>

            {/* Filters */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder={t('products.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    </div>

                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-w-[180px]"
                    >
                        <option value="">{t('products.allCategories')}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {getCategoryName(category)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={`${sortBy}-${sortDir}`}
                        onChange={(e) => {
                            const [newSortBy, newSortDir] = e.target.value.split('-');
                            setSortBy(newSortBy);
                            setSortDir(newSortDir);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="createdAt-DESC">{t('products.newest')}</option>
                        <option value="createdAt-ASC">{t('products.oldest')}</option>
                        <option value="price-ASC">{t('products.priceAsc')}</option>
                        <option value="price-DESC">{t('products.priceDesc')}</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    {t('products.noProducts')}
                </div>
            )}
        </div>
    );
};
