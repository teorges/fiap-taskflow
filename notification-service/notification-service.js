require('dotenv').config();
const express = require('express');
const app = express();
const { sendToTeams } = require('./teamsNotifier.js')

// Middleware para JSON com corpo vazio permitido
app.use(express.json({
  strict: false,
  verify: (req, res, buf) => {
    if (buf.length === 0) {
      req.emptyBody = true
    }
  }
}))

// Tratamento de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    //console.error('Erro de JSON malformado:', err.message)
    return res.status(400).json({ message: 'JSON inválido no Notification Service.' })
  }
  next()
})

app.post('/notify', async (req, res) => {
  const message = req.body?.message
  if (message) {
    console.log('Recebido:', message)
    try {
      await sendToTeams(message)
      res.json({ message: `Notificação enviada: ${message}` })
    } catch (error) {
      console.error('Falha ao enviar para Teams:', error)
      res.status(500).json({ message: 'Erro ao enviar notificação para o Teams.' })
    }
  } else {
    console.log('Requisição sem mensagem.')
    res.json({ message: 'Nenhuma mensagem recebida.' })
  }
})

app.listen(4000, () => console.log('Notification Service rodando na porta 4000'));