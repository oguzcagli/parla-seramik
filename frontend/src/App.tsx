import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Contact } from './pages/Contact';
// import { Cart } from './pages/Cart'; // Shopier entegrasyonu için gizlendi
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
// import { Checkout } from './pages/Checkout'; // Shopier entegrasyonu için gizlendi
import { ProductDetail } from './pages/ProductDetail';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'ADMIN') {
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
                        {/* Shopier entegrasyonu için gizlendi */}
                        {/* <Route path="/cart" element={<Cart />} /> */}
                        {/* <Route path="/checkout" element={<Checkout />} /> */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                    </Routes>
                </main>
                <Footer />
            </div>
            <Toaster position="top-right" />
        </BrowserRouter>
    );
}

export default App;
