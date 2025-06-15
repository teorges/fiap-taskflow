<template>
  <div class="form-container">
    <h2>{{ task._id ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
    <form @submit.prevent="submitForm">
      <input v-model="task.title" placeholder="Título" required />
      <input v-model="task.description" placeholder="Descrição" required />
      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['selectedTask'],
  data() {
    return {
      task: { title: '', description: '' }
    }
  },
  watch: {
    selectedTask(newTask) {
      this.task = newTask ? { ...newTask } : { title: '', description: '' }
    }
  },
  methods: {
    submitForm() {
      if (this.task._id) {
        axios.put(`/api/tasks/${this.task._id}`, this.task).then(() => {
          this.$emit('taskSaved')
          this.resetForm()
        })
      } else {
        axios.post('/api/tasks', this.task).then(() => {
          this.$emit('taskSaved')
          this.resetForm()
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
</style>