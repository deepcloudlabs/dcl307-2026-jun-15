console.log("1. Start");
setTimeout(function() {
    console.log("5/6. setTimeout(): timer queue");
},0);
setImmediate( // after i/o
    function() {
        console.log("5/6. setImmediate()");
    }
)
Promise.resolve().then(
    function() { // microtask queue
        console.log("4. Microtask");
    }
)
process.nextTick(
    function() { // next tick queue
        console.log("3. process.nextTick()");
    }
)
console.log("2. End");