// Se usa en secion.html (login de estudiante) y en admin.html (login de admin).
// Ambas páginas comparten los mismos campos: loginUsuario, loginPassword, loginButton.

document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const loginUsuario = document.getElementById('loginUsuario');
  const loginPassword = document.getElementById('loginPassword');
  const loginButton = document.getElementById('loginButton');
  const loginMensaje = document.getElementById('loginMensaje');

  // Estos solo existen en admin.html
  const adminPanel = document.getElementById('adminPanel');
  const usersTable = document.getElementById('usersTable');
  const filtroUsuario = document.getElementById('filtroUsuario');
  const refrescarSheetButton = document.getElementById('refrescarSheetButton');
  const sheetMensaje = document.getElementById('sheetMensaje');
  const logoutLink = document.getElementById('logoutLink');

  let registrosCargados = [];

  function mostrarUsuariosEnTabla(usuarios) {
    if (!usersTable) return;
    const tbody = usersTable.querySelector('tbody');
    tbody.innerHTML = '';

    usuarios.forEach((usuario) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${usuario.Fecha || ''}</td>
        <td>${usuario.Nombre || ''}</td>
        <td>${usuario.Apellido || ''}</td>
        <td>${usuario.Usuario || ''}</td>
        <td>${usuario.Email || ''}</td>
        <td>${usuario.Estado || ''}</td>
        <td>${usuario.Municipio || ''}</td>
      `;
      tbody.appendChild(fila);
    });
  }

  async function cargarUsuariosDesdeSheets() {
    if (sheetMensaje) sheetMensaje.textContent = 'Cargando...';

    const url = `${GOOGLE_SHEET_WEBAPP_URL}?token=${encodeURIComponent(ADMIN_TOKEN)}`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (!datos.ok) {
      if (sheetMensaje) sheetMensaje.textContent = `Error: ${datos.error}`;
      return;
    }

    registrosCargados = datos.registros;
    mostrarUsuariosEnTabla(registrosCargados);
    if (sheetMensaje) sheetMensaje.textContent = `${registrosCargados.length} usuario(s) encontrados.`;
  }

  if (loginButton) {
    loginButton.addEventListener('click', async () => {
      const usuario = loginUsuario.value.trim();
      const contraseña = loginPassword.value;

      if (!usuario || !contraseña) {
        loginMensaje.textContent = 'Completa usuario y contraseña.';
        return;
      }

      // Primero revisamos si es el admin (no necesita internet, es un valor fijo).
      if (api.isAdmin(usuario, contraseña)) {
        loginMensaje.textContent = 'Bienvenido admin.';
        if (adminPanel) adminPanel.style.display = 'block';
        const preguntasPanel = document.getElementById('preguntasPanel');
        if (preguntasPanel) preguntasPanel.style.display = 'block';
        cargarUsuariosDesdeSheets();
        if (typeof cargarPreguntasAdmin === 'function') cargarPreguntasAdmin();
        return;
      }

      // Si no es admin, revisamos contra los usuarios guardados en Google Sheets.
      loginMensaje.textContent = 'Verificando...';
      const respuesta = await api.loginUser(usuario, contraseña);

      if (respuesta.ok) {
        window.location.href = 'menu.html';
      } else {
        loginMensaje.textContent = respuesta.error || 'Usuario o contraseña incorrectos.';
      }
    });
  }

  if (refrescarSheetButton) {
    refrescarSheetButton.addEventListener('click', cargarUsuariosDesdeSheets);
  }

  if (filtroUsuario) {
    filtroUsuario.addEventListener('input', () => {
      const texto = filtroUsuario.value.trim().toLowerCase();
      const filtrados = registrosCargados.filter((u) =>
        (u.Usuario || '').toLowerCase().includes(texto)
      );
      mostrarUsuariosEnTabla(filtrados);
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      api.clearCurrentUser();
      window.location.reload();
    });
  }
});
