const express = require('express');
const app = express();

app.use(express.json());

app.post('/notify', (req, res) => {
  console.log('📢 Notificação recebida:', req.body.message);
  res.sendStatus(200);
});

app.listen(4000, () => console.log('Notification Service rodando na porta 4000'));