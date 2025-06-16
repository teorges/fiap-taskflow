const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')
const { sendNotification, logEvent } = require('./eventBus')

const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'))

const app = express()
app.use(cors())

// Middleware para JSON com corpo vazio
app.use(express.json({
  strict: false,
  verify: (req, res, buf) => {
    if (buf.length === 0) {
      req.emptyBody = true
    }
  }
}))

// Middleware para JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Erro de JSON malformado:', err.message)
    return res.status(400).json({ message: 'JSON inválido.' })
  }
  next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow')
  .then(() => console.log('MongoDB conectado com sucesso.'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err))

const Task = mongoose.model('Task', {
  title: String,
  description: String
})

// Listar tarefas
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find()
  res.json(tasks)
})

// Criar tarefa
app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body)
  await task.save()
  const notification = await sendNotification(`Nova tarefa criada: "${task.title}"`)
  await logEvent(`Tarefa criada: ${task.title}`)
  res.status(201).json({ message: 'Tarefa criada.', notification })
})

// Atualizar tarefa
app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })

  let notificationMessage = ''
  if (task)
    notificationMessage = `Tarefa atualizada: "${task.title}"`
  else
    notificationMessage = `Tentativa de atualização: Tarefa com ID ${req.params.id} não encontrada.`

  const notification = await sendNotification(notificationMessage)
  await logEvent(task ? `Tarefa atualizada: ${task.title}` : `Tarefa não encontrada: ${req.params.id}`)

  res.status(200).json({ message: 'Tarefa atualizada.', notification })
})

// Deletar tarefa
app.delete('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)

  let notificationMessage = ''
  if (task)
    notificationMessage = `Tarefa excluída: "${task.title}"`
  else
    notificationMessage = `Tentativa de exclusão: Tarefa com ID ${req.params.id} não encontrada.`

  const notification = await sendNotification(notificationMessage)
  await logEvent(task ? `Tarefa deletada: ${task.title}` : `Tarefa não encontrada: ${req.params.id}`)

  res.status(200).json({ message: 'Tarefa excluída.', notification: notificationMessage })
})

app.listen(3000, () => console.log('Backend running on port 3000'))