import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingInstagram } from './components/FloatingInstagram';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { ProductDetail } from './pages/ProductDetail';
import { useAuthStore } from './store/authStore';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

function App() {
    const initAuth = useAuthStore((state) => state.initAuth);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        {/* Admin giriş sayfası */}
                        <Route path="/admin" element={<Login />} />
                        {/* Admin paneli */}
                        <Route path="/panel" element={<AdminRoute><Admin /></AdminRoute>} />
                        {/* Eski login URL'i ana sayfaya yönlendir */}
                        <Route path="/login" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
                <FloatingInstagram />
            </div>
            <Toaster position="top-right" />
        </BrowserRouter>
    );
}

export default App;
