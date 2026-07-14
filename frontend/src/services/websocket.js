export class WebSocketService {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnect = 5;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.listeners.forEach((cb) => cb({ type: "connected" }));
      };

      this.ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          this.listeners.forEach((cb) => cb(data));
        } catch (err) {
          console.error("WS parse error", err);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed");
        if (this.reconnectAttempts < this.maxReconnect) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), 3000 * this.reconnectAttempts);
        }
      };

      this.ws.onerror = (e) => console.error("WS error", e);
    } catch (err) {
      console.error("WS connect failed", err);
    }
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  disconnect() {
    this.ws?.close();
    this.listeners.clear();
  }
}

export default WebSocketService;
