
<template>
  <div>
    <h2>Lista de Tasks</h2>
    <ul>
      <li v-for="task in tasks" :key="task._id">
        <strong>{{ task.title }}</strong> - {{ task.description }}
        <button @click="deleteTask(task._id)">Excluir</button>
        <button @click="updateTask(task)">Editar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['tasks'],
  methods: {
    deleteTask(id) {
      axios.delete(\`http://localhost:3000/api/tasks/\${id}\`).then(() => {
        this.$emit('taskDeleted')
      })
    },
    updateTask(task) {
      const newTitle = prompt('Novo título', task.title)
      const newDesc = prompt('Nova descrição', task.description)
      if (newTitle && newDesc) {
        axios.put(\`http://localhost:3000/api/tasks/\${task._id}\`, {
          title: newTitle,
          description: newDesc
        }).then(() => {
          this.$emit('taskUpdated')
        })
      }
    }
  }
}
</script>
