class Employee {
    #identity;

    constructor(identity, name) {
        this.#identity = identity;
        this.name = name;
        //this.sayHello = this.sayHello.bind(this);
    }

    get identity() {
        return this.#identity;
    }

    set identity(new_identity) {
        if (new_identity < 0) {
            throw new Error("Identity cannot be negative!");
        }
        this.#identity = new_identity;
    }
    sayHello = () => {
        console.log(this);
        console.log(`Hello, my name is ${this.name}.`);
    }
}

let jack = new Employee(123456, "Jack");
jack.identity = -1;
console.log(jack.identity);

class Director extends Employee {
    constructor(identity, name, salary) {
        super(identity, name);
        this.salary = salary;
    }
}