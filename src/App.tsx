import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { ScrollToTop } from './components/common/ScrollToTop';
import { BoutiqueGuideBot } from './components/chat/BoutiqueGuideBot';
import { AuthModal } from './components/auth/AuthModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminPagesEditorPage } from './pages/admin/AdminPagesEditorPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Customer Storefront Layout Wrapper
const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark text-elara-text-dark dark:text-elara-text-light transition-colors duration-300 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BoutiqueGuideBot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <StoreProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <Router>
                    <ScrollToTop />
                    <ToastContainer />
                    <AuthModal />
                    <Routes>
                      {/* 1. Admin Portal Dedicated Routes */}
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="homepage" element={<AdminHomepagePage />} />
                        <Route path="pages" element={<AdminPagesEditorPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                      </Route>

                      {/* 2. Public Boutique Storefront Routes */}
                      <Route element={<StorefrontLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/shipping" element={<ShippingPolicyPage />} />
                        <Route path="/returns" element={<ReturnPolicyPage />} />
                        <Route path="/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Route>
                    </Routes>
                  </Router>
                </WishlistProvider>
              </CartProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </StoreProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
