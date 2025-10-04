import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

const ProductCard = ({ product, navigateTo }) => {
  const installmentPrice = product.price / 12;
  const pixPrice = product.price * 0.9;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#0E0E0E] rounded-2xl overflow-hidden shadow-lg border border-[#FF8A00]/10 flex flex-col group"
    >
      <div className="relative overflow-hidden">
        <img
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          alt={product.name}
         src="https://images.unsplash.com/photo-1586678761373-60c055ec8266" />
        <div className="absolute top-0 left-0 bg-gradient-to-r from-[#FF8A00] to-[#FFB84D] text-[#0E0E0E] px-3 py-1 text-sm font-bold rounded-br-lg">
          NOVO
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#E6E8EB] mb-2 truncate">{product.name}</h3>
        <div className="mt-auto">
          <div className="text-left mb-4">
            <p className="text-2xl font-bold text-gradient-orange mb-1">12x de {formatCurrency(installmentPrice)}</p>
            <p className="text-md text-[#BFC3C7]">ou {formatCurrency(pixPrice)} no PIX</p>
          </div>
          <Button
            onClick={() => navigateTo('product', product)}
            className="w-full bg-transparent border-2 border-[#FF8A00] text-[#FF8A00] hover:bg-[#FF8A00] hover:text-[#0E0E0E] font-bold transition-colors duration-300 glow-orange-hover"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;