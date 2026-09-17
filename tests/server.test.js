const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../server');

test('POST /api/submit devuelve 400 si faltan datos', async () => {
  const response = await request(app)
    .post('/api/submit')
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /fecha|comida/i);
});

test('POST /api/submit valida el formato de la fecha', async () => {
  const response = await request(app)
    .post('/api/submit')
    .send({
      date: 'fecha-invalida',
      food: 'Pizza',
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /fecha/i);
});

test('POST /api/submit rechaza fechas duplicadas', async () => {
  const uniqueFutureDate = new Date(Date.now() + 86400000 + Math.floor(Math.random() * 86400000));
  const duplicateDate = uniqueFutureDate.toISOString().slice(0, 10);

  const first = await request(app)
    .post('/api/submit')
    .send({
      date: duplicateDate,
      food: 'Sushi',
    });

  assert.equal(first.status, 200);

  const second = await request(app)
    .post('/api/submit')
    .send({
      date: duplicateDate,
      food: 'Pizza',
    });

  assert.equal(second.status, 409);
  assert.equal(second.body.success, false);
  assert.match(second.body.message, /ya.*reservada|duplicada|ocupada/i);
});
