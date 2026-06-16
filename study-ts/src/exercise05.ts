type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
const multiply: Calculator = (a, b) => a * b;

console.log(add(1, 2));

// Higher order function
function exec(fn: Calculator, a: number, b: number) {
    return fn(a, b);
}

console.log(exec(add, 10, 20));
console.log(exec(multiply, 10, 20));
