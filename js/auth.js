<<<<<<< Updated upstream
// Deben coincidir EXACTAMENTE con lo que pusiste en tu Apps Script (codigo_apps_script_v4.gs):
// - la misma URL de implementación que usa registro.js
// - el mismo valor de ADMIN_TOKEN que escribiste ahí
const GOOGLE_SHEET_WEBAPP_URL_ADMIN = 'https://script.google.com/macros/s/AKfycbxgq_DEN3ODP7ttexPo1tC_5nKYclCLGNbVfVjLce3pwIqIXtjvsi1SSgvyQ6YrROnz_w/exec';
const ADMIN_TOKEN = 'papu';
=======
// Se usa en secion.html (login de estudiante) y en admin.html (login de admin).
// Ambas páginas comparten los mismos campos: loginUsuario, loginPassword, loginButton.
>>>>>>> Stashed changes

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
  const refrescarSheetButton = document.getElementById('refrescarSheetButton');
  const sheetMensaje = document.getElementById('sheetMensaje');

  function normalizeUserRecord(user) {
    return {
      fecha: user?.Fecha || user?.fecha || user?.fechaRegistro || user?.createdAt || '',
      nombre: user?.Nombre || user?.nombre || user?.name || '',
      apellido: user?.Apellido || user?.apellido || user?.lastName || '',
      usuario: user?.Usuario || user?.usuario || user?.username || '',
      email: user?.Email || user?.email || user?.correo || '',
      estado: user?.Estado || user?.estado || user?.state || '',
      municipio: user?.Municipio || user?.municipio || user?.municipality || ''
    };
  }

  function normalizeUsers(users) {
    if (!Array.isArray(users)) return [];
    return users.map((user) => normalizeUserRecord(user));
  }

  let registrosCargados = [];

  function mostrarUsuariosEnTabla(usuarios) {
    if (!usersTable) return;
    const tbody = usersTable.querySelector('tbody');
<<<<<<< Updated upstream
    if (!tbody) return;

    const registros = normalizeUsers(users);
    tbody.innerHTML = '';

    if (!registros.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="7">No hay registros disponibles.</td>';
      tbody.appendChild(tr);
      return;
    }

    registros.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${user.fecha || ''}</td><td>${user.nombre || ''}</td><td>${user.apellido || ''}</td><td>${user.usuario || ''}</td><td>${user.email || ''}</td><td>${user.estado || ''}</td><td>${user.municipio || ''}</td>`;
      tbody.appendChild(tr);
    });
  }

  function cargarDesdeGoogleSheets() {
    if (!GOOGLE_SHEET_WEBAPP_URL_ADMIN || GOOGLE_SHEET_WEBAPP_URL_ADMIN === 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT') {
      if (sheetMensaje) sheetMensaje.textContent = 'Falta configurar la URL de Apps Script en auth.js.';
      return;
    }
    if (!ADMIN_TOKEN || ADMIN_TOKEN === 'CAMBIA_ESTA_CLAVE_SECRETA') {
      if (sheetMensaje) sheetMensaje.textContent = 'Falta configurar ADMIN_TOKEN en auth.js (debe coincidir con el de Apps Script).';
      return;
    }

    if (sheetMensaje) sheetMensaje.textContent = 'Cargando registros...';

    const url = `${GOOGLE_SHEET_WEBAPP_URL_ADMIN}?token=${encodeURIComponent(ADMIN_TOKEN)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const registros = Array.isArray(data?.registros)
          ? data.registros
          : Array.isArray(data)
            ? data
            : [];

        if (!data?.ok && !registros.length) {
          const locales = api.getUsers ? api.getUsers() : [];
          fillUsersTable(locales);
          if (sheetMensaje) sheetMensaje.textContent = 'No se pudo leer Google Sheets; mostrando registros guardados en este navegador.';
          return;
        }

        fillUsersTable(registros);
        if (sheetMensaje) {
          sheetMensaje.textContent = `${registros.length} registro(s) cargado(s) desde Google Sheets.`;
        }
      })
      .catch((error) => {
        const locales = api.getUsers ? api.getUsers() : [];
        fillUsersTable(locales);
        if (sheetMensaje) sheetMensaje.textContent = 'No se pudo conectar con Google Sheets; mostrando registros guardados en este navegador.';
        console.warn('Error cargando registros de Sheets:', error);
      });
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        cargarDesdeGoogleSheets();
=======
        const preguntasPanel = document.getElementById('preguntasPanel');
        if (preguntasPanel) preguntasPanel.style.display = 'block';
        cargarUsuariosDesdeSheets();
        if (typeof cargarPreguntasAdmin === 'function') cargarPreguntasAdmin();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    refrescarSheetButton.addEventListener('click', cargarDesdeGoogleSheets);
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const term = searchUsuario ? searchUsuario.value.trim() : '';
      const locales = api.getUsers ? api.getUsers() : [];
      const filtered = term
        ? locales.filter((user) => {
            const texto = `${user.nombre || ''} ${user.apellido || ''} ${user.usuario || ''} ${user.email || ''}`.toLowerCase();
            return texto.includes(term.toLowerCase());
          })
        : locales;

      fillUsersTable(filtered);
      if (sheetMensaje) {
        sheetMensaje.textContent = term
          ? (filtered.length ? 'Mostrando resultados de la búsqueda local.' : 'No se encontró ese usuario en este navegador.')
          : 'Mostrando registros guardados en este navegador.';
      }
=======
    refrescarSheetButton.addEventListener('click', cargarUsuariosDesdeSheets);
  }

  if (filtroUsuario) {
    filtroUsuario.addEventListener('input', () => {
      const texto = filtroUsuario.value.trim().toLowerCase();
      const filtrados = registrosCargados.filter((u) =>
        (u.Usuario || '').toLowerCase().includes(texto)
      );
      mostrarUsuariosEnTabla(filtrados);
>>>>>>> Stashed changes
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      api.clearCurrentUser();
      window.location.reload();
    });
  }
});