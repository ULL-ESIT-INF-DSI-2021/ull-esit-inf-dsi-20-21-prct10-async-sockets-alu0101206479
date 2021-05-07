import {EventEmitter} from 'events';
import * as net from 'net';
// import {Nota} from './nota';
import {ResponseType} from './types';
import {Usuario} from './usuario';


export class EventEmitterServer extends EventEmitter {
  private server: net.Server;

  constructor() {
    super();

    this.server = net.createServer((connection) => {
      console.log('\nUn cliente se ha conenctado\n');

      let mensajeTexto = '';
      connection.on('data', (parteMensaje) => {
        mensajeTexto += parteMensaje.toString();

        let messageLimit = mensajeTexto.indexOf('\n');

        while (messageLimit !== -1) {
          const message = mensajeTexto.substring(0, messageLimit);
          mensajeTexto = mensajeTexto.substring(messageLimit + 1);
          connection.emit('request', JSON.parse(message));
          messageLimit = mensajeTexto.indexOf('\n');
        }
      });

      let accion: boolean = true;
      connection.on('request', (mensaje) => {
        const usuario = new Usuario(mensaje.user);
        let respuesta: ResponseType;

        switch (mensaje.type) {
          case 'add':
            accion = usuario.añadirNota(mensaje.title, mensaje.body, mensaje.color);

            respuesta = {
              type: 'add',
              success: accion,
            };

            connection.write(`${JSON.stringify(respuesta)}\n`, () => {
              if (respuesta.success == true) {
                console.log(`Se ha procesado satisfactoriamente la petición "${respuesta.type}" del cliente y se ha enviado la respuesta a este\n`);
              } else {
                console.log(`No se ha podido procesar la petición satisfactoriamente "${respuesta.type}" del cliente y se ha enviado la respuesta a este\n`);
              }
              connection.end();
            });
            break;

          case 'update':
            let salida = '';
            if (typeof mensaje.newBody === 'string') {
              accion = usuario.modificarNota(mensaje.title, "cuerpo", mensaje.newBody);

              respuesta = {
                type: 'update',
                success: accion,
                modified: 'body',
              };

              salida = JSON.stringify(respuesta);
            }
            if (typeof mensaje.newColor === 'string') {
              accion = usuario.modificarNota(mensaje.title, "color", mensaje.newColor);

              respuesta = {
                type: 'update',
                success: accion,
                modified: 'color',
              };

              salida = JSON.stringify(respuesta);
            }
            if (typeof mensaje.newTitle === 'string') {
              accion = usuario.modificarNota(mensaje.title, "titulo", mensaje.newTitle);

              respuesta = {
                type: 'update',
                success: accion,
                modified: 'title',
              };

              salida = JSON.stringify(respuesta);
            }

            connection.write(`${salida}\n`, () => {
              if (respuesta.success == true) {
                console.log(`Se ha procesado satisfactoriamente la petición "${respuesta.type}" del cliente y se ha enviado la respuesta a este\n`);
              } else {
                console.log(`No se ha podido procesar la petición satisfactoriamente "${respuesta.type}" del cliente y se ha enviado la respuesta a este\n`);
              }
              connection.end();
            });
            break;

          default:
            break;
        }
      });

      connection.on('close', () => {
        console.log('Un cliente se ha desconectado\n');
      });
    });
  }

  public listen(puerto: number) {
    this.server.listen(puerto, () => {
      console.log('\nEsperando a que los clientes se conecten\n');
    });
  }
}
