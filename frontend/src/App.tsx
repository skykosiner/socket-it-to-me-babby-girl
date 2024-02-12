import { useState, useEffect } from "react";

export default function App(): JSX.Element {
    const [connetiocn, setConnection] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:42069/ws");

        ws.onopen = () => {
            console.log("connected");
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

    return (
        <div>
            {message && <p>{message}</p>}
        </div>
    )
}
