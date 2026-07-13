const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const app = require('../src/app')

test('GET /api/health responde 200 com status UP', async () => {
  const response = await request(app).get('/api/health')

  assert.equal(response.status, 200)
  assert.equal(response.body.status, 'UP')
  assert.ok(response.body.timestamp)
})

test('rota protegida sem token responde 401', async () => {
  const response = await request(app).get('/api/biblioteca')

  assert.equal(response.status, 401)
})
