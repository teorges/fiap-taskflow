
<template>
  <div>
    <h1>Taskflow - Frontend Vue</h1>
    <TaskForm @taskSaved="fetchTasks" />
    <TaskList :tasks="tasks" @taskDeleted="fetchTasks" @taskUpdated="fetchTasks" />
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'
import TaskForm from './components/TaskForm.vue'
import axios from 'axios'

export default {
  components: { TaskList, TaskForm },
  data() {
    return { tasks: [] }
  },
  methods: {
    fetchTasks() {
      axios.get('http://localhost:3000/api/tasks')
        .then(res => { this.tasks = res.data })
    }
  },
  mounted() {
    this.fetchTasks()
  }
}
</script>
