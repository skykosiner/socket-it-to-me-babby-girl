import { useState, useEffect } from "react";

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

export default function App(): JSX.Element {
    const [connetiocn, setConnection] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>("");

    const [sendType, setSendType] = useState<MsgType>(MsgType.ALL);
    const [messageToSend, setMessageToSend] = useState<string>("");
    const [sendTo, setSendTo] = useState<string>("");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:42069/ws");

        ws.onopen = () => {
            const messageToSend: Message = {
                from: "Sky",
                message: "She suck my socket till I blow my bits in her tcp stream",
                type: MsgType.USERNAME
            }

            ws.send(JSON.stringify(messageToSend));
            setConnection(ws);
        };

        ws.onclose = () => {
            console.log("disconnected");
            setConnection(null);
        };

        ws.onmessage = msg => {
            console.log(msg.data);
            setMessage(msg.data);
        };

        return () => {
            ws.close();
        };
    }, [])

    function sendMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!connetiocn) {
            return;
        }

        const msg: Message = {
            from: "Sky",
            message: messageToSend,
            type: sendType,
            to: sendTo
        }

        connetiocn.send(JSON.stringify(msg));
    }


    return (
        <div>
            <form onSubmit={sendMessage}>
                <input type="text" name="message: " value={messageToSend} onChange={e => setMessageToSend(e.target.value)} />
                <button onClick={() => setSendType(MsgType.ALL)}>Send All</button>
                <button onClick={() => setSendType(MsgType.PRIVATE)}>Send Private</button>

                {sendType === MsgType.PRIVATE && <input type="text" name="to: " value={sendTo} onChange={e => setSendTo(e.target.value)} />}
                <button type="submit">Send</button>
            </form>

            {message && <p>{message}</p>}
        </div >
    )
}
