import 'reflect-metadata';
import { hash } from 'bcryptjs';

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationError } from './GetStatementOperationError';

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it("should be to able to get statement operation", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Raquel',
      email: 'rsilveira136@gmail.com',
      password: await hash('123', 8)
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: 'Descrição',
      type: 'deposit' as OperationType,
      user_id: user.id
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: user.id
    });

    expect(statementOperation).toHaveProperty('id');
  });

  it("should not be to able to get statement operation if user not found", async() => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'Raquel',
        email: 'rsilveira136@gmail.com',
        password: await hash('123', 8)
      });

      const statement = await inMemoryStatementsRepository.create({
        amount: 100,
        description: 'Descrição',
        type: 'deposit' as OperationType,
        user_id: user.id
      })

      await getStatementOperationUseCase.execute({
        statement_id: statement.id,
        user_id: '123'
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be to able to get statement operation if statement not found", async() => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'Raquel',
        email: 'rsilveira136@gmail.com',
        password: await hash('123', 8)
      });

      await getStatementOperationUseCase.execute({
        statement_id: '123',
        user_id: user.id
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
