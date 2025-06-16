
const axios = require('axios')

async function notifyTaskCreated(task) {
  try {
    await axios.post('http://notification-service:4000/notify', {
      message: `Nova tarefa criada: ${task.title}`
    })
    console.log('Notificação enviada ao Notification Service')
  } catch (error) {
    console.error('Erro ao notificar:', error.message)
  }
}

module.exports = { notifyTaskCreated }
