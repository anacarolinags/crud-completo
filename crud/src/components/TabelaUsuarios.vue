<template>
  <div class="container">
    <header>
      <h1 class="mb-0">CRUD de Usuários</h1>
    </header>

    <!-- Contêiner para a barra de pesquisa e o botão -->
    <div class="search-bar-container">
      <!-- Barra de pesquisa -->
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Pesquisar usuários..." />
      </div>

      <!-- Botão para adicionar usuário -->
      <button class="btn-add" @click="openModal">Adicionar Usuário</button>
    </div>

    <!-- Tabela de usuários -->
    <table class="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Cargo</th>
          <th>Endereço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.nome }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.cargo }}</td>
          <td>{{ user.endereco }}</td>
          <td>
            <button class="btn-edit" @click="editUser(user)">Editar</button>
            <button class="btn-delete" @click="deleteUser(user.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de Cadastro de Usuário -->
    <CadastroUsuario 
      v-if="isModalOpen" 
      @close="closeModal" 
      :showModal="isModalOpen" 
      :user="selectedUser" 
      @user-saved="fetchUsers" />
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import CadastroUsuario from './CadastroUsuario.vue'; // Importando o componente CadastroUsuario

interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  endereco: string;
}

export default defineComponent({
  components: {
    CadastroUsuario, // Registrando o componente
  },
  data() {
    return {
      users: [] as User[], // Lista de usuários
      searchQuery: '', // Filtro de pesquisa
      isModalOpen: false, // Controle de abertura do modal
      selectedUser: {} as User, // Usuário selecionado para edição
    };
  },
  computed: {
    filteredUsers(): User[] {
      return this.users.filter((user) =>
        user.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    // Carregar usuários da API
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:3333/users');
        if (response.ok) {
          const data = await response.json();
          this.users = data;
        } else {
          console.error('Erro ao carregar os usuários:', response.status);
        }
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    },

    // Abrir o modal para adicionar um novo usuário
    openModal() {
      this.selectedUser = {} as User; // Limpar qualquer seleção anterior
      this.isModalOpen = true;  // Abrir o modal
    },

    // Editar usuário e abrir o modal com dados preenchidos
    editUser(user: User) {
      this.selectedUser = { ...user };  // Passar os dados do usuário selecionado
      this.isModalOpen = true;  // Abrir o modal
    },

    // Fechar o modal de cadastro
    closeModal() {
      this.isModalOpen = false;
      this.selectedUser = {} as User; // Limpar o usuário após fechar
    },

    // Excluir usuário
    async deleteUser(id: number) {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
          const response = await fetch(`http://localhost:3333/users/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            this.fetchUsers();
          } else {
            console.error('Erro ao excluir o usuário:', response.status);
          }
        } catch (error) {
          console.error('Erro ao excluir o usuário:', error);
        }
      }
    },
  },

  mounted() {
    this.fetchUsers();
  },
});
</script>

<style scoped>
/* Estilos para o botão Adicionar Usuário */
/* Estilos para o contêiner */
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

/* Estilos para o cabeçalho */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
}

/* Contêiner para a barra de pesquisa e o botão */
.search-bar-container {
  display: flex;
  justify-content: space-between; /* Coloca os itens na extremidade direita e esquerda */
  align-items: center;
  width: 100%; /* Faz com que o contêiner ocupe toda a largura disponível */
  margin-bottom: 20px; /* Adiciona espaçamento entre os itens */
}

/* Estilos para a barra de pesquisa */
.search-bar input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-width: 300px; /* Define a largura máxima da barra de pesquisa */
  width: 100%;
}

/* Estilos para o botão Adicionar Usuário */
.btn-add {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: auto; /* O botão não precisa de largura 100% */
}

.btn-add:hover {
  background-color: #0056b3;
}




/* Estilos da tabela */
.tabela {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.tabela th,
.tabela td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.tabela th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.tabela td button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
  font-size: 14px;
  background-color: #fff;
}

.tabela td .btn-edit {
  background-color: #ffc107;
}

.tabela td .btn-delete {
  background-color: #dc3545;
}

.tabela td .btn-edit:hover {
  background-color: #e0a800;
}

.tabela td .btn-delete:hover {
  background-color: #c82333;
}
</style>
