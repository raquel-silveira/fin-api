import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get user balance', async () => {
    const user = await request(app).post('/api/v1/users').send({
      name: 'Raquel',
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('balance');
  });

  it('should not be able to show a non existing user profile', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer 123`,
    });

    expect(response.status).toBe(401);
  });
});
