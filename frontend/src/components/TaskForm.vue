
<template>
  <div>
    <h2>Criar Nova Task</h2>
    <input v-model="title" placeholder="Título" />
    <input v-model="description" placeholder="Descrição" />
    <button @click="saveTask">Salvar</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return { title: '', description: '' }
  },
  methods: {
    saveTask() {
      axios.post('http://localhost:3000/api/tasks', {
        title: this.title,
        description: this.description
      }).then(() => {
        this.title = ''
        this.description = ''
        this.$emit('taskSaved')
      })
    }
  }
}
</script>
