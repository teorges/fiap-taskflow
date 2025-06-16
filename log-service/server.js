const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())

const LOG_FILE = path.join(__dirname, 'logs.txt')

// Endpoint para salvar logs
app.post('/log', (req, res) => {
  const { message, level = 'info', timestamp = new Date().toISOString() } = req.body

  if (!message) {
    return res.status(400).json({ message: 'Campo "message" obrigatório.' })
  }

  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`

  fs.appendFile(LOG_FILE, logLine, err => {
    if (err) {
      console.error('Erro ao salvar log:', err)
      return res.status(500).json({ message: 'Falha ao salvar log.' })
    }
    console.log('Log registrado:', logLine.trim())
    res.status(200).json({ message: 'Log registrado.' })
  })
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Log Service rodando na porta ${process.env.PORT || 5000}`)
})