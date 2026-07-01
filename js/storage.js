(function () {
  const USERS_KEY = 'usuarios_comas';
  const CURRENT_KEY = 'usuario_actual';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUser(usuario) {
    return getUsers().find((u) => u.usuario === usuario);
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

  function registerUser(nombre, apellido, usuario, contraseña, email, escuela, semestre, lugar, promedio, nivelEscuela) {
    if (findUser(usuario)) return false;
    const users = getUsers();
    users.push({ nombre, apellido, usuario, contraseña, email, escuela, semestre, lugar, promedio, nivelEscuela });
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
    const userIndex = users.findIndex((u) => u.usuario === usuarioName);
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

  window.UNICOMPASS = window.UNICOMPASS || {};
  Object.assign(window.UNICOMPASS, {
    getUsers,
    saveUsers,
    findUser,
    saveCurrentUser,
    getCurrentUser,
    clearCurrentUser,
    registerUser,
    loginUser,
    updateUser,
    isAdmin
  });
})();
