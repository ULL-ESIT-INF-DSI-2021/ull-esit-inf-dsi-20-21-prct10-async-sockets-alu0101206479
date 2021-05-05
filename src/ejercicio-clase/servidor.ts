import {spawn} from 'child_process';
import * as net from 'net';


const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('\nUn cliente se ha conectado\n');

  let comandoTexto = '';
  connection.on('data', (parte) => {
    comandoTexto += parte;
  });

  connection.on('end', () => {
    const comando = JSON.parse(comandoTexto);

    const ejecucion = spawn(comando.comando, comando.argumentos);

    let salida = '';
    ejecucion.stdout.on('data', (piece) => salida += piece);

    ejecucion.on('error', () => {
      connection.write(`Se ha producido un error al ejecutar el comando "${comando.comando}" debido a que este no existe\n`, () => {
        connection.end();
      });
    });

    ejecucion.on('close', (codigo, error) => {
      console.log("Se ha ejecutado el comando y se ha mandado la salida de este al cliente\n");
      if (codigo == 0) {
        connection.write(`Salida del comando: \n${salida}\n`, () => {
          connection.end();
        });
      } else {
        connection.write(`Se ha producido un error, puede ser debido a los parámetros del comando\n`, () => {
          connection.end();
        });
      }
    });
  });

  connection.on('close', () => {
    console.log('Un cliente se ha desconectado\n');
  });
});

server.listen(60300, () => {
  console.log('Esperando a que los clientes se conecten');
});
