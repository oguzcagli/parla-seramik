import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Sparkles, Truck, HeadphonesIcon } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { Product } from '@/types';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    rotation: number;
    shape: 'circle' | 'square' | 'diamond';
}

export const Home = () => {
    const { t } = useTranslation();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [particles] = useState<Particle[]>(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            opacity: Math.random() * 0.15 + 0.05,
            rotation: Math.random() * 360,
            shape: (['circle', 'square', 'diamond'] as const)[Math.floor(Math.random() * 3)]
        }))
    );
    const heroRef = useRef<HTMLElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height
            });
        }
    }, []);

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const response = await productService.getAll(0, 100);
            setFeaturedProducts(response.content || []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative h-[650px] flex items-center justify-center overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #ebe4d8 100%)'
                }}
            >
                {/* Animated Particles - Ceramic shapes */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute pointer-events-none transition-transform duration-1000 ease-out"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size,
                            opacity: particle.opacity,
                            transform: `translate(${(mousePos.x - 0.5) * 30}px, ${(mousePos.y - 0.5) * 30}px) rotate(${particle.rotation + mousePos.x * 20}deg)`,
                            background: particle.shape === 'circle'
                                ? 'radial-gradient(circle, #b5a174 0%, transparent 70%)'
                                : '#b5a174',
                            borderRadius: particle.shape === 'circle' ? '50%' : particle.shape === 'diamond' ? '0' : '4px',
                            clipPath: particle.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
                        }}
                    />
                ))}

                {/* Decorative ceramic pattern overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b5a174' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative z-10 text-center px-4">
                    <img src="/logo.png" alt="Parla Seramik" className="h-32 md:h-40 mx-auto mb-6 drop-shadow-lg" />
                    <p className="text-xl md:text-2xl mb-4 text-gray-700">{t('hero.subtitle')}</p>
                    <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">{t('hero.description')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                        >
                            {t('hero.contactBtn')}
                        </Link>
                        <Link
                            to="/products"
                            className="bg-white hover:bg-gray-50 text-primary px-8 py-3 rounded-lg font-semibold transition border-2 border-primary shadow-lg hover:shadow-xl"
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
                        {t('products.allProducts')}
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
