//sirve para manejar el almacenamiento de datos en el navegador y la autenticación de usuarios
class BaseStorage {
  setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
//esto es para obtener los datos del localStorage y convertirlos a objeto
  getJson(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  }

  removeKey(key) {
    localStorage.removeItem(key);
  }
}
//aqui se define la clase Sesion que hereda de BaseStorage y maneja el usuario actual
class Sesion extends BaseStorage {
  guardarUsuarioActual(usuario) {
    this.setJson('usuario_actual', usuario);
  }
//esto es para obtener el usuario actual del localStorage y convertirlo a objeto
  getCurrentUser() {
    return this.getJson('usuario_actual');
  }
//esto es para eliminar el usuario actual del localStorage
  clearCurrentUser() {
    this.removeKey('usuario_actual');
  }
}
//sirve para manejar la autenticación de usuarios y la comunicación con Google Sheets
//aqui se complico a q no guardaba, pero ya lo resolvi, ahora si guarda los datos del 
// registro en el google sheet y se puede acceder a ellos desde el webapp de google sheets
class Autenticacion extends Sesion {
  async registerUser(nombre, apellido, usuario, contraseña, email, estado, municipio) {
    const datos = {
      accion: 'registrar',
      nombre: nombre,
      apellido: apellido,
      usuario: usuario,
      contraseña: contraseña,
      email: email,
      estado: estado,
      municipio: municipio
    };
    return await enviarAccionAGoogleSheets(datos);
  }
//esto es para iniciar sesión con el usuario y contraseña proporcionados
  async loginUser(usuario, contraseña) {
    const datos = { accion: 'login', usuario: usuario, contraseña: contraseña };
    const respuesta = await enviarAccionAGoogleSheets(datos);

    if (respuesta.ok) {
      this.guardarUsuarioActual(respuesta.usuario);
    }
    return respuesta;
  }
//esto es para actualizar los datos del usuario actual con los nuevos datos proporcionados
  async updateUser(usuarioOriginal, datosNuevos) {
    const datos = {
      accion: 'editarPerfil',
      usuarioOriginal: usuarioOriginal,
      nombre: datosNuevos.nombre,
      apellido: datosNuevos.apellido,
      email: datosNuevos.email,
      estado: datosNuevos.estado,
      municipio: datosNuevos.municipio,
      vocacionalResultado: datosNuevos.vocacionalResultado,
      comentario: datosNuevos.comentario
    };
//aqui se envia la accion a Google Sheets para actualizar los datos del usuario
    const respuesta = await enviarAccionAGoogleSheets(datos);
//si la respuesta es ok, se actualiza el usuario actual en el localStorage con los nuevos datos
    if (respuesta.ok) {
      const usuarioActual = this.getCurrentUser();
      Object.assign(usuarioActual, datosNuevos);
      this.guardarUsuarioActual(usuarioActual);
    }
//esto es para retornar si la actualización fue exitosa o no
    return respuesta.ok;
  }
//esto es para verificar si el usuario y contraseña proporcionados son de un administrador
//recordar "admin" y "123" AQUI ES LA CONTRASEÑA :P
  isAdmin(usuario, contraseña) {
    return usuario === 'admin' && contraseña === '123';
  }
//esto es para obtener la dirección completa del usuario actual en formato "municipio, estado"
  getDireccionCompleta(usuario) {
    if (!usuario) return '';
    const partes = [];
    if (usuario.municipio) partes.push(usuario.municipio);
    if (usuario.estado) partes.push(usuario.estado);
    return partes.join(', ');
  }
}
//sirve para manejar la comunicación con Google Sheets y enviar acciones como registrar, l
// ogin, editarPerfil
//dice api para poder acceder a los datos del usuario actual y actualizar su perfil en 
// el exel de gpoogle q es url de la api como tal es api pero es url conectado 
//es como una pagina web que se conecta con el google sheet y permite guardar los datos del registro
//y se conecto a api para poder acceder a los datos del usuario actual y actualizar 
// su perfil en el exel de gpoogle q es url de la api esta parte lo investigue ya q daba errores
//y esta parte no la sabia
//ahora si guarda los datos del registro en el google sheet y se puede acceder a 
// ellos desde el webapp de google sheets
class PageBase {
  constructor(api) {
    this.api = api;
  }
//sirve para obtener un elemento del DOM por su id
  get(id) {
    return document.getElementById(id);
  }
//sirve para establecer el texto de un elemento del DOM por su id
  setText(id, text) {
    const element = this.get(id);
    if (element) {
      element.textContent = text;
    }
  }
//sirve para establecer el HTML de un elemento del DOM por su id
  setHtml(id, html) {
    const element = this.get(id);
    if (element) {
      element.innerHTML = html;
    }
  }
//sirve para mostrar un mensaje en un elemento del DOM por su id
  show(id) {
    const element = this.get(id);
    if (element) {
      element.style.display = 'block';
    }
  }
//sirve para ocultar un elemento del DOM por su id
  hide(id) {
    const element = this.get(id);
    if (element) {
      element.style.display = 'none';
    }
  }
//sirve para agregar un evento de click a un elemento del DOM por su id
  onClick(id, handler) {
    const element = this.get(id);
    if (element) {
      element.addEventListener('click', handler);
    }
  }
//sirve para redirigir a otra página
  redirect(url) {
    window.location.href = url;
  }
}
//aqui dice async function enviarAccionAGoogleSheets(datos) {
//es para enviar los datos del registro a Google Sheets y recibir la respuesta
//async = es para que la funcion sea asincrona y pueda esperar la respuesta de Google Sheets
//function enviarAccionAGoogleSheets(datos) = es para enviar los datos del registro a Google Sheets 
// y recibir la respuesta
async function enviarAccionAGoogleSheets(datos) {
  try {//es para enviar los datos del registro a Google Sheets y recibir la respuesta
    const respuesta = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos)
    });//es para enviar los datos del registro a Google Sheets y recibir la respuesta
    return await respuesta.json();
  } catch (error) {
    console.warn('No se pudo conectar con Google Sheets:', error);
    return { ok: false, error: 'No hay conexión con el servidor.' };
  }
}
//sirve para inicializar la autenticación y exponerla como una variable global
const autenticacion = new Autenticacion();
window.UNICOMPASS = autenticacion;