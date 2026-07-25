// este archivo es lo que usa el admin para ver, agregar, editar
// y eliminar las preguntas de la encuesta, directo desde admin.html
// (sin tener que meterse a editar el Google Sheet a mano)

// ---- ESTO ES UNA *CLASE* Y ADEMÁS ES *HERENCIA* ----
// "class AdminPreguntasPage extends PageBase" hereda de PageBase
// (la clase de storage.js), por eso puede usar this.get(id) sin
// tener que volver a escribir document.getElementById() cada vez.
class AdminPreguntasPage extends PageBase {
  constructor(api) {
    super(api); // llama primero al constructor del papá (PageBase)
    this.api = api;
    this.preguntasCargadas = []; // aquí se guarda la lista de preguntas que trae del Sheet
    this.filaEnEdicion = null; // null = estamos agregando una pregunta nueva, no editando
    this.mensaje = null;
    this.tbody = null;
    this.cargarPreguntasButton = null;
    this.guardarPreguntaButton = null;
    this.cancelarEdicionButton = null;
  }

  init() {
    this.mensaje = this.get('preguntasMensaje');
    this.tbody = this.get('preguntasTable') ? this.get('preguntasTable').querySelector('tbody') : null;
    this.cargarPreguntasButton = this.get('cargarPreguntasButton');
    this.guardarPreguntaButton = this.get('guardarPreguntaButton');
    this.cancelarEdicionButton = this.get('cancelarEdicionButton');

    // aquí se conectan los botones con sus funciones.
    // ".bind(this)" hace que adentro de esas funciones "this" siga
    // apuntando a la clase (AdminPreguntasPage), no al botón que se picó.
    if (this.cargarPreguntasButton) {
      this.cargarPreguntasButton.addEventListener('click', this.cargarPreguntasAdmin.bind(this));
    }
    if (this.guardarPreguntaButton) {
      this.guardarPreguntaButton.addEventListener('click', this.guardarPreguntaClick.bind(this));
    }
    if (this.cancelarEdicionButton) {
      this.cancelarEdicionButton.addEventListener('click', this.cancelarEdicionPregunta.bind(this));
    }
  }

  setMensaje(text) {
    if (this.mensaje) {
      this.mensaje.textContent = text;
    }
  }

  // arma la tabla completa con todas las preguntas cargadas,
  // y a cada fila le pone su botón de Editar y su botón de Eliminar
  mostrarPreguntasEnTabla() {
    if (!this.tbody) return;
    this.tbody.innerHTML = '';

    for (var i = 0; i < this.preguntasCargadas.length; i += 1) {
      var pregunta = this.preguntasCargadas[i];
      var fila = document.createElement('tr');
      var sectionCell = document.createElement('td');
      sectionCell.textContent = pregunta.section;
      var textCell = document.createElement('td');
      textCell.textContent = pregunta.text;
      var activeCell = document.createElement('td');
      activeCell.textContent = pregunta.activa ? 'Sí' : 'No';
      var actionsCell = document.createElement('td');

      var editarButton = document.createElement('button');
      editarButton.type = 'button';
      editarButton.className = 'button';
      editarButton.textContent = 'Editar';
      // ".bind(this, pregunta.fila)" ya deja "amarrado" el número de
      // fila de ESTA pregunta específica, para cuando se pique el botón
      editarButton.addEventListener('click', this.editarPreguntaEnFormulario.bind(this, pregunta.fila));

      var eliminarButton = document.createElement('button');
      eliminarButton.type = 'button';
      eliminarButton.className = 'button button-danger';
      eliminarButton.textContent = 'Eliminar';
      eliminarButton.addEventListener('click', this.eliminarPreguntaClick.bind(this, pregunta.fila));

      actionsCell.appendChild(editarButton);
      actionsCell.appendChild(eliminarButton);
      fila.appendChild(sectionCell);
      fila.appendChild(textCell);
      fila.appendChild(activeCell);
      fila.appendChild(actionsCell);
      this.tbody.appendChild(fila);
    }
  }

  // le pide a Apps Script (con el token de admin) TODAS las preguntas
  // (activas e inactivas) para poder mostrarlas y editarlas aquí
  async cargarPreguntasAdmin() {
    this.setMensaje('Cargando...');
    var url = GOOGLE_SHEET_WEBAPP_URL + '?token=' + encodeURIComponent(ADMIN_TOKEN) + '&action=preguntasAdmin';
    var respuesta = await fetch(url);
    var datos = await respuesta.json();

    if (!datos.ok) {
      this.setMensaje('Error: ' + datos.error);
      return;
    }

    this.preguntasCargadas = datos.preguntas || [];
    this.mostrarPreguntasEnTabla();
    this.setMensaje(this.preguntasCargadas.length + ' pregunta(s) encontradas.');
  }

