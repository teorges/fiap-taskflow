<template>
  <div class="container">
    <h1>TaskFlow - FIAP</h1>

    <TaskForm :selectedTask="selectedTask" @taskSaved="fetchTasks" />

    <TaskList
      :tasks="tasks"
      @taskDeleted="fetchTasks"
      @editTask="editTask"
    />
  </div>
</template>

<script>
import axios from 'axios'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'

export default {
  components: { TaskForm, TaskList },
  data() {
    return {
      tasks: [],
      selectedTask: null
    }
  },
  methods: {
    fetchTasks() {
      axios.get('/api/tasks').then(res => {
        this.tasks = res.data
        this.selectedTask = null
      })
    },
    editTask(task) {
      this.selectedTask = task
    }
  },
  mounted() {
    this.fetchTasks()
  }
}
</script>

<style>
.container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  font-family: Arial, sans-serif;
}
h1 {
  text-align: center;
  color: #333;
}
</style>