import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe('Get Statement Operation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get deposit statement operation', async () => {
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

    const responseDeposit = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'Deposit'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/api/v1/statements/${responseDeposit.body.id}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toBe('deposit');
  });

  it('should be able to get withdraw statement operation', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseDeposit = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: 'Withdraw'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/api/v1/statements/${responseDeposit.body.id}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toBe('withdraw');
  });

  it('should not be able to get a non exiting user statement operation', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseDeposit = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'Deposit'
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/api/v1/statements/${responseDeposit.body.id}`).set({
      Authorization: `Bearer 123`,
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to get a non exiting statement operation', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finap.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/statements/c8a4d2c9-e873-4381-a9b1-1ecb3f1f941e').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(404);
  });
});
