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

function registerUser(nombre, apellido, usuario, contraseña, email, escuela, semestre, lugar, promedio) {
  if (findUser(usuario)) return false;
  const users = getUsers();
  users.push({ nombre, apellido, usuario, contraseña, email, escuela, semestre, lugar, promedio });
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

function updateUser(usuarioName, updatedData) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.usuario === usuarioName);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    saveUsers(users);
    saveCurrentUser(users[userIndex]);
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
  const registerEscuela = document.getElementById('registerEscuela');
  const registerSemestre = document.getElementById('registerSemestre');
  const registerLugar = document.getElementById('registerLugar');
  const registerPromedio = document.getElementById('registerPromedio');
  const registerButton = document.getElementById('registerButton');
  const registerMensaje = document.getElementById('registerMensaje');
  const nombreCompleto = document.getElementById('nombreCompleto');
  const usuarioActual = document.getElementById('usuarioActual');
  const estatusActual = document.getElementById('estatusActual');
  const escuelaActual = document.getElementById('escuelaActual');
  const escuelasSeleccionadas = document.getElementById('escuelasSeleccionadas');
  const logoutLink = document.getElementById('logoutLink');
  const adminPanel = document.getElementById('adminPanel');
  const searchUsuario = document.getElementById('searchUsuario');
  const searchButton = document.getElementById('searchButton');
  const usersTable = document.getElementById('usersTable');
  const editNombre = document.getElementById('editNombre');
  const editApellido = document.getElementById('editApellido');
  const editUsuario = document.getElementById('editUsuario');
  const editEmail = document.getElementById('editEmail');
  const editEscuela = document.getElementById('editEscuela');
  const editSemestre = document.getElementById('editSemestre');
  const editLugar = document.getElementById('editLugar');
  const editPromedio = document.getElementById('editPromedio');
  const guardarButton = document.getElementById('guardarButton');
  const editMensaje = document.getElementById('editMensaje');

  function fillUsersTable(users) {
    if (!usersTable) return;
    const tbody = usersTable.querySelector('tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${user.nombre}</td><td>${user.apellido}</td><td>${user.usuario}</td><td>${user.email || ''}</td><td>${user.escuela || ''}</td><td>${user.semestre || ''}</td><td>${user.lugar || ''}</td><td>${user.promedio || ''}</td>`;
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
      const escuela = registerEscuela ? registerEscuela.value.trim() : '';
      const semestre = registerSemestre ? registerSemestre.value.trim() : '';
      const lugar = registerLugar ? registerLugar.value.trim() : '';
      const promedio = registerPromedio ? registerPromedio.value.trim() : '';
      if (!nombre || !apellido || !usuario || !contraseña) {
        registerMensaje.textContent = 'Completa todos los campos.';
        return;
      }
      if (findUser(usuario)) {
        registerMensaje.textContent = 'Ese usuario ya existe.';
        return;
      }
      registerUser(nombre, apellido, usuario, contraseña, email, escuela, semestre, lugar, promedio);
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

  if (guardarButton) {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'secion.html';
      return;
    }
    if (editNombre) editNombre.value = user.nombre || '';
    if (editApellido) editApellido.value = user.apellido || '';
    if (editUsuario) editUsuario.value = user.usuario || '';
    if (editEmail) editEmail.value = user.email || '';
    if (editEscuela) editEscuela.value = user.escuela || '';
    if (editSemestre) editSemestre.value = user.semestre || '';
    if (editLugar) editLugar.value = user.lugar || '';
    if (editPromedio) editPromedio.value = user.promedio || '';

    guardarButton.addEventListener('click', () => {
      const nombre = editNombre.value.trim();
      const apellido = editApellido.value.trim();
      const email = editEmail.value.trim();
      const escuela = editEscuela.value.trim();
      const semestre = editSemestre.value.trim();
      const lugar = editLugar.value.trim();
      const promedio = editPromedio.value.trim();
      if (!nombre || !apellido) {
        editMensaje.textContent = 'Nombre y apellido son requeridos.';
        return;
      }
      if (updateUser(user.usuario, { nombre, apellido, email, escuela, semestre, lugar, promedio })) {
        editMensaje.textContent = 'Cambios guardados correctamente.';
        setTimeout(() => {
          window.location.href = 'menu.html';
        }, 1500);
      } else {
        editMensaje.textContent = 'Error al guardar cambios.';
      }
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
    if (estatusActual) {
      estatusActual.textContent = `Escuela: ${user.escuela || ''} · Semestre: ${user.semestre || ''} · Promedio: ${user.promedio || ''}`;
    }
    if (escuelaActual) {
      escuelaActual.textContent = user.escuela || '';
    }
    if (escuelasSeleccionadas) {
      escuelasSeleccionadas.innerHTML = '';
      if (user.escuela) {
        const li = document.createElement('li');
        li.textContent = user.escuela;
        escuelasSeleccionadas.appendChild(li);
      }
    }
    const mapFrame = document.getElementById('mapFrame');
    if (mapFrame) {
      const query = user.escuela ? `${user.escuela} ${user.lugar || ''}`.trim() : '';
      if (query) {
        mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=15`;
      }
    }
  }
});