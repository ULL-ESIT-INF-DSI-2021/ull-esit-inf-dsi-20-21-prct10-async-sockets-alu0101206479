import * as net from 'net';


const server = net.createServer((connection) => {
  console.log('A client has connected.');

  let comando = '';
  connection.on('data', (parte) => {
    comando += parte;
  });

  connection.on('end', () => {
    const message = JSON.parse(comando);
    console.log(message);
  });

  connection.on('close', () => {
    console.log('A client has disconnected');
  });
});

server.listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
