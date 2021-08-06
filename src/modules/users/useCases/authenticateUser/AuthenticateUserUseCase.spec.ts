import { hash } from 'bcryptjs';

import '../../../../config/dotenv';

import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be to able to authenticate user", async() => {
    await inMemoryUsersRepository.create({
      email: 'rsilveira136@gmail.com',
      name: 'Raquel',
      password: await hash('123', 8),
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: 'rsilveira136@gmail.com',
      password: '123'
    });

    expect(authenticatedUser).toHaveProperty('token');
  });

  it("should not be to able to authenticate a non existing user", async() => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'rsilveira136@gmail.com',
        password: '123'
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be to able to authenticate a user if wrong password", async() => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        email: 'rsilveira136@gmail.com',
        name: 'Raquel',
        password: await hash('123', 8),
      });

      await authenticateUserUseCase.execute({
        email: 'rsilveira136@gmail.com',
        password: '1234'
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
