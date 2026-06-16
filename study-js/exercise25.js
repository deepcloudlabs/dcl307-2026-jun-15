function fun(x, y, z, t) {
    return x + y * z - t;
}

function gun(p={x:1,y:2,z:3,t:3}) {
    return p.x + p.y * p.z - p.t;
}

function sun({x, y, z, t=3}) {
    return x + y * z - t;
}

console.log(fun(1,2,3,4))
console.log(gun({
    x: 1,
    y: 2,
    z: 3
}))
console.log(sun({x:1,y:2,z:3,t:4}))