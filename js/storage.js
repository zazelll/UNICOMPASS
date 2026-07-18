(function () {
  class StorageService {
    constructor() {
      this.USERS_KEY = 'usuarios_comas';
      this.CURRENT_KEY = 'usuario_actual';
    }

    getUsers() {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    }

    saveUsers(users) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    findUser(usuario) {
      return this.getUsers().find((u) => u.usuario === usuario);
    }

    saveCurrentUser(user) {
      localStorage.setItem(this.CURRENT_KEY, JSON.stringify(user));
    }

    getCurrentUser() {
      return JSON.parse(localStorage.getItem(this.CURRENT_KEY) || 'null');
    }

    clearCurrentUser() {
      localStorage.removeItem(this.CURRENT_KEY);
    }
  }

  class AuthService extends StorageService {
    registerUser(nombre, apellido, usuario, contraseña, email, estado, municipio) {
      if (this.findUser(usuario)) return false;
      const users = this.getUsers();
      users.push({ nombre, apellido, usuario, contraseña, email, estado, municipio });
      this.saveUsers(users);
      return true;
    }

    // Arma una dirección legible a partir de estado/municipio (catálogo real de INEGI),
    // usada para las búsquedas de mapa (menú y escuelas).
    getDireccionCompleta(user) {
      if (!user) return '';
      const partes = [user.municipio, user.estado].filter(Boolean);
      return partes.join(', ').trim();
    }

    loginUser(usuario, contraseña) {
      const user = this.findUser(usuario);
      if (user && user.contraseña === contraseña) {
        this.saveCurrentUser(user);
        return true;
      }
      return false;
    }

    updateUser(usuarioName, updatedData) {
      const users = this.getUsers();
      const userIndex = users.findIndex((u) => u.usuario === usuarioName);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        this.saveUsers(users);
        this.saveCurrentUser(users[userIndex]);
        return true;
      }
      return false;
    }

    isAdmin(usuario, contraseña) {
      return usuario === 'aza' && contraseña === '123';
    }
  }

  const authService = new AuthService();

  window.UNICOMPASS = window.UNICOMPASS || {};
  Object.assign(window.UNICOMPASS, {
    getUsers: authService.getUsers.bind(authService),
    saveUsers: authService.saveUsers.bind(authService),
    findUser: authService.findUser.bind(authService),
    saveCurrentUser: authService.saveCurrentUser.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService),
    clearCurrentUser: authService.clearCurrentUser.bind(authService),
    registerUser: authService.registerUser.bind(authService),
    getDireccionCompleta: authService.getDireccionCompleta.bind(authService),
    loginUser: authService.loginUser.bind(authService),
    updateUser: authService.updateUser.bind(authService),
    isAdmin: authService.isAdmin.bind(authService)
  });
})();