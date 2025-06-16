const https = require('https')
const { URL } = require('url')

//const webhookUrl = new URL(process.env.TEAMS_WEBHOOK_URL)
const webhookUrl = ''

function sendToTeams(message) {
  const data = JSON.stringify({ text: message })

  const options = {
    hostname: webhookUrl.hostname,
    path: webhookUrl.pathname + webhookUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      res.on('data', () => {})
      res.on('end', () => resolve('Notificado no Teams.'))
    })

    req.on('error', err => {
      console.error('Erro ao enviar para Teams:', err)
      reject('Erro ao notificar Teams.')
    })

    req.write(data)
    req.end()
  })
}

module.exports = { sendToTeams }