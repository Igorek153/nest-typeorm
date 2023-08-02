import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req, Query
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req ) {
    return this.transactionService.create(createTransactionDto, +req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.transactionService.findAll(+req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pagination')
  findAllPagination(@Req() req, @Query('page') page: number, @Query('limit') limit: number) {
    return this.transactionService.findAllPagination(+req.user.id, +page, +limit )
  }
}
