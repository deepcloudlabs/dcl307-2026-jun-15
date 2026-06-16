let circle = {
    radius: 1,
    x: 10,
    y: 20,
    area: function () {
        return Math.PI * this.radius ** 2;
    },
    circumference: function () {
        return 2 * Math.PI * this.radius;
    }
}
circle.color = "red";
console.log(circle.area());
console.log(circle.circumference());
console.log(circle.radius);
console.log(circle.x);
console.log(circle.y);