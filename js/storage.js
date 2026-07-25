
// sirve para manejar el almacenamiento de datos en el navegador y la autenticación de usuarios
 
// ---- ESTO ES UNA *CLASE* ----
// BaseStorage no hereda de nada (no tiene "extends"), es la más
// "de abajo" de toda la cadena. Solo sabe guardar/leer cosas en
// el localStorage del navegador (JSON.stringify convierte un
// objeto a texto para poder guardarlo, JSON.parse hace lo contrario).
class BaseStorage {
  setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
 
  // esto es para obtener los datos del localStorage y convertirlos a objeto
  getJson(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  }
 
  removeKey(key) {
    localStorage.removeItem(key);
  }
}
 
// ---- ESTO ES *HERENCIA* ----
// "class Sesion extends BaseStorage" significa que Sesion HEREDA
// todo lo que ya sabe hacer BaseStorage (setJson, getJson, removeKey)
// sin tener que volver a escribirlo. Sesion solo le agrega 3 métodos
// nuevos, específicos para manejar "quién es el usuario que inició sesión".
// aqui se define la clase Sesion que hereda de BaseStorage y maneja el usuario actual
class Sesion extends BaseStorage {
  guardarUsuarioActual(usuario) {
    this.setJson('usuario_actual', usuario); // usa el método heredado de BaseStorage
  }
 
  // esto es para obtener el usuario actual del localStorage y convertirlo a objeto
  getCurrentUser() {
    return this.getJson('usuario_actual'); // otra vez, método heredado
  }
 
  // esto es para eliminar el usuario actual del localStorage
  clearCurrentUser() {
    this.removeKey('usuario_actual');
  }
}
 
// ---- ESTO ES *HERENCIA* (otra vez, encadenada) ----
// Autenticacion hereda de Sesion, que a su vez hereda de BaseStorage.
// Entonces Autenticacion sabe hacer TODO lo de las 2 clases de arriba,
// más lo nuevo que se le agrega aquí: hablar con Google Sheets
// (registrar, iniciar sesión, editar perfil).
// sirve para manejar la autenticación de usuarios y la comunicación con Google Sheets
// aqui se complico a q no guardaba, pero ya lo resolvi, ahora si guarda los datos del
// registro en el google sheet y se puede acceder a ellos desde el webapp de google sheets
class Autenticacion extends Sesion {
  // async = esta función "espera" a que Google Sheets responda antes de seguir
  async registerUser(nombre, apellido, usuario, contraseña, email, estado, municipio) {
    const datos = {
      accion: 'registrar', // le dice al Apps Script QUÉ acción hacer con estos datos
      nombre: nombre,
      apellido: apellido,
      usuario: usuario,
      contraseña: contraseña,
      email: email,
      estado: estado,
      municipio: municipio
    };
    return await enviarAccionAGoogleSheets(datos); // usa la función de más abajo
  }
 
  // esto es para iniciar sesión con el usuario y contraseña proporcionados
  async loginUser(usuario, contraseña) {
    const datos = { accion: 'login', usuario: usuario, contraseña: contraseña };
    const respuesta = await enviarAccionAGoogleSheets(datos);
 
    if (respuesta.ok) {
      this.guardarUsuarioActual(respuesta.usuario); // método heredado de Sesion
    }
    return respuesta;
  }
 
  // esto es para actualizar los datos del usuario actual con los nuevos datos proporcionados
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
 
    // aqui se envia la accion a Google Sheets para actualizar los datos del usuario
    const respuesta = await enviarAccionAGoogleSheets(datos);
 
    // si la respuesta es ok, se actualiza el usuario actual en el localStorage con los nuevos datos
    if (respuesta.ok) {
      const usuarioActual = this.getCurrentUser();
      Object.assign(usuarioActual, datosNuevos); // combina los datos viejos con los nuevos
      this.guardarUsuarioActual(usuarioActual);
    }
 
