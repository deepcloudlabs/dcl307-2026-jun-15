class Circle {
    private readonly x: number;
    readonly y: number;
    private radius: number;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    area(): number {
        return Math.PI * this.radius * this.radius;
    }

    circumference(): number {
        return 2.0 * Math.PI * this.radius;
    }

}

let circle1 = new Circle(10, 20, 5);
console.log(circle1.area());
console.log(circle1.circumference());
// console.log(circle1.x); // error -> private
// circle1.radius++; // error -> private
// circle1.x = 100; // error -> read-only