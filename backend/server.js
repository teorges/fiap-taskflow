
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow')

const Task = mongoose.model('Task', {
  title: String,
  description: String
})

app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find()
  res.json(tasks)
})

app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body)
  await task.save()
  res.json(task)
})

app.put('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body)
  res.sendStatus(200)
})

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
  res.sendStatus(200)
})

app.listen(3000, () => console.log('Backend running on port 3000'))
