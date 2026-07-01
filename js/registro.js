document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const registerNombre = document.getElementById('registerNombre');
  const registerApellido = document.getElementById('registerApellido');
  const registerUsuario = document.getElementById('registerUsuario');
  const registerPassword = document.getElementById('registerPassword');
  const registerEmail = document.getElementById('registerEmail');
  const registerEscuela = document.getElementById('registerEscuela');
  const registerSemestre = document.getElementById('registerSemestre');
  const registerLugar = document.getElementById('registerLugar');
  const registerPromedio = document.getElementById('registerPromedio');
  const registerNivelEscuela = document.getElementById('registerNivelEscuela');
  const registerButton = document.getElementById('registerButton');
  const registerMensaje = document.getElementById('registerMensaje');

  if (!registerButton) return;

  registerButton.addEventListener('click', () => {
    const nombre = registerNombre ? registerNombre.value.trim() : '';
    const apellido = registerApellido ? registerApellido.value.trim() : '';
    const usuario = registerUsuario ? registerUsuario.value.trim() : '';
    const contraseña = registerPassword ? registerPassword.value : '';
    const email = registerEmail ? registerEmail.value.trim() : '';
    const escuela = registerEscuela ? registerEscuela.value.trim() : '';
    const semestre = registerSemestre ? registerSemestre.value.trim() : '';
    const lugar = registerLugar ? registerLugar.value.trim() : '';
    const promedio = registerPromedio ? registerPromedio.value.trim() : '';
    const nivelEscuela = registerNivelEscuela ? registerNivelEscuela.value : '';

    if (!nombre || !apellido || !usuario || !contraseña) {
      if (registerMensaje) registerMensaje.textContent = 'Completa todos los campos.';
      return;
    }

    if (api.findUser(usuario)) {
      if (registerMensaje) registerMensaje.textContent = 'Ese usuario ya existe.';
      return;
    }

    api.registerUser(nombre, apellido, usuario, contraseña, email, escuela, semestre, lugar, promedio, nivelEscuela);
    if (registerMensaje) registerMensaje.textContent = 'Registro guardado. Inicia sesión.';
    setTimeout(() => {
      window.location.href = 'secion.html';
    }, 800);
  });
});
