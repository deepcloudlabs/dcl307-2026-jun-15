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

/*
let x = circle1.x;
let y = circle1.y;
let radius = circle1.radius;
*/

let {x,y,radius} = circle1;
console.log(x,y,radius);