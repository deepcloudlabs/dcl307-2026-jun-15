type User = { name: string, age: number }

type ReadonlyUser = Readonly<User>;

const jack : ReadonlyUser = { name: 'Jack', age: 65 };
// jack.name = 'Jill'; // Error: Cannot assign to 'name' because it is a read-only property.
// jack.age = 42; // Error: Cannot assign to 'age' because it is a read-only property.