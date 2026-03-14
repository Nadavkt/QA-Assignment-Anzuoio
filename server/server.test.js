// server.test.js
const net = require('net');
const { createServer } = require('./server');

const TEST_PORT = 5001;
let server;

beforeAll((done) => {
  server = createServer(TEST_PORT);
  setTimeout(done, 50);
});

afterAll((done) => {
  server.close(done);
});

test('Handshake: HELLO -> READY', (done) => {
  const client = net.createConnection({ port: TEST_PORT }, () => {
    client.write('HELLO\n');
  });

  let buffer = '';

  client.on('data', (data) => {
    buffer += data.toString('utf8');
    const idx = buffer.indexOf('\n');
    if (idx !== -1) {
      const line = buffer.slice(0, idx).trim();
      expect(line).toBe('READY');
      client.end();
    }
  });

  client.on('end', () => done());
  client.on('error', (err) => done(err));
});

test('Ping: HELLO then PING -> PONG', (done) => {
  const client = net.createConnection({ port: TEST_PORT }, () => {
    client.write('HELLO\n');
  });

  let buffer = '';
  let stage = 'AWAIT_READY';

  client.on('data', (data) => {
    buffer += data.toString('utf8');

    let idx;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);

      if (stage === 'AWAIT_READY') {
        expect(line).toBe('READY');
        stage = 'AWAIT_PONG';
        client.write('PING\n');
      } else if (stage === 'AWAIT_PONG') {
        expect(line).toBe('PONG');
        client.end();
      }
    }
  });

  client.on('end', () => done());
  client.on('error', (err) => done(err));
});

test('Invalid command: UNKNOWN_COMMAND -> ERROR', (done) => {
  const client = net.createConnection({ port: TEST_PORT }, () => {
    client.write('HELLO\n');
  });

  let buffer = '';
  let stage = 'AWAIT_READY';

  client.on('data', (data) => {
    buffer += data.toString('utf8');

    let idx;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);

      if (stage === 'AWAIT_READY') {
        expect(line).toBe('READY');
        stage = 'AWAIT_ERROR';
        client.write('UNKNOWN_COMMAND\n');
      } else if (stage === 'AWAIT_ERROR') {
        expect(line.startsWith('ERROR')).toBe(true);
        client.end();
      }
    }
  });

  client.on('end', () => done());
  client.on('error', (err) => done(err));
});

