import { WebSocketServer } from "ws";
import { SocketToMeBbg } from "./websokects";

const wss = new WebSocketServer({ port: 8080 });
const ws = new SocketToMeBbg(wss);

ws.on("message", message => {
    console.log("Received: ", message);
})