  // cuando se pica "Editar" en una fila: busca esa pregunta en la
  // lista ya cargada y llena el formulario de abajo con sus datos
  editarPreguntaEnFormulario(fila) {
    var pregunta = null;
    for (var i = 0; i < this.preguntasCargadas.length; i += 1) {
      if (this.preguntasCargadas[i].fila === fila) {
        pregunta = this.preguntasCargadas[i];
        break;
      }
    }
    if (!pregunta) return;

    this.filaEnEdicion = fila; // a partir de aquí, guardar = editar esta fila (no agregar una nueva)
    this.get('preguntaSeccion').value = pregunta.section;
    this.get('preguntaTexto').value = pregunta.text;
    this.get('preguntaActiva').value = pregunta.activa ? 'si' : 'no';

    var letras = ['A', 'B', 'C', 'D'];
    for (var j = 0; j < letras.length; j += 1) {
      var letra = letras[j];
      var opcion = pregunta.options[j] || { text: '', cats: [] };
      this.get('opcion' + letra + 'Texto').value = opcion.text || '';
      this.get('opcion' + letra + 'Categoria').value = opcion.cats.join(',');
    }

    this.get('formPreguntaTitulo').textContent = 'Editando pregunta';
    this.get('guardarPreguntaButton').textContent = 'Guardar cambios';
    this.get('cancelarEdicionButton').style.display = 'inline-flex';
  }

  // limpia el formulario y lo regresa al modo "agregar pregunta nueva"
  cancelarEdicionPregunta() {
    this.filaEnEdicion = null;
    this.get('preguntaTexto').value = '';
    var letras = ['A', 'B', 'C', 'D'];
    for (var i = 0; i < letras.length; i += 1) {
      this.get('opcion' + letras[i] + 'Texto').value = '';
      this.get('opcion' + letras[i] + 'Categoria').value = '';
    }
    this.get('preguntaActiva').value = 'si';
    this.get('formPreguntaTitulo').textContent = 'Agregar pregunta nueva';
    this.get('guardarPreguntaButton').textContent = 'Agregar pregunta';
    this.get('cancelarEdicionButton').style.display = 'none';
  }

  // junta todo lo que hay escrito en el formulario en un solo objeto,
  // listo para mandarlo a Apps Script
  datosDelFormularioPregunta() {
    return {
      token: ADMIN_TOKEN,
      fila: this.filaEnEdicion,
      seccion: this.get('preguntaSeccion').value,
      pregunta: this.get('preguntaTexto').value.trim(),
      activa: this.get('preguntaActiva').value === 'si',
      opcionA: this.get('opcionATexto').value.trim(),
      categoriaA: this.get('opcionACategoria').value.trim(),
      opcionB: this.get('opcionBTexto').value.trim(),
      categoriaB: this.get('opcionBCategoria').value.trim(),
      opcionC: this.get('opcionCTexto').value.trim(),
      categoriaC: this.get('opcionCCategoria').value.trim(),
      opcionD: this.get('opcionDTexto').value.trim(),
      categoriaD: this.get('opcionDCategoria').value.trim()
    };
  }

  // se dispara al picarle a "Agregar pregunta" / "Guardar cambios".
  // Si this.filaEnEdicion tiene un número, edita esa fila; si es
  // null, agrega una pregunta nueva. Los dos casos usan el mismo botón.
  async guardarPreguntaClick() {
    var datos = this.datosDelFormularioPregunta();
    if (!datos.pregunta || !datos.opcionA || !datos.opcionB || !datos.opcionC || !datos.opcionD) {
      this.setMensaje('Completa la pregunta y las 4 opciones.');
      return;
    }

    datos.accion = this.filaEnEdicion ? 'editarPregunta' : 'agregarPregunta';
    var respuesta = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos)
    });
    var resultado = await respuesta.json();

    if (resultado.ok) {
      this.setMensaje('Guardado correctamente.');
      this.cancelarEdicionPregunta();
      this.cargarPreguntasAdmin(); // vuelve a cargar la tabla para ver el cambio reflejado
    } else {
      this.setMensaje('Error: ' + resultado.error);
    }
  }

  // se dispara al picarle a "Eliminar" en una fila
  async eliminarPreguntaClick(fila) {
    var confirmar = confirm('¿Seguro que quieres eliminar esta pregunta?');
    if (!confirmar) return;

    var respuesta = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: 'eliminarPregunta', token: ADMIN_TOKEN, fila: fila })
    });
    var resultado = await respuesta.json();

    if (resultado.ok) {
      this.cargarPreguntasAdmin();
    } else {
      alert('Error: ' + resultado.error);
    }
  }
}

// esto se ejecuta apenas termina de cargar el HTML de admin.html
document.addEventListener('DOMContentLoaded', function () {
  var page = new AdminPreguntasPage(window.UNICOMPASS); // se crea el objeto real (se "instancia" la clase)
  page.init();
});