import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-200 text-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <img src="/logo.png" alt="Parla Seramik" className="h-16 mb-4" />
                        <p className="text-gray-600">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('nav.products')}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-primary transition">
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-primary transition">
                                    {t('nav.about')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-600 hover:text-primary transition">
                                    {t('nav.products')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 hover:text-primary transition">
                                    {t('nav.contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('contact.title')}</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-600">
                                <Mail className="w-5 h-5 mr-2 text-primary" />
                                parlaseramik.nh@gmail.com
                            </li>
                            <li className="flex items-center text-gray-600">
                                <Phone className="w-5 h-5 mr-2 text-primary" />
                                +90 544 361 73 09
                            </li>
                            <li className="flex items-center text-gray-600">
                                <Instagram className="w-5 h-5 mr-2 text-primary" />
                                <a href="https://instagram.com/parla.seramik" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                                    parla.seramik
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
                    <p>&copy; 2025 Parla Seramik. {t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};
