<template>
  <div class="container">
    
    <div v-bind:class="modalClass" class="modal-container">
      <div class="user-modal">
        <h3>{{ user.id ? 'Editar Usuário' : 'Cadastro de Usuário' }}</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <div class="form-row">
              <div class="form-item">
                <label for="nome">Nome</label>
                <input type="text" class="form-control" id="nome" v-model="user.nome" required />
              </div>
              <div class="form-item">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="user.email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label for="cargo">Cargo</label>
                <select id="cargo" class="form-control" v-model="user.cargo" required>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div class="form-item">
                <label for="cep">CEP</label>
                <input
                  type="text"
                  class="form-control"
                  id="cep"
                  v-model="user.cep"
                  @blur="consultarCep"
                  maxlength="8"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label for="rua">Rua</label>
                <input type="text" class="form-control" id="rua" v-model="user.endereco" required />
              </div>
              <div class="form-item">
                <label for="cidade">Cidade</label>
                <input type="text" class="form-control" id="cidade" v-model="user.cidade" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label for="estado">Estado</label>
                <input type="text" class="form-control" id="estado" v-model="user.estado" required />
              </div>
              <div class="form-item">
                <label for="pais">País</label>
                <input type="text" class="form-control" id="pais" v-model="user.pais" required />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ user.id ? 'Salvar' : 'Criar' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';


interface User {
  id?: number;
  nome: string;
  email: string;
  cargo: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
}

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object as PropType<User>,
      default: () => ({
        nome: '',
        email: '',
        cargo: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: ''
      })
    }
  },
  data() {
    return {
      user: this.user 
    };
  },
  computed: {
    modalClass(): string {
      return this.showModal ? 'show' : '';
    }
  },
  methods: {
    consultarCep() {
      const cep = this.user.cep.replace(/\D/g, ''); 
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then((response) => response.json())
          .then((data) => {
            if (!data.erro) {
              this.user.endereco = data.logradouro || '';
              this.user.cidade = data.localidade || '';
              this.user.estado = data.uf || '';
            } else {
              alert('CEP não encontrado');
            }
          })
          .catch(() => {
            alert('Erro ao consultar o CEP');
          });
      }
    },

  saveUser() {
  const method = this.user.id ? 'PUT' : 'POST';
  const url = this.user.id ? `http://localhost:3333/users/${this.user.id}` : 'http://localhost:3333/users';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(this.user),
  })
    .then((response) => {
      if (response.ok) {
        alert(`${this.user.id ? 'Usuário editado' : 'Usuário criado'} com sucesso!`);
        this.$emit('user-saved'); 
        this.$emit('close'); 
      } else {
        alert('Erro ao salvar o usuário');
      }
    })
    .catch(() => {
      alert('Erro ao salvar o usuário');
    });
 },


  closeModal() {
      this.$emit('close');
    }
  }
});
</script>

<style scoped>
.container {
  position: relative;
}

.modal-container {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

.modal-container.show {
  opacity: 1;
  pointer-events: auto;
}

.user-modal {
  color: #535353;
  background-color: #fff;
  width: 450px;
  padding: 40px 50px;
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-modal h3 {
  margin: 0 0 20px 0;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
}

.form-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  width: 48%;
}

.form-item label {
  margin-bottom: 5px;
}

.form-item input,
.form-item select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button.btn:hover {
  background-color: #0056b3;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-footer .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.modal-footer .btn-primary {
  background-color: #007bff;
  color: white;
}
</style>
