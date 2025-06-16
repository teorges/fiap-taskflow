const http = require('http')

// NOTIFICATION-SERVICE
function sendNotification(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message })

    const options = {
      hostname: 'notification-service',
      port: 4000,
      path: '/notify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, res => {
      let responseBody = ''

      res.on('data', chunk => {
        responseBody += chunk
      })

      res.on('end', () => {
        try {
          const responseJson = JSON.parse(responseBody)
          resolve(responseJson.message || 'Notificação enviada.')
        } catch (error) {
          resolve('Resposta do Notification inválida.')
        }
      })
    })

    req.on('error', error => {
      console.error('Erro ao notificar:', error.message)
      resolve('Falha ao enviar notificação.')
    })

    req.write(data)
    req.end()
  })
}

// LOG-SERVICE
function logEvent(message, level = 'info') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message, level })

    const options = {
      hostname: 'log-service',
      port: 5000,
      path: '/log',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, res => {
      res.on('data', () => {})
      res.on('end', () => resolve())
    })

    req.on('error', error => {
      console.error('Erro ao logar:', error.message)
      resolve()
    })

    req.write(data)
    req.end()
  })
}

module.exports = { sendNotification, logEvent }