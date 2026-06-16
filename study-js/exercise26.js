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

for (let field in circle1){ // reflection
    if (typeof circle1[field] === "function") continue;
    console.log(`${field}: ${circle1[field]}`);
}
