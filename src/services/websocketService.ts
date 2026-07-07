import { tokenStorage } from "../utils/tokenStorage";

export class WebSocketService {
  private ws: WebSocket | null = null;

  connect() {
    this.ws = new WebSocket("ws://localhost:8000/ws/query");

    this.ws.onopen = () => {
      const token = tokenStorage.getAccessToken();

      this.ws?.send(
        JSON.stringify({
          type: "authenticate",
          token,
        }),
      );
    };
  }

  authenticate(token: string) {
    this.ws?.send(
      JSON.stringify({
        type: "authenticate",
        token,
      }),
    );
  }

  sendQuery(query: string) {
    this.ws?.send(
      JSON.stringify({
        type: "query",
        query,
      }),
    );
  }
}
