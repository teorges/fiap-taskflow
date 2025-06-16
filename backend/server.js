const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const { sendNotification, logEvent } = require('./eventBus')

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

// Configuração Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API para gerenciamento de tarefas com CRUD'
    }
  },
  apis: ['./server.js'], // Você pode mover depois para um arquivo de rotas separado
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow')

const Task = mongoose.model('Task', {
  title: String,
  description: String
})

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Lista todas as tarefas
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find()
  res.json(tasks)
})

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada
 */
app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body)
  await task.save()
  const notification = await sendNotification(`Nova tarefa criada: "${task.title}"`)
  await logEvent(`Tarefa criada: ${task.title}`)
  await sendToTeams('Tarefa criada.')
  res.status(201).json({ message: 'Tarefa criada.', notification })
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 */
app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })

  let notificationMessage = ''
  if (task)
    notificationMessage = `Tarefa atualizada: "${task.title}"`
  else
    notificationMessage = `Tentativa de atualização: Tarefa com ID ${req.params.id} não encontrada.`

  const notification = await sendNotification(notificationMessage)
  await logEvent(`Tarefa atualizada: ${task.title}`)
  await sendToTeams('Tarefa atualizada.')
  res.status(200).json({ message: 'Tarefa atualizada.', notification })
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa excluída
 */
app.delete('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)

  let notificationMessage = ''
  if (task)
    notificationMessage = `Tarefa excluída: "${task.title}"`
  else
    notificationMessage = `Tentativa de exclusão: Tarefa com ID ${req.params.id} não encontrada.`

  const notification = await sendNotification(notificationMessage)
  await logEvent(`Tarefa deletada: ${task.title}`)
  await sendToTeams('Tarefa excluída.')
  res.status(200).json({ message: 'Tarefa excluída.', notification:notificationMessage })
})

app.listen(3000, () => console.log('Backend running on port 3000'))
