import * as net from 'net';

if (process.argv.length < 3) {
  console.log('No se ha especificado ningún comando por la línea de comandos');
} else {
  const client = net.connect({port: 60300});

  const comando = {
    comando: process.argv[2],
    argumentos: [''],
  };

  comando.argumentos.pop();
  for (let i = 3; i < process.argv.length; i++) {
    comando.argumentos.push(process.argv[i]);
  }

  client.write(JSON.stringify(comando), () => {
    client.end();
  });

  let resultadoTexto = '';
  client.on('data', (parte) => {
    resultadoTexto += parte;
  });
  console.log(resultadoTexto);
  client.on('end', () => {
    console.log(resultadoTexto);
  });
}

