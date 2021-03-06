import * as net from 'net';
import yargs = require('yargs');
import * as chalk from 'chalk';
import {ResponseType, RequestType} from '../types';
import {EventEmitterClient} from './EventEmitterClient';

if (process.argv.length < 3) {
  console.log('\nNo se ha especificado ningún comando por la línea de comandos\n');
} else {
  const client = net.connect({port: 60300});
  const emitter = new EventEmitterClient(client);

  /**
   * Manejador para cuando el objeto EventEmitterClient emite el evento 'response'
   */
  emitter.on('response', (respuesta: ResponseType) => {
    switch (respuesta.type) {
      case 'add':
        if (respuesta.success == true) {
          console.log(chalk.green('\nNew note added!\n'));
        } else {
          console.log(chalk.red("\nNote title taken!\n"));
        }
        break;

      case 'update':
        if (respuesta.success == true) {
          if (respuesta.modified == "title") {
            console.log(chalk.green('\nNote title modified!\n'));
          }
          if (respuesta.modified == "body") {
            console.log(chalk.green('\nNote body modified!\n'));
          }
          if (respuesta.modified == "color") {
            console.log(chalk.green('\nNote color modified!\n'));
          }
        } else {
          console.log(chalk.red("\nNo note found\n"));
        }
        break;

      case 'remove':
        if (respuesta.success == true) {
          console.log(chalk.green('\nNote removed!\n'));
        } else {
          console.log(chalk.red("\nNo note found\n"));
        }
        break;

      case 'list':
        console.log("\nYour notes\n");
        if (respuesta.notes == undefined || respuesta.notes == []) {
          console.log(chalk.red(`The user haven't notes`));
        } else {
          respuesta.notes.forEach((nota) => {
            switch (nota.color) {
              case "red":
                console.log(chalk.red(`${nota.title}`));
                break;
              case "green":
                console.log(chalk.green(`${nota.title}`));
                break;
              case "blue":
                console.log(chalk.blue(`${nota.title}`));
                break;
              case "yellow":
                console.log(chalk.yellow(`${nota.title}`));
                break;
              default:
                break;
            }
          });
        }
        console.log();
        break;

      case 'read':
        if (respuesta.success == true) {
          if (respuesta.notes != undefined) {
            switch (respuesta.notes[0].color) {
              case "red":
                console.log(chalk.red(`\n${respuesta.notes[0].title}`));
                console.log(chalk.red(`${respuesta.notes[0].body}\n`));
                break;
              case "green":
                console.log(chalk.green(`\n${respuesta.notes[0].title}`));
                console.log(chalk.green(`${respuesta.notes[0].body}\n`));
                break;
              case "blue":
                console.log(chalk.blue(`\n${respuesta.notes[0].title}`));
                console.log(chalk.blue(`${respuesta.notes[0].body}\n`));
                break;
              case "yellow":
                console.log(chalk.yellow(`\n${respuesta.notes[0].title}`));
                console.log(chalk.yellow(`${respuesta.notes[0].body}\n`));
                break;
              default:
                break;
            }
          }
        } else {
          console.log(chalk.red("\nNote not found\n"));
        }
        break;

      default:
        break;
    }
  });

  /**
   * Comando add, sirve para añadir nuevas notas a un usuario
   */
  yargs.command( {
    command: 'add',
    describe: 'Add a new note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Note body',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Note color',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
        const comando: RequestType = {
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };

        client.write(`${JSON.stringify(comando)}\n`, (err) => {
          if (err) {
            console.log(`\nNo se ha podido enviar el mensaje ${JSON.stringify(comando)} al servidor`);
          }
        });
      }
    },
  });

  /**
   * Comando update, sirve para modificar una nota concreta de un usuario
   */
  yargs.command( {
    command: 'update',
    describe: 'Update a note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
      newTitle: {
        describe: 'New note title',
        demandOption: false,
        type: 'string',
      },
      newBody: {
        describe: 'New note title',
        demandOption: false,
        type: 'string',
      },
      newColor: {
        describe: 'New note title',
        demandOption: false,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const comando: RequestType = {
          type: 'update',
          user: argv.user,
          title: argv.title,
        };
        if (typeof argv.newBody === 'string') {
          comando.newBody = argv.newBody;
        }
        if (typeof argv.newColor === 'string') {
          comando.newColor = argv.newColor;
        }
        if (typeof argv.newTitle === 'string') {
          comando.newTitle = argv.newTitle;
        }

        client.write(`${JSON.stringify(comando)}\n`, (err) => {
          if (err) {
            console.log(`\nNo se ha podido enviar el mensaje ${JSON.stringify(comando)} al servidor`);
          }
        });
      }
    },
  });

  /**
   * Comando remove, sirve para borrar una nota concreta de un usuario
   */
  yargs.command( {
    command: 'remove',
    describe: 'Remove a note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const comando: RequestType = {
          type: 'remove',
          user: argv.user,
          title: argv.title,
        };

        client.write(`${JSON.stringify(comando)}\n`, (err) => {
          if (err) {
            console.log(`\nNo se ha podido enviar el mensaje ${JSON.stringify(comando)} al servidor`);
          }
        });
      }
    },
  });

  /**
   * Comando list, sirve para listar las notas de un usuario
   */
  yargs.command( {
    command: 'list',
    describe: 'List notes of a concrect user',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string') {
        const comando: RequestType = {
          type: 'list',
          user: argv.user,
        };

        client.write(`${JSON.stringify(comando)}\n`, (err) => {
          if (err) {
            console.log(`\nNo se ha podido enviar el mensaje ${JSON.stringify(comando)} al servidor`);
          }
        });
      }
    },
  });

  /**
   * Comando read, sirve para leer una nota concreta de un usuario
   */
  yargs.command( {
    command: 'read',
    describe: 'Read a note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const comando: RequestType = {
          type: 'read',
          user: argv.user,
          title: argv.title,
        };

        client.write(`${JSON.stringify(comando)}\n`, (err) => {
          if (err) {
            console.log(`\nNo se ha podido enviar el mensaje ${JSON.stringify(comando)} al servidor`);
          }
        });
      }
    },
  });
}

yargs.argv;
