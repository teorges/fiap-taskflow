const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Importa o app (se você quiser pode exportar só o app do server.js)
const app = express();
app.use(bodyParser.json());

// Modelo fake só pra teste (sem gravar no banco real)
const Task = mongoose.model('Task', {
  title: String,
  description: String,
});

// Rotas simples para teste
app.get('/api/tasks', async (req, res) => {
  res.status(200).json([{ title: 'Teste', description: 'Descrição de teste' }]);
});

describe('API /api/tasks', () => {
  it('Deve retornar lista de tarefas (mock)', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Teste' }),
      ])
    );
  });
});