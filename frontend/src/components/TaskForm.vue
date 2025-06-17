<template>
  <div class="form-container">
    <h2>{{ task._id ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
    <form @submit.prevent="submitForm">
      <input v-model="task.title" placeholder="Título" required />
      <input v-model="task.description" placeholder="Descrição" required />
      <button type="submit">Salvar</button>
    </form>

    <div v-if="notificationMessage" class="notification">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['selectedTask'],
  data() {
    return {
      task: { title: '', description: '' },
      notificationMessage: ''
    }
  },
  watch: {
    selectedTask(newTask) {
      this.task = newTask ? { ...newTask } : { title: '', description: '' }
    }
  },
  methods: {
    normalizeInput(input) {
      return input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')      // Remove acentos
        .replace(/[^a-zA-Z0-9\s]/g, '')       // Remove caracteres especiais (inclusive ç, ~, ´ etc)
        .trim();                              // Remove espaços em excesso nas bordas
    },
    submitForm() {
      // Limpeza antes de enviar
      const cleanedTask = {
        ...this.task,
        title: this.normalizeInput(this.task.title),
        description: this.normalizeInput(this.task.description)
      }

      if (this.task._id) {
        axios.put(`/api/tasks/${this.task._id}`, cleanedTask).then(response => {
          this.notificationMessage = response.data.notification || 'Tarefa atualizada com sucesso!'
          this.$emit('taskSaved')
          this.resetForm()

          setTimeout(() => {
            this.notificationMessage = '';
          }, 5000);
        })
      } else {
        axios.post('/api/tasks', cleanedTask).then(response => {
          this.notificationMessage = response.data.notification || 'Tarefa criada com sucesso!'
          this.$emit('taskSaved')
          this.resetForm()

          setTimeout(() => {
            this.notificationMessage = '';
          }, 5000);
        })
      }
    },
    resetForm() {
      this.task = { title: '', description: '' }
    }
  }
}
</script>

<style>
.form-container {
  margin-bottom: 20px;
}
input {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 12px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}

.notification {
  margin-top: 10px;
  padding: 10px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 4px;
}
</style>
