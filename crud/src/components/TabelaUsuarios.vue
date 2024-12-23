<template>
  <div class="container">
    <header>
      <h1 class="mb-0">CRUD de Usuários</h1>
    </header>

    
    <div class="search-bar-container">
     
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Pesquisar usuários..." />
      </div>

      
      <button class="btn-add" @click="openModal">Adicionar Usuário</button>
    </div>

    
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
import CadastroUsuario from './CadastroUsuario.vue'; 

interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  endereco: string;
}

export default defineComponent({
  components: {
    CadastroUsuario, 
  },
  data() {
    return {
      users: [] as User[], 
      searchQuery: '', 
      isModalOpen: false, 
      selectedUser: {} as User, 
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

   
    openModal() {
      this.selectedUser = {} as User; 
      this.isModalOpen = true;  
    },

   
    editUser(user: User) {
      this.selectedUser = { ...user }; 
      this.isModalOpen = true;  
    },

  
    closeModal() {
      this.isModalOpen = false;
      this.selectedUser = {} as User; 
    },

    
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

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

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


.search-bar-container {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%; 
  margin-bottom: 20px; 
}


.search-bar input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-width: 300px;  
  width: 100%;
}


.btn-add {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: auto; 
}

.btn-add:hover {
  background-color: #0056b3;
}

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
