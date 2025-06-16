<template>
  <div class="list-container">
    <h2>Lista de Tarefas</h2>
    <ul v-if="tasks.length">
      <li v-for="task in tasks" :key="task._id">
        <strong>{{ task.title }}</strong> - {{ task.description }}
        <div class="buttons">
          <button @click="deleteTask(task._id)">Excluir</button>
          <button @click="editTask(task)">Editar</button>
        </div>
      </li>
    </ul>
    <p v-else>Nenhuma tarefa cadastrada.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['tasks'],
  data() {
    return {
      task: { title: '', description: '' }
    }
  },
  methods: {
    deleteTask(id) {
	  axios.delete(`/api/tasks/${id}`, this.task).then(response => {
		this.notificationMessage = response.data.notification || 'Tarefa deletada com sucesso!'
        this.$emit('taskDeleted')
      })
    },
    editTask(task) {
      this.$emit('editTask', task)
    }
  }
}
</script>

<style>
.list-container ul {
  list-style: none;
  padding: 0;
}
.list-container li {
  padding: 10px;
  margin-bottom: 10px;
  background: #e9ecef;
  border-radius: 4px;
}
.buttons button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.buttons button:first-child {
  background-color: #dc3545;
  color: white;
}
.buttons button:last-child {
  background-color: #28a745;
  color: white;
}
.buttons button:hover {
  opacity: 0.9;
}
</style>