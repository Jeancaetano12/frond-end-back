'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';
import { toast } from 'react-toastify';
import PatchModal from '../components/PatchModal';

type User = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
};

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  // 3. O estado inicial agora vem das props, não de um fetch
  const [users, setUsers] = useState(initialUsers);
  
  // O estado de loading inicial não é mais necessário, pois a página já carrega com os dados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', telefone: '', birth_date: '' });

  // --- Funções para controlar o Modal ---
  const handleOpenModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name, 
      email: user.email,
      telefone: user.telefone || '',
      birth_date: user.birth_date ? user.birth_date.split('T')[0] : '' // Formata a data para YYYY-MM-DD
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'telefone') {
      const numeros = value.replace(/\D/g, '');
      setFormData((prevData) => ({ ...prevData, [id]: numeros }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const toastId = toast.loading("Atualizando cliente...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message[0] || 'Falha ao atualizar o cliente');
      }

      const updatedUser: User = await response.json();
      setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      handleCloseModal();

      toast.update(toastId, {
        render: `Cliente "${updatedUser.name}" atualizado com sucesso.`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: `Erro: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  }
  

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o cliente "${userName}"?`)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Falha ao deletar o cliente.');
        }

        setUsers(users.filter((user) => user.id !== userId));
        toast.success(`Cliente "${userName}" deletado com sucesso!`);

      } catch (error: any) {
        toast.error(error.message);
        console.error('Erro ao deletar cliente:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-200">
          Lista de Clientes
        </h1>
        <Link href="/users/novo" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Adicionar Cliente
        </Link>
      </div>
      <hr className="mb-6"/>

        <div className="mt-6 space-y-4">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
            >
              <div className="font-mono text-sm">
                <p className="text-lg font-sans font-bold text-gray-900 dark:text-gray-100">{user.name}</p>
                <hr />
                <p className="text-gray-600 dark:text-gray-400">email: {user.email}</p>
                <p className="text-gray-600 dark:text-gray-400">telefone: {user.telefone}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Nascimento: {user.birth_date
                    ? new Date(user.birth_date).toLocaleDateString('pt-br',
                    { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'}
                  )
                    : 'Não informado'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  criado em: {user.created_at
                    ? new Date(user.created_at).toLocaleDateString('pt-BR', 
                    { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}
                  )
                    : 'Não informado'}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                {/* 2. Botão de atualizar agora abre o modal */}
                <button 
                  onClick={() => handleOpenModal(user)} 
                  className="px-4 py-2 text-sm text-center bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Atualizar
                </button>
                <button 
                  onClick={() => handleDelete(user.id, user.name)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

      {/* 3. O Modal é renderizado aqui */}
      <PatchModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Editar Cliente</h2>
        <form onSubmit={handleUpdateSubmit}>
          <div className="space-y-4">
            {/* Campos do formulário */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
              <input type="text" id="name" value={formData.name} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
              <input type="tel" id="telefone" value={formData.telefone} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="Nascimento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
              <input type="text" id="birth_date" value={formData.birth_date} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"/>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Salvar Alterações
            </button>
          </div>
        </form>
      </PatchModal>
    </DashboardLayout>
  );
}