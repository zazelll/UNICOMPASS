// Guarda y lee al usuario que tiene la sesión abierta en este navegador.
class Sesion {
  guardarUsuarioActual(usuario) {
    localStorage.setItem('usuario_actual', JSON.stringify(usuario));
  }

  getCurrentUser() {
    const guardado = localStorage.getItem('usuario_actual');
    return guardado ? JSON.parse(guardado) : null;
  }

  clearCurrentUser() {
    localStorage.removeItem('usuario_actual');
  }
}

// Hereda de Sesion y le agrega todo lo que habla con Google Sheets
// (registrar, iniciar sesión, editar perfil).
class Autenticacion extends Sesion {
  async registerUser(nombre, apellido, usuario, contraseña, email, estado, municipio) {
    const respuesta = await enviarAccionAGoogleSheets({
      accion: 'registrar',
      nombre, apellido, usuario, contraseña, email, estado, municipio
    });
    return respuesta;
  }

  async loginUser(usuario, contraseña) {
    const respuesta = await enviarAccionAGoogleSheets({ accion: 'login', usuario, contraseña });
    if (respuesta.ok) {
      this.guardarUsuarioActual(respuesta.usuario);
    }
    return respuesta;
  }

  async updateUser(usuarioOriginal, datosNuevos) {
    const respuesta = await enviarAccionAGoogleSheets({
      accion: 'editarPerfil',
      usuarioOriginal,
      ...datosNuevos
    });

    if (respuesta.ok) {
      const usuarioActual = this.getCurrentUser();
      this.guardarUsuarioActual({ ...usuarioActual, ...datosNuevos });
    }

    return respuesta.ok;
  }

  isAdmin(usuario, contraseña) {
    return usuario === 'aza' && contraseña === '123';
  }

  // Junta estado y municipio en un solo texto, para mostrar y para el mapa.
  getDireccionCompleta(usuario) {
    if (!usuario) return '';
    const partes = [usuario.municipio, usuario.estado].filter(Boolean);
    return partes.join(', ');
  }
}

// Manda cualquier "accion" a tu Apps Script y regresa la respuesta como objeto.
// Content-Type: text/plain evita que el navegador bloquee la petición por CORS.
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

window.UNICOMPASS = window.UNICOMPASS || {};
Object.assign(window.UNICOMPASS, {
  getCurrentUser: () => autenticacion.getCurrentUser(),
  clearCurrentUser: () => autenticacion.clearCurrentUser(),
  registerUser: (...args) => autenticacion.registerUser(...args),
  loginUser: (...args) => autenticacion.loginUser(...args),
  updateUser: (...args) => autenticacion.updateUser(...args),
  isAdmin: (...args) => autenticacion.isAdmin(...args),
  getDireccionCompleta: (usuario) => autenticacion.getDireccionCompleta(usuario)
});
