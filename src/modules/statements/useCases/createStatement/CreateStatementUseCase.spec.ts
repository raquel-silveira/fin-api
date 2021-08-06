import 'reflect-metadata';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { CreateStatementError } from './CreateStatementError';

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be to able to create a deposit statement", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Raquel',
      email: 'rsilveira136@gmail.com',
      password: await hash('123', 8)
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: 'Descrição',
      type: 'deposit' as OperationType,
      user_id: user.id
    });

    expect(statement).toHaveProperty('id');
    expect(statement.type).toEqual('deposit');
  });

  it("should be to able to create a withdraw statement", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Raquel',
      email: 'rsilveira136@gmail.com',
      password: await hash('123', 8)
    });

    await createStatementUseCase.execute({
      amount: 100,
      description: 'Descrição',
      type: 'deposit' as OperationType,
      user_id: user.id
    });

    const statement = await createStatementUseCase.execute({
      amount: 80,
      description: 'Descrição',
      type: 'withdraw' as OperationType,
      user_id: user.id
    });

    expect(statement).toHaveProperty('id');
    expect(statement.type).toEqual('withdraw');
  });

  it("should not be to able to create a statement if user not found", async() => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 80,
        description: 'Descrição',
        type: 'deposit' as OperationType,
        user_id: '123'
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should not be to able to create a statement if insufficient funds", async() => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'Raquel',
        email: 'rsilveira136@gmail.com',
        password: await hash('123', 8)
      });

      await createStatementUseCase.execute({
        amount: 100,
        description: 'Descrição',
        type: 'deposit' as OperationType,
        user_id: user.id
      });

      await createStatementUseCase.execute({
        amount: 180,
        description: 'Descrição',
        type: 'withdraw' as OperationType,
        user_id: user.id
      });
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
