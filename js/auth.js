// Deben coincidir EXACTAMENTE con lo que pusiste en tu Apps Script (codigo_apps_script_v4.gs):
// - la misma URL de implementación que usa registro.js
// - el mismo valor de ADMIN_TOKEN que escribiste ahí
const GOOGLE_SHEET_WEBAPP_URL_ADMIN = 'https://script.google.com/macros/s/AKfycbxgq_DEN3ODP7ttexPo1tC_5nKYclCLGNbVfVjLce3pwIqIXtjvsi1SSgvyQ6YrROnz_w/exec';
const ADMIN_TOKEN = 'papu';

document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const loginUsuario = document.getElementById('loginUsuario');
  const loginPassword = document.getElementById('loginPassword');
  const loginButton = document.getElementById('loginButton');
  const loginMensaje = document.getElementById('loginMensaje');
  const adminPanel = document.getElementById('adminPanel');
  const searchUsuario = document.getElementById('searchUsuario');
  const searchButton = document.getElementById('searchButton');
  const usersTable = document.getElementById('usersTable');
  const logoutLink = document.getElementById('logoutLink');
  const refrescarSheetButton = document.getElementById('refrescarSheetButton');
  const sheetMensaje = document.getElementById('sheetMensaje');

  function fillUsersTable(users) {
    if (!usersTable) return;
    const tbody = usersTable.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${user.Fecha || ''}</td><td>${user.Nombre || user.nombre || ''}</td><td>${user.Apellido || user.apellido || ''}</td><td>${user.Usuario || user.usuario || ''}</td><td>${user.Email || user.email || ''}</td><td>${user.Estado || user.estado || ''}</td><td>${user.Municipio || user.municipio || ''}</td>`;
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
        if (!data.ok) {
          if (sheetMensaje) sheetMensaje.textContent = `Error: ${data.error || 'no se pudo cargar'}`;
          return;
        }
        fillUsersTable(data.registros || []);
        if (sheetMensaje) {
          sheetMensaje.textContent = `${(data.registros || []).length} registro(s) cargado(s) desde Google Sheets.`;
        }
      })
      .catch((error) => {
        if (sheetMensaje) sheetMensaje.textContent = 'No se pudo conectar con Google Sheets. Revisa la URL y tu conexión.';
        console.warn('Error cargando registros de Sheets:', error);
      });
  }

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const usuario = loginUsuario ? loginUsuario.value.trim() : '';
      const contraseña = loginPassword ? loginPassword.value : '';

      if (!usuario || !contraseña) {
        if (loginMensaje) loginMensaje.textContent = 'Completa usuario y contraseña.';
        return;
      }

      if (api.isAdmin(usuario, contraseña)) {
        if (loginMensaje) loginMensaje.textContent = 'Bienvenido admin.';
        if (adminPanel) adminPanel.style.display = 'block';
        cargarDesdeGoogleSheets();
        return;
      }

      if (!api.findUser(usuario)) {
        if (loginMensaje) loginMensaje.textContent = 'Usuario no existe.';
        return;
      }

      if (!api.loginUser(usuario, contraseña)) {
        if (loginMensaje) loginMensaje.textContent = 'Contraseña incorrecta.';
        return;
      }

      window.location.href = 'menu.html';
    });
  }

  if (refrescarSheetButton) {
    refrescarSheetButton.addEventListener('click', cargarDesdeGoogleSheets);
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const term = searchUsuario ? searchUsuario.value.trim() : '';
      const user = term ? api.findUser(term) : null;
      fillUsersTable(user ? [user] : []);
      if (sheetMensaje) {
        sheetMensaje.textContent = user
          ? 'Mostrando resultado de la búsqueda local (solo este navegador).'
          : 'No se encontró ese usuario en este navegador.';
      }
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      api.clearCurrentUser();
    });
  }
});