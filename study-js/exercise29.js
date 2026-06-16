class Employee {
    constructor(identity, name) {
        this.identity = identity;
        this.name = name;
        //this.sayHello = this.sayHello.bind(this);
    }

    sayHello = () => {
        console.log(this);
        console.log(`Hello, my name is ${this.name}.`);
    }
}

let jack = new Employee(123456, "Jack");
jack.sayHello();
setInterval(jack.sayHello, 3_000);