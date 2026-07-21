
class BaseStorage {
  setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getJson(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  }

  removeKey(key) {
    localStorage.removeItem(key);
  }
}

class Sesion extends BaseStorage {
  guardarUsuarioActual(usuario) {
    this.setJson('usuario_actual', usuario);
  }

  getCurrentUser() {
    return this.getJson('usuario_actual');
  }

  clearCurrentUser() {
    this.removeKey('usuario_actual');
  }
}

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

  async loginUser(usuario, contraseña) {
    const datos = { accion: 'login', usuario: usuario, contraseña: contraseña };
    const respuesta = await enviarAccionAGoogleSheets(datos);

    if (respuesta.ok) {
      this.guardarUsuarioActual(respuesta.usuario);
    }
    return respuesta;
  }

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

    const respuesta = await enviarAccionAGoogleSheets(datos);

    if (respuesta.ok) {
      const usuarioActual = this.getCurrentUser();
      Object.assign(usuarioActual, datosNuevos);
      this.guardarUsuarioActual(usuarioActual);
    }

    return respuesta.ok;
  }

  isAdmin(usuario, contraseña) {
    return usuario === 'admin' && contraseña === '123';
  }

  getDireccionCompleta(usuario) {
    if (!usuario) return '';
    const partes = [];
    if (usuario.municipio) partes.push(usuario.municipio);
    if (usuario.estado) partes.push(usuario.estado);
    return partes.join(', ');
  }
}

class PageBase {
  constructor(api) {
    this.api = api;
  }

  get(id) {
    return document.getElementById(id);
  }

  setText(id, text) {
    const element = this.get(id);
    if (element) {
      element.textContent = text;
    }
  }

  setHtml(id, html) {
    const element = this.get(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  show(id) {
    const element = this.get(id);
    if (element) {
      element.style.display = 'block';
    }
  }

  hide(id) {
    const element = this.get(id);
    if (element) {
      element.style.display = 'none';
    }
  }

  onClick(id, handler) {
    const element = this.get(id);
    if (element) {
      element.addEventListener('click', handler);
    }
  }

  redirect(url) {
    window.location.href = url;
  }
}

async function enviarAccionAGoogleSheets(datos) {
  try {
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

const autenticacion = new Autenticacion();
window.UNICOMPASS = autenticacion;