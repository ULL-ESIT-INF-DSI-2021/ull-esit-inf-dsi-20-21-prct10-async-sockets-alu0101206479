import {EventEmitter} from 'events';
import * as net from 'net';

/**
 * ```typescript
 * // Ejemplo de creación
 *  const emitter = new EventEmitterServer(connection);
 * ```
 * Clase que sirve para que el servidor se pueda conectar correctamente con el cliente y soluciona el problema del envío de mensajes por partes
 */
export class EventEmitterServer extends EventEmitter {
  private server: net.Server;

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  const emitter = new EventEmitterServer(connection);
   * ```
   * Constructor de la clase EventEmitterServer
   * @param connection Objeto EventEmitter (Socket)
   */
  constructor(connection: EventEmitter) {
    super();

    let mensajeTexto = '';
    connection.on('data', (parteMensaje) => {
      mensajeTexto += parteMensaje.toString();

      let messageLimit = mensajeTexto.indexOf('\n');

      while (messageLimit !== -1) {
        const message = mensajeTexto.substring(0, messageLimit);
        mensajeTexto = mensajeTexto.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message));
        messageLimit = mensajeTexto.indexOf('\n');
      }
    });
  }
}
