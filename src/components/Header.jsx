import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X, MessageCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Header = ({ navigateTo, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, signOut } = useAuth();

  const categories = [
    'iPhone 16 Pro Max',
    'iPhone 16 Pro',
    'iPhone 16',
    'MacBook',
    'Apple Watch',
    'AirPods'
  ];

  const handleWhatsApp = () => {
    toast({
      title: "WhatsApp",
      description: "🚧 Integração com WhatsApp será implementada em breve! 🚀",
    });
  };

  const handleSearch = () => {
    toast({
      title: "Busca",
      description: "🚧 Funcionalidade de busca será implementada em breve! 🚀",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigateTo('home');
    toast({
      title: "Logout realizado com sucesso!",
      description: "Esperamos ver você novamente em breve.",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0E0E0E]/95 backdrop-blur-lg border-b border-[#FF8A00]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateTo('home')}
            whileHover={{ scale: 1.05 }}
          >
            <Logo />
            <div>
              <h1 className="text-2xl font-bold text-gradient-orange">HotiPhone</h1>
              <p className="text-xs text-[#BFC3C7]">STORE</p>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center gap-6">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => toast({
                  title: cat,
                  description: "🚧 Categoria em breve! 🚀",
                })}
                className="text-sm text-[#BFC3C7] hover:text-[#FF8A00] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              className="hidden md:flex text-[#BFC3C7] hover:text-[#FF8A00]"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleWhatsApp}
              className="hidden md:flex text-[#BFC3C7] hover:text-[#FF8A00]"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTo(session ? 'account' : 'auth')}
              className="text-[#BFC3C7] hover:text-[#FF8A00]"
            >
              <User className="w-5 h-5" />
            </Button>

            {session && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-red-500 hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTo('cart')}
              className="relative text-[#BFC3C7] hover:text-[#FF8A00]"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8A00] text-[#0E0E0E] text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-[#BFC3C7]"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-[#FF8A00]/20"
          >
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsMenuOpen(false);
                  toast({
                    title: cat,
                    description: "🚧 Categoria em breve! 🚀",
                  });
                }}
                className="block w-full text-left py-3 text-[#BFC3C7] hover:text-[#FF8A00] transition-colors"
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="bg-gradient-to-r from-[#FF8A00]/10 via-[#FFB84D]/10 to-[#FF8A00]/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#BFC3C7]">
            <span>✓ Entrega em todo Brasil</span>
            <span className="hidden sm:inline">•</span>
            <span>✓ Pix e Cartão</span>
            <span className="hidden sm:inline">•</span>
            <span>✓ Antifraude</span>
            <span className="hidden sm:inline">•</span>
            <span>✓ Rastreamento Correios</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;