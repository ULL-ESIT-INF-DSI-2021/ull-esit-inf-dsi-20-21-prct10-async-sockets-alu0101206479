import * as net from 'net';

const client = net.connect({port: 60300});

client.on('data', (dataJSON) => {

    console.log(`Connection established: watching file ${dataJSON}`);

    console.log('File has been modified.');
    console.log(`Previous size`);
    console.log(`Current size:`);
});