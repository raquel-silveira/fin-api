import { container } from 'tsyringe';
import { Request, Response } from "express";

import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  TRANSFER = 'transfer',
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const type = 'transfer' as OperationType;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      sender_id,
      user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(transfer);
  }
}

