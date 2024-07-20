import { WebSocketServer } from "ws";
import { MsgType, SocketToMeBbg } from "./socket-it-to-me-babby-girl";

const wss = new WebSocketServer({ port: 42069 });
const ws = new SocketToMeBbg(wss);

ws.on("message", message => {
    console.log("Received: ", message);
    ws.emit("message", {
        Message: "Hello from the server!",
        MsgType: MsgType.ALL,
        From: "Server"
    });
})
