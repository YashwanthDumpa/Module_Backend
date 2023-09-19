export {}
// websocket.ts
import * as WebSocket from 'ws';
import { Server } from 'http';

// Function to broadcast a message to all connected clients
// export const broadcastMessage = (wss: WebSocket.Server, message: string) => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ message }));
//     }
//   });
// };

// Initialize WebSocket server
export const initWebSocket = (server: Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    ws.send('Welcome to the Training Notification');

    ws.on('message', (message: string) => {
      // Handle incoming messages from clients if needed
      console.log(`Received message: ${message}`);
    });
  });

  return wss;
};
