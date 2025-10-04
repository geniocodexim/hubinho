import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { formatCurrency } from '@/lib/formatCurrency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductManagement = ({ products, refreshProducts }) => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState('active');

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setStatus(product.status || 'active');
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setStatus('active');
    setIsFormOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    const { error } = await supabase.from('products').delete().match({ id: productToDelete.id });

    if (error) {
      toast({ title: "Erro ao deletar produto", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Produto deletado com sucesso!", className: "bg-green-500 text-white" });
      await refreshProducts();
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData.entries());

    let imageUrls = selectedProduct?.images || [];

    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
        if (error) {
          throw error;
        }
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
        return publicUrl;
      });

      try {
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      } catch (error) {
        toast({ title: "Erro no upload de imagem", description: error.message, variant: "destructive" });
        return;
      }
    }

    const dataToSubmit = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      category: productData.category,
      colors: productData.colors.split(',').map(s => s.trim()),
      capacities: productData.capacities.split(',').map(s => s.trim()),
      images: imageUrls,
      stock: parseInt(productData.stock, 10),
      status: status,
    };

    let error;
    if (selectedProduct) {
      ({ error } = await supabase.from('products').update(dataToSubmit).match({ id: selectedProduct.id }));
    } else {
      ({ error } = await supabase.from('products').insert([dataToSubmit]));
    }

    if (error) {
      toast({ title: `Erro ao ${selectedProduct ? 'atualizar' : 'criar'} produto`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Produto ${selectedProduct ? 'atualizado' : 'criado'} com sucesso!`, className: "bg-green-500 text-white" });
      await refreshProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
      setImageFiles([]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Produtos</h2>
        <Button onClick={handleAddNew} className="bg-gradient-to-r from-[#FF8A00] to-[#FFB84D] text-black font-bold">
          <PlusCircle className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      <div className="bg-[#0E0E0E] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="p-4 font-semibold">Produto</th>
                <th className="p-4 font-semibold">Preço</th>
                <th className="p-4 font-semibold">Estoque</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#2a2a2a]">
                  <td className="p-4 flex items-center gap-4">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="p-4">{formatCurrency(product.price)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {product.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} className="text-red-500 hover:text-red-400">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#FF8A00]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-gradient-orange">{selectedProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
            <div>
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" name="name" defaultValue={selectedProduct?.name} className="bg-[#0E0E0E] border-[#333]" required />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" defaultValue={selectedProduct?.description} className="bg-[#0E0E0E] border-[#333]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={selectedProduct?.price} className="bg-[#0E0E0E] border-[#333]" required />
              </div>
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input id="stock" name="stock" type="number" defaultValue={selectedProduct?.stock ?? 0} className="bg-[#0E0E0E] border-[#333]" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" name="category" defaultValue={selectedProduct?.category} className="bg-[#0E0E0E] border-[#333]" required />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={setStatus} value={status}>
                  <SelectTrigger className="w-full bg-[#0E0E0E] border-[#333]">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] text-white border-[#FF8A00]/30">
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="colors">Cores (separadas por vírgula)</Label>
              <Input id="colors" name="colors" defaultValue={selectedProduct?.colors?.join(', ')} className="bg-[#0E0E0E] border-[#333]" />
            </div>
            <div>
              <Label htmlFor="capacities">Capacidades (separadas por vírgula)</Label>
              <Input id="capacities" name="capacities" defaultValue={selectedProduct?.capacities?.join(', ')} className="bg-[#0E0E0E] border-[#333]" />
            </div>
            <div>
              <Label htmlFor="images">Adicionar Novas Imagens</Label>
              <Input id="images" name="images" type="file" multiple onChange={handleImageChange} className="bg-[#0E0E0E] border-[#333] file:text-white" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-[#FF8A00] to-[#FFB84D] text-black font-bold">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-red-500/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja deletar o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Deletar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductManagement;