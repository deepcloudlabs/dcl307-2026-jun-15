function fun(x: number,y: number,z: number) : number {
    return x+y*z;
}

console.log(fun(1,2,3));

let x : string | number ;

let numbers : number[];

numbers = [1,2,3,4,5];

numbers.push(6);

type alfa_numeric = string | number;

let y : alfa_numeric;
y = "two";

y = 42;
