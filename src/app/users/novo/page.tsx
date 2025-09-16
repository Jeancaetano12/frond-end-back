'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para redirecionamento
import DashboardLayout from '@/app/components/DashboardLayout';
import { toast } from 'react-toastify';

export default function NovoClientePage() {
  const router = useRouter(); // Inicializa o hook de roteamento
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [birthDate,setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o recarregamento da página
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, telefone, birth_date: birthDate}),
      });

      if (!response.ok) {
        // Pega a mensagem de erro da API se houver
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao cadastrar o cliente.');
      }

      // Se tudo deu certo, exibe uma mensagem de sucesso
      toast.success('Cliente cadastrado com sucesso!');
      // Se tudo deu certo, redireciona o usuário de volta para a lista
      router.push('/users');

    } catch (error: any) {
        toast.error(error.message);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl mb-6 font-mono font-bold text-gray-800 dark:text-gray-200">
        Cadastrar Novo Cliente
      </h1>
      <hr />
      <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
             </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone
              </label>
              <input 
                type="tel"
                id="telefone"
                value={telefone}
                onChange={(event) => {
                  const numeros = event.target.value.replace(/\D/g, '');
                  setTelefone(numeros);
                }}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data de Nascimento
              </label>
              <input 
                type="date" 
                id="birth_date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? 'Salvando...' : 'Salvar Cliente'}
            </button>

            {error && <p className="mt-4 text-red-500">{error}</p>}

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}