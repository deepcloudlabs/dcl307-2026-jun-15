import WebSocket from "ws";

const wssUrlBinance = "wss://stream.binance.com:9443/ws/btcusdt@trade";
const webSocket = new WebSocket(wssUrlBinance);

class Trade {
    constructor({s,p,q,T,E,t}) {
        this.symbol = s;
        this.quantity = Number(q);
        this.price = Number(p);
        this.volume = this.price * this.quantity;
        this.volume = this.volume.toFixed(8);
        this.timestamp = new Date(T);
        this.eventId = E;
        this.sequence = t;
    }
}

const trades = [];

webSocket.on("open", function() {
    console.log("Opened");
    setInterval(function() {
        let total_volume = trades.map( a_trade => a_trade.volume )
            .map( v => Number(v) )
            .reduce((a, b) => a + b, 0);
        let average_volume = total_volume / trades.length;
        console.log(`Total volume: ${total_volume}, Average volume: ${average_volume}`);
        trades.splice(0);

    }, 30_000);
})

webSocket.on("message", function(payload) {
    let trade = new Trade(JSON.parse(payload.toString()));
    trades.push(trade);
    /*
    if (trades.length >= 100) {
        let total_volume = trades.map( a_trade => a_trade.volume )
                                 .map( v => Number(v) )
                                 .reduce((a, b) => a + b, 0);
        let average_volume = total_volume / trades.length;
        console.log(`Total volume: ${total_volume}, Average volume: ${average_volume}`);
        trades.splice(0);
    }

     */
})