    // esto es para retornar si la actualización fue exitosa o no
    return respuesta.ok;
  }
 
  // esto es para verificar si el usuario y contraseña proporcionados son de un administrador
  // recordar "admin" y "123" AQUI ES LA CONTRASEÑA :P
  isAdmin(usuario, contraseña) {
    return usuario === 'admin' && contraseña === '123';
  }
 
  // esto es para obtener la dirección completa del usuario actual en formato "municipio, estado"
  getDireccionCompleta(usuario) {
    if (!usuario) return '';
    const partes = [];
    if (usuario.municipio) partes.push(usuario.municipio);
    if (usuario.estado) partes.push(usuario.estado);
    return partes.join(', ');
  }
}
 
// ---- ESTO ES OTRA *CLASE*, NO HEREDA DE NADA ----
// PageBase no tiene nada que ver con Google Sheets. Es una clase
// de "ayudantes" (helpers) para no repetir código en cada página:
// buscar elementos del HTML, poner texto, mostrar/ocultar cosas, etc.
// TODAS las páginas (RegistroPage, PerfilPage, PaginaMenu, PaginaEscuelas,
// SurveyPage, AdminPreguntasPage) usan "extends PageBase" para heredar
// estos métodos y no tener que escribir document.getElementById(...) 100 veces.
// sirve para manejar la comunicación con Google Sheets y enviar acciones como registrar, login, editarPerfil
// dice api para poder acceder a los datos del usuario actual y actualizar su perfil en
// el exel de gpoogle q es url de la api como tal es api pero es url conectado
// es como una pagina web que se conecta con el google sheet y permite guardar los datos del registro
class PageBase {
  constructor(api) {
    this.api = api; // guarda la referencia a "autenticacion" para usarla en cada página
  }
 
  // sirve para obtener un elemento del DOM por su id
  get(id) {
    return document.getElementById(id);
  }
 
  // sirve para establecer el texto de un elemento del DOM por su id
  setText(id, text) {
    const element = this.get(id);
    if (element) {
      element.textContent = text;
    }
  }
 
  // sirve para establecer el HTML de un elemento del DOM por su id
  setHtml(id, html) {
    const element = this.get(id);
    if (element) {
      element.innerHTML = html;
    }
  }
 
  // sirve para mostrar un mensaje en un elemento del DOM por su id
  show(id) {
    const element = this.get(id);
    if (element) {
      element.style.display = 'block';
    }
  }
 
  // sirve para ocultar un elemento del DOM por su id
  hide(id) {
    const element = this.get(id);
    if (element) {
      element.style.display = 'none';
    }
  }
 
  // sirve para agregar un evento de click a un elemento del DOM por su id
  onClick(id, handler) {
    const element = this.get(id);
    if (element) {
      element.addEventListener('click', handler);
    }
  }
 
  // sirve para redirigir a otra página
  redirect(url) {
    window.location.href = url;
  }
}
 
// ---- ESTO ES UNA *FUNCIÓN* NORMAL (no es método de ninguna clase) ----
// Está fuera de cualquier class, por eso cualquier archivo la puede
// llamar directo como "enviarAccionAGoogleSheets(algo)".
// aqui dice async function enviarAccionAGoogleSheets(datos) {
// es para enviar los datos del registro a Google Sheets y recibir la respuesta
// async = es para que la funcion sea asincrona y pueda esperar la respuesta de Google Sheets
async function enviarAccionAGoogleSheets(datos) {
  try {
    // es para enviar los datos del registro a Google Sheets y recibir la respuesta
    const respuesta = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos)
    });
    return await respuesta.json();
  } catch (error) {
    console.warn('No se pudo conectar con Google Sheets:', error);
    return { ok: false, error: 'No hay conexión con el servidor.' };
  }
}
 
// sirve para inicializar la autenticación y exponerla como una variable global
// "new Autenticacion()" crea UN objeto real a partir de la clase (esto se llama
// "instanciar" la clase). Ese objeto se guarda en window.UNICOMPASS para que
// TODOS los demás archivos .js puedan usarlo escribiendo "window.UNICOMPASS.loginUser(...)" etc.
const autenticacion = new Autenticacion();
window.UNICOMPASS = autenticacion;