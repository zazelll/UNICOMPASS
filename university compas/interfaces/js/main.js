const USERS_KEY = 'usuarios_comas';
const CURRENT_KEY = 'usuario_actual';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(usuario) {
  return getUsers().find(u => u.usuario === usuario);
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

function registerUser(nombre, apellido, usuario, contraseña, email) {
  if (findUser(usuario)) return false;
  const users = getUsers();
  users.push({ nombre, apellido, usuario, contraseña, email });
  saveUsers(users);
  return true;
}

function loginUser(usuario, contraseña) {
  const user = findUser(usuario);
  if (user && user.contraseña === contraseña) {
    saveCurrentUser(user);
    return true;
  }
  return false;
}

function isAdmin(usuario, contraseña) {
  return usuario === 'aza' && contraseña === '123';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginUsuario = document.getElementById('loginUsuario');
  const loginPassword = document.getElementById('loginPassword');
  const loginButton = document.getElementById('loginButton');
  const loginMensaje = document.getElementById('loginMensaje');
  const registerNombre = document.getElementById('registerNombre');
  const registerApellido = document.getElementById('registerApellido');
  const registerUsuario = document.getElementById('registerUsuario');
  const registerPassword = document.getElementById('registerPassword');
  const registerEmail = document.getElementById('registerEmail');
  const registerButton = document.getElementById('registerButton');
  const registerMensaje = document.getElementById('registerMensaje');
  const nombreCompleto = document.getElementById('nombreCompleto');
  const usuarioActual = document.getElementById('usuarioActual');
  const logoutLink = document.getElementById('logoutLink');
  const adminPanel = document.getElementById('adminPanel');
  const searchUsuario = document.getElementById('searchUsuario');
  const searchButton = document.getElementById('searchButton');
  const usersTable = document.getElementById('usersTable');

  function fillUsersTable(users) {
    const tbody = usersTable.querySelector('tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${user.nombre}</td><td>${user.apellido}</td><td>${user.usuario}</td><td>${user.email || ''}</td>`;
      tbody.appendChild(tr);
    });
  }

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const usuario = loginUsuario.value.trim();
      const contraseña = loginPassword.value;
      if (!usuario || !contraseña) {
        loginMensaje.textContent = 'Completa usuario y contraseña.';
        return;
      }
      if (isAdmin(usuario, contraseña)) {
        loginMensaje.textContent = 'Bienvenido admin.';
        adminPanel.style.display = 'block';
        fillUsersTable(getUsers());
        return;
      }
      if (!findUser(usuario)) {
        loginMensaje.textContent = 'Usuario no existe.';
        return;
      }
      if (!loginUser(usuario, contraseña)) {
        loginMensaje.textContent = 'Contraseña incorrecta.';
        return;
      }
      window.location.href = 'menu.html';
    });
  }

  if (registerButton) {
    registerButton.addEventListener('click', () => {
      const nombre = registerNombre.value.trim();
      const apellido = registerApellido.value.trim();
      const usuario = registerUsuario.value.trim();
      const contraseña = registerPassword.value;
      const email = registerEmail ? registerEmail.value.trim() : '';
      if (!nombre || !apellido || !usuario || !contraseña) {
        registerMensaje.textContent = 'Completa todos los campos.';
        return;
      }
      if (findUser(usuario)) {
        registerMensaje.textContent = 'Ese usuario ya existe.';
        return;
      }
      registerUser(nombre, apellido, usuario, contraseña, email);
      registerMensaje.textContent = 'Registro guardado. Inicia sesión.';
      setTimeout(() => {
        window.location.href = 'secion.html';
      }, 800);
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const term = searchUsuario.value.trim();
      const user = term ? findUser(term) : null;
      fillUsersTable(user ? [user] : []);
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      clearCurrentUser();
    });
  }

  if (nombreCompleto && usuarioActual) {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'secion.html';
      return;
    }
    nombreCompleto.textContent = `${user.nombre} ${user.apellido}`;
    usuarioActual.textContent = user.usuario;
  }
});
