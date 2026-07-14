import { useEffect, useRef } from "react";

export function useWebSocket(url, onMessage) {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => console.log("WS connected");
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          onMessage?.(data);
        } catch (err) {
          console.error(err);
        }
      };
      ws.onclose = () => {
        console.log("WS closed, retrying in 3s");
        reconnectRef.current = setTimeout(connect, 3000);
      };
      ws.onerror = (e) => console.error("WS error", e);
    }

    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [url]);

  const send = (data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { send, ws: wsRef };
}
