import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterServer} from '../src/ejercicio-practica/servidor/EventEmitterServer';
import {RequestType} from '../src/ejercicio-practica/types';

describe('Prueba de la clase EventEmitterServer', ()=> {
  it('Se debería emitir un evento request con todo el mensaje, aunque este se envíe por partes', ()=>{
    const socket = new EventEmitter();
    const server = new EventEmitterServer(socket);

    server.on('request', (solicitud: RequestType) => {
      expect(solicitud.type).to.be.equal("add");
      expect(solicitud.user).to.be.equal("alu0101206479");
      expect(solicitud.title).to.be.equal("Red note");
      expect(solicitud.body).to.be.equal("This is a red note");
      expect(solicitud.color).to.be.equal("red");
    });

    socket.emit('data', '{"type": "add",');
    socket.emit('data', ' "user": "alu0101206479", ');
    socket.emit('data', `"title": "Red note", `);
    socket.emit('data', `"body": "This is a red note"`);
    socket.emit('data', `, "color": "red"}\n`);
  });
});
