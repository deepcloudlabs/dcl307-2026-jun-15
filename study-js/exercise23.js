let numbers1 = [1,2,3,4,5];
let numbers2 = [...numbers1];
numbers2.push(42);
console.log(numbers1);
console.log(numbers2);

/*
let first = numbers1[0];
let second = numbers1[1];
let rest = numbers1.slice(2);
*/
let [first,second,...rest] = numbers1;
console.log(first);
console.log(second);
console.log(rest);