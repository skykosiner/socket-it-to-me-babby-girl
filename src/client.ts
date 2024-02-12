import { Message, MsgType } from "./socket-it-to-me-babby-girl";
import WebSocket from "ws";

const wsc = new WebSocket('ws://localhost:42069');

wsc.on("open", () => {
    const messageToSend: Message = {
        from: "Client test",
        message: "She suck my socket till I blow my bits in her tcp stream",
        type: MsgType.USERNAME
    }

    wsc.send(JSON.stringify(messageToSend));
})

wsc.on("error", err => {
    console.error("Error: ", err);
})

wsc.on("message", message => {
    // Parse the masseg to the Message type
    const msg: Message = JSON.parse(message.toString());
    console.log(`From: ${msg.from}, Message: ${msg.message}`);
})

wsc.on("close", () => {
    console.log("Connection closed");
})
