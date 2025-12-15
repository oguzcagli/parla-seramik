import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe, User, Package, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated, logout } = useAuthStore();
    const totalItems = useCartStore((state) => state.getTotalItems());

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        Parla Seramik
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-primary transition">{t('nav.home')}</Link>
                        <Link to="/about" className="text-gray-700 hover:text-primary transition">{t('nav.about')}</Link>
                        <Link to="/products" className="text-gray-700 hover:text-primary transition">{t('nav.products')}</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-primary transition">{t('nav.contact')}</Link>

                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-gray-700 hover:text-primary transition">{t('nav.admin')}</Link>
                        )}

                        <button onClick={toggleLanguage} className="flex items-center text-gray-700 hover:text-primary transition">
                            <Globe className="w-5 h-5 mr-1" />
                            {i18n.language.toUpperCase()}
                        </button>

                        <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-1 text-gray-700 hover:text-primary transition"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="max-w-[100px] truncate">{user?.firstName}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <User className="w-4 h-4" />
                                            {t('profile.title')}
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <Package className="w-4 h-4" />
                                            {t('profile.myOrders')}
                                        </Link>
                                        <hr className="my-2" />
                                        <button
                                            onClick={() => { logout(); setShowUserMenu(false); }}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-700 hover:text-primary transition">{t('nav.login')}</Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <Link to="/" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.home')}</Link>
                        <Link to="/about" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.about')}</Link>
                        <Link to="/products" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.products')}</Link>
                        <Link to="/contact" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.contact')}</Link>
                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.admin')}</Link>
                        )}
                        <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="block text-gray-700 hover:text-primary transition">
                            <Globe className="w-5 h-5 inline mr-2" />{i18n.language.toUpperCase()}
                        </button>
                        <Link to="/cart" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.cart')} ({totalItems})</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('profile.title')}</Link>
                                <Link to="/orders" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('profile.myOrders')}</Link>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="block text-red-600 hover:text-red-700 transition">{t('nav.logout')}</button>
                            </>
                        ) : (
                            <Link to="/login" className="block text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}>{t('nav.login')}</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};
