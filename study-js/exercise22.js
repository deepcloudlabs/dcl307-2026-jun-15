let circle1 = {
    radius: 1,
    x: 10,
    y: 20,
    style: {
        thickness: 10,
        value: "solid",
        color: "red"
    },
    area: function () {
        return Math.PI * this.radius ** 2;
    },
    circumference: function () {
        return 2 * Math.PI * this.radius;
    }
}

let circle2 = {...circle1};
circle2.style = {...circle1.style};
circle2.style.thickness = 200;
console.log(circle1.style.thickness);
console.log(circle2.style.thickness);
