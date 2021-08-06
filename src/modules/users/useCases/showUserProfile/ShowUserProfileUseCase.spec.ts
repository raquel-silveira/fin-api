import 'reflect-metadata';
import { hash } from 'bcryptjs';

import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be to able to show user profile", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Raquel',
      email: 'rsilveira136@gmail.com',
      password: await hash('123', 8)
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty('id');
  });

  it("should not be to able to show user profile if user not found", async() => {
    expect(async () => {
      await showUserProfileUseCase.execute('123');
    }).rejects.toEqual(new ShowUserProfileError());
  });
});
