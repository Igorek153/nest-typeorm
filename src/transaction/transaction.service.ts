import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Transaction} from "./entities/transaction.entity";
import {Repository} from "typeorm";

@Injectable()
export class TransactionService {
  constructor(
      @InjectRepository(Transaction)
      private readonly transactionRepository: Repository<Transaction>
  ) {}
  async create(createTransactionDto: CreateTransactionDto, id: number ) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: {id : +createTransactionDto.category},
      user: {id}
    }
    if (!newTransaction) throw new BadRequestException('ERROR')
    return await this.transactionRepository.save(newTransaction)
  }

  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id }
      },
      order: {
        createdAt: 'DESC',
      }
    })
    return transactions
  }

  async findAllPagination(id: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [transactions, totalCount] = await this.transactionRepository.findAndCount({
      where: { user: {id} },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });


    const totalPages = Math.ceil(totalCount / limit);

    return {
      transactions,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

}
