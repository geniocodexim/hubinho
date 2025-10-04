import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CustomerManagement = ({ customers, refreshCustomers }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (customers.length === 0) {
      toast({ title: "Nenhum cliente para exportar", variant: "destructive" });
      return;
    }

    const headers = ['ID', 'Email', 'Nome Completo', 'Role', 'Telefone', 'Documento'];
    const csvRows = [headers.join(',')];

    customers.forEach(customer => {
      const row = [
        customer.id,
        customer.email || '',
        customer.full_name || '',
        customer.role || 'customer',
        customer.phone || '',
        customer.document || ''
      ].join(',');
      csvRows.push(row);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Exportação concluída!", description: "O arquivo CSV com os clientes foi baixado.", className: "bg-green-500 text-white" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Clientes</h2>
        <Button onClick={exportToCSV} className="bg-gradient-to-r from-[#FF8A00] to-[#FFB84D] text-black font-bold">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="bg-[#0E0E0E] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-[#2a2a2a]">
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.full_name || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.role === 'admin' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td className="p-4">{customer.phone || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerManagement;