class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius ** 2;
    }

    circumference() {
        return 2 * Math.PI * this.radius;
    }

}

Circle.prototype.color = "black";
Circle.prototype.print = function () {
    console.log(`x: ${this.x}, y: ${this.y}, radius: ${this.radius}`);
}
Circle.prototype.toString = function () {
    return `x: ${this.x}, y: ${this.y}, radius: ${this.radius}`;
}
let circle1 = new Circle(10, 20, 1);
let circle2 = new Circle(20, 30, 10);
console.log(circle1.area()); // area(circle1)
console.log(circle2.circumference());
circle1.color = "red";
console.log(circle1.hasOwnProperty("color"));
console.log(circle1.color);
console.log(circle2.hasOwnProperty("color"));
console.log(circle2.color);
console.log(circle1.toString());
delete Circle.prototype.color;
delete circle1.color;
console.log(circle2.color);
