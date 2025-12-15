import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t('common.success'));
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12">{t('contact.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div>
                    <h2 className="text-2xl font-semibold mb-6">{t('contact.getInTouch')}</h2>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                                <p className="text-gray-600">info@parlaseramik.com</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Phone className="w-6 h-6 text-primary mr-4 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
                                <p className="text-gray-600">+90 555 123 45 67</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">{t('contact.address')}</h3>
                                <p className="text-gray-600">{t('contact.addressText')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">{t('contact.phone')}</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition"
                        >
                            {t('contact.send')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
