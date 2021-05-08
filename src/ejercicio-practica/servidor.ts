import {EventEmitterServer} from './EventEmitterServer';
import * as net from 'net';
import {ResponseType} from './types';
import {Usuario} from './usuario';

const server = net.createServer((connection) => {
  console.log('\nUn cliente se ha conenctado\n');

  const emitter = new EventEmitterServer(connection);

  let accion: boolean = true;

  /**
   * Manejador para cuando el objeto EventEmitterServer emite el evento 'request'
   */
  emitter.on('request', (mensaje) => {
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

      case 'remove':
        accion = usuario.borrarNota(mensaje.title);

        respuesta = {
          type: 'remove',
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

      case 'list':
        const notas = usuario.listarNotas();

        respuesta = {
          type: 'list',
          success: true,
          notes: [],
        };

        notas.forEach((nota) => {
          if (respuesta.notes != undefined) {
            respuesta.notes.push({title: nota.getTitulo(), body: nota.getCuerpo(), color: nota.getColor()});
          }
        });

        connection.write(`${JSON.stringify(respuesta)}\n`, () => {
          if (respuesta.success == true) {
            console.log(`Se ha procesado satisfactoriamente la petición "${respuesta.type}" del cliente y se ha enviado la respuesta a este\n`);
          } else {
            console.log(`No se ha podido procesar la petición satisfactoriamente "${respuesta.type}" del cliente y se ha enviado la respuesta a este\n`);
          }
          connection.end();
        });
        break;

      case 'read':
        const nota = usuario.leerNota(mensaje.title);

        respuesta = {
          type: 'read',
          success: nota.success,
          notes: [{title: nota.nota.getTitulo(), body: nota.nota.getCuerpo(), color: nota.nota.getColor()}],
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

      default:
        break;
    }
  });

  /**
   * Manejador para cuando el socket emite el evento close (Cuando se desconecta un cliente)
   */
  connection.on('close', () => {
    console.log('Un cliente se ha desconectado\n');
  });
});

/**
 * Se pone el server a escuchar en el puerto 60300
 */
server.listen(60300, () => {
  console.log('\nEsperando a que los clientes se conecten\n');
});
