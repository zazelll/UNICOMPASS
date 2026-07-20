// Se usa solo en admin.html, después de que el admin inicia sesión.

let preguntasCargadas = [];
let filaEnEdicion = null; // null = estamos agregando una pregunta nueva

function mostrarPreguntasEnTabla() {
  const tbody = document.querySelector('#preguntasTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  preguntasCargadas.forEach((pregunta) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${pregunta.section}</td>
      <td>${pregunta.text}</td>
      <td>${pregunta.activa ? 'Sí' : 'No'}</td>
      <td>
        <button class="button" onclick="editarPreguntaEnFormulario(${pregunta.fila})" type="button">Editar</button>
        <button class="button button-danger" onclick="eliminarPreguntaClick(${pregunta.fila})" type="button">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

async function cargarPreguntasAdmin() {
  const mensaje = document.getElementById('preguntasMensaje');
  if (mensaje) mensaje.textContent = 'Cargando...';

  const url = `${GOOGLE_SHEET_WEBAPP_URL}?token=${encodeURIComponent(ADMIN_TOKEN)}&action=preguntasAdmin`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  if (!datos.ok) {
    if (mensaje) mensaje.textContent = `Error: ${datos.error}`;
    return;
  }

  preguntasCargadas = datos.preguntas;
  mostrarPreguntasEnTabla();
  if (mensaje) mensaje.textContent = `${preguntasCargadas.length} pregunta(s) encontradas.`;
}

function editarPreguntaEnFormulario(fila) {
  const pregunta = preguntasCargadas.find((p) => p.fila === fila);
  if (!pregunta) return;

  filaEnEdicion = fila;

  document.getElementById('preguntaSeccion').value = pregunta.section;
  document.getElementById('preguntaTexto').value = pregunta.text;
  document.getElementById('preguntaActiva').value = pregunta.activa ? 'si' : 'no';

  const letras = ['A', 'B', 'C', 'D'];
  letras.forEach((letra, i) => {
    const opcion = pregunta.options[i];
    document.getElementById('opcion' + letra + 'Texto').value = opcion ? opcion.text : '';
    document.getElementById('opcion' + letra + 'Categoria').value = opcion ? opcion.cats.join(',') : '';
  });

  document.getElementById('formPreguntaTitulo').textContent = 'Editando pregunta';
  document.getElementById('guardarPreguntaButton').textContent = 'Guardar cambios';
  document.getElementById('cancelarEdicionButton').style.display = 'inline-flex';
}

function cancelarEdicionPregunta() {
  filaEnEdicion = null;
  document.getElementById('preguntaTexto').value = '';
  ['A', 'B', 'C', 'D'].forEach((letra) => {
    document.getElementById('opcion' + letra + 'Texto').value = '';
    document.getElementById('opcion' + letra + 'Categoria').value = '';
  });
  document.getElementById('preguntaActiva').value = 'si';
  document.getElementById('formPreguntaTitulo').textContent = 'Agregar pregunta nueva';
  document.getElementById('guardarPreguntaButton').textContent = 'Agregar pregunta';
  document.getElementById('cancelarEdicionButton').style.display = 'none';
}

function datosDelFormularioPregunta() {
  return {
    token: ADMIN_TOKEN,
    fila: filaEnEdicion,
    seccion: document.getElementById('preguntaSeccion').value,
    pregunta: document.getElementById('preguntaTexto').value.trim(),
    activa: document.getElementById('preguntaActiva').value === 'si',
    opcionA: document.getElementById('opcionATexto').value.trim(),
    categoriaA: document.getElementById('opcionACategoria').value.trim(),
    opcionB: document.getElementById('opcionBTexto').value.trim(),
    categoriaB: document.getElementById('opcionBCategoria').value.trim(),
    opcionC: document.getElementById('opcionCTexto').value.trim(),
    categoriaC: document.getElementById('opcionCCategoria').value.trim(),
    opcionD: document.getElementById('opcionDTexto').value.trim(),
    categoriaD: document.getElementById('opcionDCategoria').value.trim()
  };
}

async function guardarPreguntaClick() {
  const mensaje = document.getElementById('guardarPreguntaMensaje');
  const datos = datosDelFormularioPregunta();

  if (!datos.pregunta || !datos.opcionA || !datos.opcionB || !datos.opcionC || !datos.opcionD) {
    mensaje.textContent = 'Completa la pregunta y las 4 opciones.';
    return;
  }

  datos.accion = filaEnEdicion ? 'editarPregunta' : 'agregarPregunta';

  const respuesta = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  });
  const resultado = await respuesta.json();

  if (resultado.ok) {
    mensaje.textContent = 'Guardado correctamente.';
    cancelarEdicionPregunta();
    cargarPreguntasAdmin();
  } else {
    mensaje.textContent = `Error: ${resultado.error}`;
  }
}

async function eliminarPreguntaClick(fila) {
  const confirmar = confirm('¿Seguro que quieres eliminar esta pregunta?');
  if (!confirmar) return;

  const respuesta = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ accion: 'eliminarPregunta', token: ADMIN_TOKEN, fila })
  });
  const resultado = await respuesta.json();

  if (resultado.ok) {
    cargarPreguntasAdmin();
  } else {
    alert('Error: ' + resultado.error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cargarPreguntasButton = document.getElementById('cargarPreguntasButton');
  const guardarPreguntaButton = document.getElementById('guardarPreguntaButton');
  const cancelarEdicionButton = document.getElementById('cancelarEdicionButton');

  if (cargarPreguntasButton) cargarPreguntasButton.addEventListener('click', cargarPreguntasAdmin);
  if (guardarPreguntaButton) guardarPreguntaButton.addEventListener('click', guardarPreguntaClick);
  if (cancelarEdicionButton) cancelarEdicionButton.addEventListener('click', cancelarEdicionPregunta);
});
