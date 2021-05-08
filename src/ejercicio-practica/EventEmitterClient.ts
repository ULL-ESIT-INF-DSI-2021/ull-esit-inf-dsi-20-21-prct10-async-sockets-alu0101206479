import {EventEmitter} from 'events';

/**
 * ```typescript
 * // Ejemplo de creación
 *  const emitter = new EventEmitterClient(net.connect({port: 60300}));
 * ```
 * Clase que sirve para que el cliente se pueda conectar correctamente con el servidor
 */
export class EventEmitterClient extends EventEmitter {
  /**
   * ```typescript
   * // Ejemplo de llamada
   *  const emitter = new EventEmitterClient(net.connect({port: 60300}));
   * ```
   * Constructor de la clase EventEmitterClient
   * @param connection Objeto EventEmitter (Socket)
   */
  constructor(connection: EventEmitter) {
    super();

    let mensajeTexto = '';
    connection.on('data', (parteMensaje) => {
      mensajeTexto += parteMensaje.toString();
    });

    connection.on('end', () => {
      this.emit('response', JSON.parse(mensajeTexto));
    });
  }
}
