// server.js
const net = require('net');
const CommandHandler = require('./commandHandler');

const PORT = 4000;

function createServer(port = PORT) {
  const server = net.createServer((socket) => {
    console.log('Client connected from', socket.remoteAddress, socket.remotePort);

    const commandHandler = new CommandHandler();
    let buffer = '';
    let handshakeDone = false;

    const send = (message) => {
      const line = message + '\n';
      console.log('Outgoing:', message);
      socket.write(line);
    };

    socket.on('data', (data) => {
      buffer += data.toString('utf8');

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const rawLine = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        const line = rawLine.trim();
        if (!line) continue;

        console.log('Incoming:', line);

        if (!handshakeDone) {
          if (line === 'HELLO') {
            handshakeDone = true;
            send('READY');
          } else {
            send('ERROR EXPECTED_HELLO');
          }
        } else {
          const response = commandHandler.handle(line);
          if (response) {
            send(response);
          }
        }
      }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);
    });
  });

  server.listen(port, () => {
    console.log(`TCP server listening on port ${port}`);
  });

  return server;
}

if (require.main === module) {
  createServer();
}

module.exports = { createServer };

