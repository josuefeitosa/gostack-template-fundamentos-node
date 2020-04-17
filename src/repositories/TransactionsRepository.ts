import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface FinalBalance {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): FinalBalance {
    try {
      return {
        transactions: this.transactions,
        balance: this.getBalance(),
      };
    } catch (error) {
      throw Error('Falha ao buscar transações.');
    }
  }

  public getBalance(): Balance {
    const { transactions } = this;

    const income = transactions.reduce((prevVal, transaction) => {
      return transaction.type === 'income'
        ? prevVal + transaction.value
        : prevVal;
    }, 0);
    const outcome = transactions.reduce((prevVal, transaction) => {
      return transaction.type === 'outcome'
        ? prevVal + transaction.value
        : prevVal;
    }, 0);
    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
