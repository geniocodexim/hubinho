import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { formatCurrency } from '@/lib/formatCurrency';

const OrderManagement = ({ orders, refreshOrders }) => {
  const { toast } = useToast();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingCode, setTrackingCode] = useState('');

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateTracking = (order) => {
    setSelectedOrder(order);
    setTrackingCode(order.tracking_code || '');
    setIsTrackingOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pedido realizado': return 'bg-blue-500/20 text-blue-300';
      case 'Pagamento confirmado': return 'bg-yellow-500/20 text-yellow-300';
      case 'Produto em preparação': return 'bg-purple-500/20 text-purple-300';
      case 'Produto enviado': return 'bg-green-500/20 text-green-300';
      case 'Entregue': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const newStatus = trackingCode ? 'Produto enviado' : selectedOrder.status;

    const { error } = await supabase
      .from('orders')
      .update({ tracking_code: trackingCode, status: newStatus })
      .match({ id: selectedOrder.id });

    if (error) {
      toast({ title: "Erro ao atualizar rastreio", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Pedido atualizado com sucesso!", className: "bg-green-500 text-white" });
      await refreshOrders();
      setIsTrackingOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Pedidos</h2>
      <div className="bg-[#0E0E0E] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="p-4 font-semibold">ID do Pedido</th>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#2a2a2a]">
                  <td className="p-4 font-mono text-sm">#{order.id}</td>
                  <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{formatCurrency(order.total_price)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order)} className="text-gray-400 hover:text-white">
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleUpdateTracking(order)} className="text-orange-400 hover:text-orange-300">
                        <Truck className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-[#1a1a1a] border-[#FF8A00]/30 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gradient-orange">Detalhes do Pedido #{selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div>
              <p><strong>Data:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><strong>Total:</strong> {formatCurrency(selectedOrder.total_price)}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Cód. Rastreio:</strong> {selectedOrder.tracking_code || 'N/A'}</p>
              <h3 className="font-bold mt-4 mb-2 text-lg">Itens do Pedido:</h3>
              <ul className="space-y-2">
                {selectedOrder.order_items.map(item => (
                  <li key={item.id} className="flex justify-between p-2 bg-[#0E0E0E] rounded-md">
                    <span>{item.quantity}x Produto ID: {item.product_id} ({item.color}, {item.capacity})</span>
                    <span>{formatCurrency(item.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedOrder && (
        <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
          <DialogContent className="bg-[#1a1a1a] border-[#FF8A00]/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-gradient-orange">Atualizar Pedido #{selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTrackingSubmit}>
              <div className="space-y-2">
                <label htmlFor="trackingCode" className="font-semibold">Código de Rastreio</label>
                <input
                  id="trackingCode"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Insira o código de rastreio"
                  className="w-full p-2 rounded bg-[#0E0E0E] border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
                />
                <p className="text-xs text-gray-400">Deixar em branco para não alterar. Preencher para mudar o status para "Produto enviado".</p>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" className="bg-gradient-to-r from-[#FF8A00] to-[#FFB84D] text-black font-bold">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default OrderManagement;