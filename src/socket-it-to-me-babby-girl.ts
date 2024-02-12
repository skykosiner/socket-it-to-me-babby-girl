import WebSocket, { WebSocketServer } from "ws";
import EventEmitter from "events";

export enum MsgType {
    ALL = "all",
    PRIVATE = "private",
    USERNAME = "username"
}

export type Message = {
    from: string,
    message: string,
    type: MsgType,
    to?: string
}

export class SocketToMeBbg extends EventEmitter {
    private connections: { [key: string]: WebSocket } = {}; // Changed to use object for faster lookup
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
            ws.on("message", message => {
                const msg: Message = JSON.parse(message.toString());

                if (msg.type === MsgType.USERNAME) {
                    console.log("New connection", msg.from);
                    this.addConnection(ws, msg.from);
                } else if (msg.type === MsgType.ALL) {
                    this.broadcast(msg, ws)
                } else if (msg.type === MsgType.PRIVATE) {
                    for (const [username, connection] of Object.entries(this.connections)) {
                        if (username === msg.to) {
                            connection.send(JSON.stringify(msg));
                        }
                    }
                }

                this.emit("message", msg);
            })

            ws.on("close", () => {
                this.removeConnection(ws);
            });
        })
    }

    private addConnection(ws: WebSocket, username: string) {
        this.connections[username] = ws;
    }

    private removeConnection(ws: WebSocket) {
        const username = Object.keys(this.connections).find(key => this.connections[key] === ws);
        if (username) {
            delete this.connections[username];
        }
    }

    public broadcast(msg: Message, client: WebSocket) {
        Object.values(this.connections).forEach(conn => {
            if (conn !== client) {
                conn.send(JSON.stringify(msg));
            }
        });
    }
}
