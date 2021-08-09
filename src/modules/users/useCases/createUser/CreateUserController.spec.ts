import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Raquel',
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create user if email already exists', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Raquel',
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    expect(response.status).toBe(400);
  });
});
