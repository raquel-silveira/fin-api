import 'reflect-metadata';

import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be to able to create user", async() => {
    const user = await createUserUseCase.execute({
      name: 'Raquel',
      email: 'rsilveira136@gmail.com',
      password: '123'
    });

    expect(user).toHaveProperty('id');
  });

  it("should not be to able to create a user if user already exists", async() => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Raquel',
        email: 'rsilveira136@gmail.com',
        password: '123'
      });

      await createUserUseCase.execute({
        name: 'Raquel',
        email: 'rsilveira136@gmail.com',
        password: '123'
      });
    }).rejects.toEqual(new CreateUserError());
  });
});
