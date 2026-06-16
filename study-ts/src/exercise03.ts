function gun(
    name: string,
    age: number | undefined = 42
) : void {
    console.log(name, age);
}

gun("jack")
gun("jack", 42)
