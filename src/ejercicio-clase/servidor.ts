import * as net from 'net';

  net.createServer((connection) => {
    console.log('A client has connected.');

    connection.write(`Connection established: watching file ssss.\n`);

      connection.write(`Size of file 32 was 30.\n`);
      connection.write(`Size of file aaa now is sss.\n`);


    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });

