import {Nota} from './nota';
import * as fs from 'fs';

/**
 * ```typescript
 * // Ejemplo de creación
 *  const usuario = new usuario("alu0101206479");
 * ```
 * Clase que representa a los usuarios
 */
export class Usuario {
  /**
   * Atributo que contiene todas las notas del usuario
   */
  private notas: Nota[] = [];

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  const usuario = new usuario("alu0101206479");
   * ```
   * Constructor de la clase Usuario, dentro de este vamos leyendo a través de los ficheros de la carpeta del usuario todas las notas y las vamos introduciendo en el atributo notas
   * @param nombre Nombre del usuario
   */
  constructor(private nombre: string) {
    const directorioExiste: boolean = fs.existsSync(`src/ejercicio-practica/usuarios/${this.nombre}`);

    if (directorioExiste) {
      const ficheros = fs.readdirSync(`src/ejercicio-practica/usuarios/${this.nombre}/`);

      ficheros.forEach((fichero) => {
        const contenidoNota = fs.readFileSync(`src/ejercicio-practica/usuarios/${this.nombre}/${fichero}`);
        const notaJson = JSON.parse(contenidoNota.toString());

        const nota = new Nota(notaJson.titulo, notaJson.cuerpo, notaJson.color);
        this.notas.push(nota);
      });
    } else {
      fs.mkdirSync(`src/ejercicio-practica/usuarios/${this.nombre}`);
    }
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.getNombre();
   * ```
   * Función que retorna el nombre del usuario
   * @return El atributo usuario
   */
  public getNombre() {
    return this.nombre;
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.setNombre("acoidan_mesa");
   * ```
   * Función para cambiar el nombre del usuario
   * @param nombre El nuevo nombre del usuario
   */
  public setNombre(nombre: string) {
    this.nombre = nombre;
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.getNotas();
   * ```
   * Función que retorna las notas que tiene el usuario
   * @return El atributo notas
   */
  public getNotas() {
    return this.notas;
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.añadirNota("Red note", "This is a red note", "red");
   * ```
   * Función que le añade una nota al usuario, tanto al atributo notas como al directorio del usuario y devuelve true o false dependiendo si la operación se ejecuto correctamente o no.
   * @param titulo Título de la nota
   * @param cuerpo Cuerpo de la nota
   * @param color Color de la nota
   */
  public añadirNota(titulo: string, cuerpo: string, color: string) {
    if (fs.existsSync(`src/ejercicio-practica/usuarios/${this.nombre}/${titulo}.json`) == false) {
      this.notas.push(new Nota(titulo, cuerpo, color));
      fs.writeFileSync(`src/ejercicio-practica/usuarios/${this.nombre}/${titulo}.json`, `{\n\t"titulo": "${titulo}",\n\t"cuerpo": "${cuerpo}",\n\t"color": "${color}"\n}`);
      return true;
    } else {
      return false;
    }
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.modificarNota("Red note", "color", "blue");
   * ```
   * Función que le modifica un atributo a una nota del usuario, tanto en el atributo notas como  en el directorio del usuario y retorna true o false si se modifico la nota correctamente o no
   * @param tituloNota Título de la nota que se quiere modificar
   * @param parametroEditar Parámetro que se quiere modificar
   * @param nuevoValor Nuevo valor que tendrá ese parámetro
   */
  public modificarNota(tituloNota: string, parametroEditar: string, nuevoValor: string) {
    const ficheroExiste: boolean = fs.existsSync(`src/ejercicio-practica/usuarios/${this.nombre}/${tituloNota}.json`);

    if (ficheroExiste == false) {
      return false;
    } else {
      const contenidoNota = fs.readFileSync(`src/ejercicio-practica/usuarios/${this.nombre}/${tituloNota}.json`);
      const dataJson = JSON.parse(contenidoNota.toString());

      let indice: number = 0;
      let i = 0;
      this.notas.forEach((nota) => {
        if (nota.getTitulo() == tituloNota) {
          indice = i;
        }
        i++;
      });

      if (parametroEditar == "titulo") {
        this.notas[indice].setTitulo(nuevoValor);
        fs.renameSync(`src/ejercicio-practica/usuarios/${this.nombre}/${tituloNota}.json`, `src/ejercicio-practica/usuarios/${this.nombre}/${nuevoValor}.json`);
        fs.writeFileSync(`src/ejercicio-practica/usuarios/${this.nombre}/${nuevoValor}.json`, `{\n\t"titulo": "${nuevoValor}",\n\t"cuerpo": "${dataJson.cuerpo}",\n\t"color": "${dataJson.color}"\n}`);
      }

      if (parametroEditar == "cuerpo") {
        this.notas[indice].setCuerpo(nuevoValor);
        fs.writeFileSync(`src/ejercicio-practica/usuarios/${this.nombre}/${dataJson.titulo}.json`, `{\n\t"titulo": "${dataJson.titulo}",\n\t"cuerpo": "${nuevoValor}",\n\t"color": "${dataJson.color}"\n}`);
      }

      if (parametroEditar == "color") {
        this.notas[indice].setColor(nuevoValor);
        fs.writeFileSync(`src/ejercicio-practica/usuarios/${this.nombre}/${dataJson.titulo}.json`, `{\n\t"titulo": "${dataJson.titulo}",\n\t"cuerpo": "${dataJson.cuerpo}",\n\t"color": "${nuevoValor}"\n}`);
      }

      return true;
    }
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.borrarNota("Red note");
   * ```
   * Función que le borra una nota concreta al usuario, tanto del atributo notas como del directorio del usuario y retorna true o false dependiendo si se borro la nota o no
   * @param titulo Título de la nota que se quiere eliminar
   */
  public borrarNota(titulo: string) {
    const ficheroExiste: boolean = fs.existsSync(`src/ejercicio-practica/usuarios/${this.nombre}/${titulo}.json`);

    if (ficheroExiste == false) {
      return false;
    } else {
      let indice: number = 0;
      let i = 0;
      this.notas.forEach((nota) => {
        if (nota.getTitulo() == titulo) {
          indice = i;
        }
        i++;
      });
      this.notas.splice(indice, 1);

      fs.rmSync(`src/ejercicio-practica/usuarios/${this.nombre}/${titulo}.json`);

      return true;
    }
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.listarNotas();
   * ```
   * Función para listar todas las notas del usuario y retorna todas las notas de este
   */
  public listarNotas() {
    return this.notas;
  }

  /**
   * ```typescript
   * // Ejemplo de llamada
   *  usuario.leerNota("Red note");
   * ```
   * Función para leer una nota concreta del usuario que retorna un JSON con la nota que se quiere leer y si se ha encontrado
   * @param titulo Título de la nota que se quiere leer
   */
  public leerNota(titulo: string) {
    const ficheroExiste: boolean = fs.existsSync(`src/ejercicio-practica/usuarios/${this.nombre}/${titulo}.json`);

    const salida = {
      success: true,
      nota: this.notas[0],
    };

    if (ficheroExiste == false) {
      salida.success = false;
    } else {
      let indice: number = 0;
      let i = 0;
      this.notas.forEach((nota) => {
        if (nota.getTitulo() == titulo) {
          indice = i;
        }
        i++;
      });

      salida.nota = this.notas[indice];
    }

    return salida;
  }
}
