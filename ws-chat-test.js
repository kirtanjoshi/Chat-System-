import ws from 'k6/ws';
import { check, sleep } from 'k6';

export let options = {
  vus: 5,           // Number of virtual users
  duration: '20s',  // Test duration
};

export default function () {
  const url = 'ws://localhost:3000/socket.io/?EIO=4&transport=websocket';

  const response = ws.connect(url, {}, function (socket) {
    socket.on('open', () => {
      console.log('Connected');

      // Here you can send events using socket.emit, example:
      socket.emit('joinRoom', 1); // join room 1

      // Send a test group message after joining
      socket.emit('sendGroupMessage', {
        roomId: 1,
        senderId: 1,
        content: 'Hello from k6!',
      });

      // Listen for groupMessage event from server
      socket.on('groupMessage', (message) => {
        console.log('Received groupMessage:', JSON.stringify(message));
      });

      // Close connection after 5 seconds
      setTimeout(() => socket.close(), 5000);
    });

    socket.on('error', (e) => {
      console.log('Error:', e);
    });

    socket.on('close', () => {
      console.log('Disconnected');
    });
  });

  check(response, {
    'Connected successfully': (r) => r && r.status === 101,
  });

  sleep(1);
}
