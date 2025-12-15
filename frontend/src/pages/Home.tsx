import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Sparkles, Truck, HeadphonesIcon } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export const Home = () => {
    const { t } = useTranslation();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const products = await productService.getFeatured();
            setFeaturedProducts(products.slice(0, 3));
        } catch (error) {
            console.error('Error loading featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative h-[600px] flex items-center justify-center text-white"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('hero.title')}</h1>
                    <p className="text-xl md:text-2xl mb-4">{t('hero.subtitle')}</p>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">{t('hero.description')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition"
                        >
                            {t('hero.contactBtn')}
                        </Link>
                        <Link
                            to="/products"
                            className="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-lg font-semibold transition"
                        >
                            {t('hero.productsBtn')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">{t('home.newProducts')}</h2>
                {loading ? (
                    <div className="text-center">{t('common.loading')}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                <div className="text-center mt-8">
                    <Link
                        to="/products"
                        className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition"
                    >
                        {t('products.viewDetails')}
                    </Link>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">{t('home.whyUs')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.quality')}</h3>
                            <p className="text-gray-600">{t('home.qualityDesc')}</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.handmade')}</h3>
                            <p className="text-gray-600">{t('home.handmadeDesc')}</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.fastShipping')}</h3>
                            <p className="text-gray-600">{t('home.fastShippingDesc')}</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeadphonesIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.support')}</h3>
                            <p className="text-gray-600">{t('home.supportDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
