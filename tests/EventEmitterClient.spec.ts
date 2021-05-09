import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterClient} from '../src/ejercicio-practica/cliente/EventEmitterClient';
import {ResponseType} from '../src/ejercicio-practica/types';

describe('Prueba de la clase EventEmitterClient', ()=> {
  it('Se debería emitir un evento response con todo el mensaje, aunque este se envíe por partes', ()=>{
    const socket = new EventEmitter();
    const client = new EventEmitterClient(socket);
    const nota = {
      title: "Red note",
      body: "This is a red note",
      color: "red",
    };

    client.on('response', (solicitud: ResponseType) => {
      expect(solicitud.type).to.be.equal("read");
      expect(solicitud.success).to.be.equal("true");
      expect(solicitud.notes).to.deep.equal([nota]);
      expect(solicitud.modified).to.be.equal("title");
    });

    socket.emit('data', '{"type": "read", ');
    socket.emit('data', `"success": "true", "notes": [${JSON.stringify(nota)}], `);
    socket.emit('data', `"modified": "title"}`);
    socket.emit('end');
  });
});
