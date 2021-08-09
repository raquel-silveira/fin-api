import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate user', async () => {
    const user = await request(app).post('/api/v1/users').send({
      name: 'Raquel',
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
  });

  it('should not be able to authenticate a non existing user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'admin2@finap.com.br',
      password: 'admin',
    });

    expect(response.status).toBe(401);
  });
});
