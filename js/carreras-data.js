
// (function () { ... })() es un "IIFE": una función que se ejecuta
// sola, apenas se carga el archivo. Sirve para que las variables
// de aquí adentro (CATEGORY_LABELS, CAREERS, etc.) no choquen con
// variables de otros archivos que tengan el mismo nombre por accidente.
(function () {
 
  // ---- ESTO ES UN OBJETO DE DATOS (no es clase ni función) ----
  // Aquí solo guardo el nombre "bonito" de cada categoría de la encuesta
  const CATEGORY_LABELS = {
    TEC: 'Tecnología e Informática',
    ING: 'Ingeniería',
    ART: 'Arte y Diseño',
    HUM: 'Humanidades y Cs. Sociales',
    NEG: 'Negocios y Administración',
    SAL: 'Salud',
    CIE: 'Ciencias',
    DER: 'Derecho'
  };
 
  // otro objeto de datos: el color que le toca a cada categoría
  // (para pintar las gráficas de barras y pastel siempre igual)
  const CATEGORY_COLORS = {
    TEC: '#1f6feb',
    ING: '#0f766e',
    ART: '#8e44ad',
    HUM: '#e67e22',
    NEG: '#f1c40f',
    SAL: '#c0392b',
    CIE: '#2f8c52',
    DER: '#334e68'
  };
 
  // este es el objeto más importante: por cada categoría, dice
  // qué escuela, qué carreras y por qué motivo se le recomienda al usuario
  const CAREERS = {
    TEC: {
      escuela: 'Escuela de Ingeniería en Sistemas y Tecnología',
      carreras: ['Ingeniería en Sistemas Computacionales', 'Ingeniería en Software', 'Ciencia de Datos'],
      motivo: 'Tus respuestas muestran gusto por la lógica, la programación y resolver problemas técnicos.'
    },
    ING: {
      escuela: 'Escuela de Ingeniería',
      carreras: ['Ingeniería Civil', 'Ingeniería Mecánica', 'Ingeniería Electrónica', 'Ingeniería Industrial'],
      motivo: 'Tus respuestas muestran facilidad para procesos técnicos, cálculo y estructuras.'
    },
    ART: {
      escuela: 'Escuela de Arte y Diseño',
      carreras: ['Diseño Gráfico', 'Artes Visuales', 'Arquitectura'],
      motivo: 'Tus respuestas destacan sensibilidad estética y pensamiento creativo.'
    },
    HUM: {
      escuela: 'Escuela de Humanidades y Ciencias Sociales',
      carreras: ['Psicología', 'Relaciones Internacionales', 'Letras', 'Educación'],
      motivo: 'Tus respuestas muestran interés genuino por las personas, la sociedad y la comunicación.'
    },
    NEG: {
      escuela: 'Escuela de Negocios',
      carreras: ['Administración de Empresas', 'Contaduría Pública', 'Negocios Internacionales'],
      motivo: 'Tus respuestas reflejan visión estratégica, liderazgo y gusto por los negocios.'
    },
    SAL: {
      escuela: 'Escuela de Ciencias de la Salud',
      carreras: ['Medicina', 'Enfermería', 'Nutrición'],
      motivo: 'Tus respuestas muestran vocación de cuidado y facilidad para temas de salud.'
    },
    CIE: {
      escuela: 'Escuela de Ciencias',
      carreras: ['Biología', 'Química', 'Veterinaria'],
      motivo: 'Tus respuestas reflejan curiosidad científica y gusto por entender la naturaleza.'
    },
    DER: {
      escuela: 'Escuela de Derecho',
      carreras: ['Derecho', 'Ciencias Jurídicas'],
      motivo: 'Tus respuestas muestran gusto por la justicia, las normas y el análisis de casos.'
    }
  };
 
  // ---- ESTO ES UNA *FUNCIÓN* ----
  // Recibe los puntajes (ej. {TEC: 4, ART: 2, ...}) y regresa una
  // lista ordenada de mayor a menor, ya con su nombre bonito y su color
  // (map crea una lista nueva transformando cada elemento,
  // sort la ordena de mayor a menor puntaje)
  function getSortedEntries(scores) {
    return Object.keys(scores)
      .map((code) => ({
        code,
        label: CATEGORY_LABELS[code],
        color: CATEGORY_COLORS[code],
        value: Math.round(scores[code] * 10) / 10
      }))
      .sort((a, b) => b.value - a.value);
  }
 
  // ---- ESTO ES OTRA *FUNCIÓN* ----
  // Con la lista ya ordenada, agarra la categoría con más puntos (primary)
  // y revisa si la segunda está muy cerca (menos de 18% de diferencia):
  // si es así, se considera un "perfil mixto" y regresa también secondary
  function determinePrimarySecondary(scores) {
    const sorted = getSortedEntries(scores).filter((entry) => entry.value > 0);
    if (sorted.length === 0) return { primary: null, secondary: null };
 
    const primary = sorted[0];
    let secondary = null;
    if (sorted[1] && sorted[0].value > 0) {
      const gap = sorted[0].value - sorted[1].value;
      const relativeGap = gap / sorted[0].value;
      if (relativeGap <= 0.18) {
        secondary = sorted[1];
      }
    }
    return { primary, secondary };
  }
 
  // aquí "pegamos" todos estos datos y funciones al mismo objeto
  // window.UNICOMPASS que ya viene de storage.js, para que escuelas.js,
  // menu.js y encuesta.js puedan usarlos como api.CAREERS, api.getSortedEntries(), etc.
  window.UNICOMPASS = window.UNICOMPASS || {};
  Object.assign(window.UNICOMPASS, {
    CATEGORY_LABELS,
    CATEGORY_COLORS,
    CAREERS,
    getSortedEntries,
    determinePrimarySecondary
  });
})();
 