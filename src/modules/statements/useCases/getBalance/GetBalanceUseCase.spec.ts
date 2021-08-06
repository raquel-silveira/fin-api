import 'reflect-metadata';
import { hash } from 'bcryptjs';

import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

let getBalanceUseCase: GetBalanceUseCase;
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
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be to able to get user balance", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Raquel',
      email: 'rsilveira136@gmail.com',
      password: await hash('123', 8)
    });

    await inMemoryStatementsRepository.create({
      amount: 100,
      description: 'Descrição',
      type: 'deposit' as OperationType,
      user_id: user.id
    })

    const userBalance = await getBalanceUseCase.execute({
      user_id: user.id
    });

    expect(userBalance.balance).toEqual(100);
  });

  it("should not be to able to create a statement if user not found", async() => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: '123'
      });
    }).rejects.toEqual(new GetBalanceError());
  });
});
