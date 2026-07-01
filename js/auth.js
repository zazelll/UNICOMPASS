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

  function fillUsersTable(users) {
    if (!usersTable) return;
    const tbody = usersTable.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${user.nombre}</td><td>${user.apellido}</td><td>${user.usuario}</td><td>${user.email || ''}</td><td>${user.escuela || ''}</td><td>${user.semestre || ''}</td><td>${user.lugar || ''}</td><td>${user.promedio || ''}</td>`;
      tbody.appendChild(tr);
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
        fillUsersTable(api.getUsers());
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

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const term = searchUsuario ? searchUsuario.value.trim() : '';
      const user = term ? api.findUser(term) : null;
      fillUsersTable(user ? [user] : []);
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      api.clearCurrentUser();
    });
  }
});
