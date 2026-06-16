const numbers: readonly number[] = [1, 2, 3];
// numbers = [4, 5, 6]; // error: const
// numbers.push(4, 5, 6); // error: readonly
// numbers[0] = 1001; // error: readonly
console.log(numbers);