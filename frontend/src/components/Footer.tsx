import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-4">Parla Seramik</h3>
                        <p className="text-gray-400">
                            {t('hero.description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t('nav.products')}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary transition">
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-primary transition">
                                    {t('nav.about')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-primary transition">
                                    {t('nav.products')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-primary transition">
                                    {t('nav.contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t('contact.title')}</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-400">
                                <Mail className="w-5 h-5 mr-2 text-primary" />
                                info@parlaseramik.com
                            </li>
                            <li className="flex items-center text-gray-400">
                                <Phone className="w-5 h-5 mr-2 text-primary" />
                                +90 555 123 45 67
                            </li>
                            <li className="flex items-center text-gray-400">
                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                {t('contact.addressText')}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Parla Seramik. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
