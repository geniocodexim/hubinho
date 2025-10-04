import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import ProductPage from '@/pages/ProductPage';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Account from '@/pages/Account';
import Admin from '@/pages/Admin';
import Members from '@/pages/Members';
import MembersUpgrade from '@/pages/MembersUpgrade';
import AuthPage from '@/pages/AuthPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRole } from '@/hooks/useRole';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const { user, session, loading } = useAuth();
  const { isAdmin, isMember } = useRole();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === product.selectedColor && 
        item.selectedCapacity === product.selectedCapacity
      );
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id && 
          item.selectedColor === product.selectedColor && 
          item.selectedCapacity === product.selectedCapacity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, color, capacity, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => 
        !(item.id === productId && item.selectedColor === color && item.selectedCapacity === capacity)
      ));
    } else {
      setCart(prev => prev.map(item =>
        item.id === productId && item.selectedColor === color && item.selectedCapacity === capacity
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId, color, capacity) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.selectedColor === color && item.selectedCapacity === capacity)
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const navigateTo = (page, product = null) => {
    if ((page === 'account' || page === 'checkout') && !session) {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(page);
    if (product) setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen text-white">Carregando...</div>;
    }
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} products={products} />;
      case 'product':
        return <ProductPage product={selectedProduct} navigateTo={navigateTo} addToCart={addToCart} />;
      case 'cart':
        return <Cart cart={cart} navigateTo={navigateTo} updateQuantity={updateCartQuantity} removeFromCart={removeFromCart} />;
      case 'checkout':
        return session ? <Checkout cart={cart} navigateTo={navigateTo} clearCart={clearCart} /> : <AuthPage navigateTo={navigateTo} />;
      case 'account':
        return session ? <Account navigateTo={navigateTo} isAdmin={isAdmin} isMember={isMember} /> : <AuthPage navigateTo={navigateTo} />;
      case 'admin':
        return (
          <ProtectedRoute requiredRole="admin" navigateTo={navigateTo}>
            <Admin navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'members':
        return (
          <ProtectedRoute requiredRole="member" navigateTo={navigateTo}>
            <Members navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'members-upgrade':
        return <MembersUpgrade navigateTo={navigateTo} />;
      case 'auth':
        return <AuthPage navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} products={products} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>HotiPhone STORE - iPhones Premium com Garantia</title>
        <meta name="description" content="Loja premium de iPhones, MacBooks, Apple Watch e AirPods. Parcelamento em até 12x, Pix à vista com desconto. Entrega em todo Brasil com rastreamento." />
      </Helmet>
      <div className="min-h-screen bg-[#0E0E0E]">
        <Header navigateTo={navigateTo} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        {renderPage()}
        <Toaster />
      </div>
    </>
  );
}

export default App;
