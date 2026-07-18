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

  function fillUsersTable(users) {
    if (!usersTable) return;
    const tbody = usersTable.querySelector('tbody');
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
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      api.clearCurrentUser();
    });
  }
});