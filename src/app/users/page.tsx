// src/app/users/page.tsx

import UserList from '../users/UsersList'; // Importa o nosso Client Component

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
};

// Função que busca os dados no servidor
async function getUsers() {
  try {
    const response = await fetch(`${API_URL}/users`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Falha ao buscar dados");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// A página em si é um Server Component assíncrono
export default async function GerenciarUsersPage() {
  // Busca os dados no servidor antes de renderizar a página
  const initialUsers: User[] = await getUsers();

  // Renderiza o componente de cliente, passando os dados como prop
  return <UserList initialUsers={initialUsers} />;
}