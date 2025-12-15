import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isAuthenticated, setAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            setProfileForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [isAuthenticated, user, navigate]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await authService.updateProfile(profileForm);
            const token = localStorage.getItem('token') || '';
            setAuth(updatedUser, token);
            toast.success('Profil güncellendi');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('Şifre en az 6 karakter olmalı');
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success('Şifre değiştirildi');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Mevcut şifre yanlış');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('profile.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            {t('profile.info')}
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'password' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            <Lock className="w-5 h-5" />
                            {t('profile.changePassword')}
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-gray-100"
                        >
                            <Save className="w-5 h-5" />
                            {t('profile.myOrders')}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <h2 className="text-2xl font-bold mb-6">{t('profile.info')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('auth.firstName')}</label>
                                        <input
                                            type="text"
                                            value={profileForm.firstName}
                                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('auth.lastName')}</label>
                                        <input
                                            type="text"
                                            value={profileForm.lastName}
                                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        disabled
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('auth.phone')}</label>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                                >
                                    {loading ? t('common.loading') : t('common.save')}
                                </button>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <h2 className="text-2xl font-bold mb-6">{t('profile.changePassword')}</h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('profile.currentPassword')}</label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('profile.newPassword')}</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('profile.confirmPassword')}</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                                >
                                    {loading ? t('common.loading') : t('profile.changePassword')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
