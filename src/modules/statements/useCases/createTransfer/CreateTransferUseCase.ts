import { inject, injectable } from "tsyringe";
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { CreateTransferError } from "./CreateTransferError";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, user_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(sender_id);

    if(!user) {
      throw new CreateTransferError.UserNotFound();
    }

    if(user_id === sender_id) {
      throw new CreateTransferError.OperationNotPermitted();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    const transferOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return transferOperation;
  }
}
