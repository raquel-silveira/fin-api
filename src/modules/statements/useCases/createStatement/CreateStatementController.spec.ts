import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create user deposit statement', async () => {
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

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'Deposit'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toBe('deposit');
  });

  it('should be able to create user withdraw statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: 'Withdraw'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toBe('withdraw');
  });

  it('should not be able to create a non existing user deposit statement', async () => {
    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'Deposit'
    }).set({
      Authorization: `Bearer 123`,
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to create a non existing user withdraw statement', async () => {
    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: 'Withdraw'
    }).set({
      Authorization: `Bearer 123`,
    });

    expect(response.status).toBe(401);
  });
});
