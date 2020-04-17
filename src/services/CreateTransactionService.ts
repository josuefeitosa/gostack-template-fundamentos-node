import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const balance = this.transactionsRepository.getBalance();

    if (type !== 'income' && type !== 'outcome')
      throw Error('Tipo de transação inválido. Utilizar income ou outcome.');

    if (typeof value !== 'number')
      throw Error('Formato de value incorreto. Utilizar formato de número.');

    if (type === 'outcome' && balance.total - value <= 0)
      throw Error(
        'Não é possível fazer esta transação por não ter valor disponível em caixa!',
      );

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
