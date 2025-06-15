const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const app = express()
app.use(cors())
app.use(bodyParser.json())

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
  res.status(201).json(task)
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
  await Task.findByIdAndUpdate(req.params.id, req.body)
  res.sendStatus(200)
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
  await Task.findByIdAndDelete(req.params.id)
  res.sendStatus(200)
})

app.listen(3000, () => console.log('Backend running on port 3000'))
