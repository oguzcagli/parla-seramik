import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export const Login = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password,
            });

            // Sadece admin girişine izin ver
            if (response.user.role !== 'ADMIN') {
                toast.error('Bu sayfaya erişim yetkiniz yok');
                return;
            }

            setAuth(response.user, response.token);
            toast.success('Giriş başarılı');
            navigate('/panel');
        } catch (error: any) {
            // Hata mesajını göster
            const errorMessage = error.response?.data?.message || 'E-posta veya şifre hatalı';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Shield className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Yönetici Girişi</h2>
                <p className="text-gray-500 text-center mb-8">Bu sayfa sadece yöneticiler içindir</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">E-posta</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Şifre</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
};
