type Iban = string;
type Money = number;

class Account {
    private readonly iban: Iban;
    protected balance: Money;

    constructor(iban: Iban, balance: Money) {
        this.iban = iban;
        this.balance = balance;
        this.withdraw(100);
    }

    get amount(): Money {
        return this.balance;
    }

    get id(): Iban {
        return this.iban;
    }

    deposit(amount: Money): void {
        this.balance += amount;
    }

    withdraw(amount: Money): void {
        console.log("Account::withdraw");
        this.balance -= amount;
    }
}

class CheckingAccount extends Account {
    private readonly overdraftAmount: Money;

    constructor(iban: Iban, balance: Money,overdraftAmount: Money = 1000) {
        super(iban, balance);
        this.overdraftAmount = overdraftAmount;
    }

    override withdraw(amount: Money): void {
        console.log("CheckingAccount::withdraw");
        this.balance -= amount;
    }
}

let acc1 = new CheckingAccount("tr1", 10_000);
acc1.deposit(100);
acc1.withdraw(500);
console.log(acc1.amount);