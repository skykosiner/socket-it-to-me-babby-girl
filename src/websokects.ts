import WebSocket, { WebSocketServer } from "ws";
import EventEmitter from "events";

/* const wss = new WebSocketServer({ port: 8080 });

wss.on("error", function(err) {
    console.error("Error: ", err);
})

wss.on("connection", function(ws) {
    console.log("Client connected");
    console.log(ws);

    ws.on("message", function(message) {
        console.log("Received: ", message);
    })

    ws.send("Hey bbg, I'm the server you want bbg 😉");
}) */


export class SocketToMeBbg extends EventEmitter {
    // Implent me daddy
    private connections: WebSocket[] = [];
    private wss: WebSocketServer;

    constructor(wss: WebSocketServer) {
        super();
        this.wss = wss;

        this.wss.on("error", err => {
            console.error("Error: ", err);
        });

        this.start();
    }

    private start() {
        this.wss.on("connection", ws => {
            this.addConnection(ws);
            ws.on("message", message => {
                this.emit("message", message.toString());
            });

            ws.on("close", () => {
                this.removeConnection(ws);
            });
        })
    }

    private addConnection(ws: WebSocket) {
        this.connections.push(ws);
    }

    private removeConnection(ws: WebSocket) {
        this.connections = this.connections.filter(conn => conn !== ws);
    }

    public broadcast(message: string) {
        this.connections.forEach(conn => conn.send(message));
    }
}
