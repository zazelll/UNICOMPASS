
(function () {
  // QUESTIONS empieza vacío. Se llena cuando cargarPreguntasRemotas()
  // trae las preguntas activas desde la pestaña "Preguntas" del Sheet.
  var QUESTIONS = [];
 
  // ---- ESTO ES UNA *FUNCIÓN* (no es método de ninguna clase) ----
  // async = espera la respuesta de Google Sheets antes de seguir.
  // Si algo sale mal (sin internet, etc.) regresa false y ahí
  // se muestra un mensaje de error en vez de romper toda la página.
  async function cargarPreguntasRemotas() {
    try {
      var response = await fetch(GOOGLE_SHEET_WEBAPP_URL + '?action=preguntas');
      var data = await response.json();
      if (data && data.ok && Array.isArray(data.preguntas)) {
        QUESTIONS = data.preguntas;
      }
      return QUESTIONS.length > 0;
    } catch (error) {
      return false;
    }
  }
 
  // Las 4 secciones de la encuesta, en el orden en que se muestran
  var SECTIONS = ['gustos', 'habilidades', 'conocimientos', 'valores'];
 
  // El título y descripción que se muestra arriba de cada sección
  var SECTION_META = {
    gustos: {
      title: 'Gustos e Intereses',
      desc: 'No hay respuestas correctas o incorrectas, elige lo que más se parezca a ti.'
    },
    habilidades: {
      title: 'Habilidades',
      desc: 'Piensa en situaciones reales que ya te han pasado.'
    },
    conocimientos: {
      title: 'Conocimientos y Aptitudes',
      desc: 'Sobre lo que ya sabes o se te facilita aprender.'
    },
    valores: {
      title: 'Valores Laborales',
      desc: 'Sobre cómo te gustaría que fuera tu futuro trabajo.'
    }
  };
 
  // Paso 0 = intro, pasos 1-4 = las 4 secciones, paso 5 = confirmación = 6 pasos
  var TOTAL_STEPS = 6;
 
  // ---- ESTO ES UNA *CLASE* Y ADEMÁS ES *HERENCIA* ----
  // "class SurveyPage extends PageBase" hace que SurveyPage herede
  // los métodos de ayuda de PageBase (que está en storage.js): get(),
  // setText(), redirect(), etc. Así aquí no hay que reescribirlos.
  class SurveyPage extends PageBase {
    constructor(api, elements) {
      super(api); // "super" llama al constructor del papá (PageBase) primero
      this.api = api;
      this.elements = elements;
      this.answers = {}; // aquí se van guardando las respuestas: { idPregunta: numeroDeOpcion }
      this.currentStep = 0;
      this.user = null;
    }
 
    init() {
      this.user = this.api.getCurrentUser();
      if (!this.user) {
        this.redirect('secion.html'); // método heredado de PageBase
        return;
      }
 
      if (this.elements.nombreCompleto) {
        this.elements.nombreCompleto.textContent = (this.user.nombre || '') + ' ' + (this.user.apellido || '');
      }
      if (this.elements.usuarioActual) {
        this.elements.usuarioActual.textContent = this.user.usuario || '';
      }
 
      // aquí se conectan los botones (Anterior, Siguiente, Enviar)
      // con sus funciones. ".bind(this)" es para que adentro de esas
      // funciones "this" siga apuntando a la clase, no al botón.
      if (this.elements.prevButton) {
        this.elements.prevButton.addEventListener('click', this.goToStep.bind(this, this.currentStep - 1));
      }
      if (this.elements.nextButton) {
        this.elements.nextButton.addEventListener('click', this.onNextClick.bind(this));
      }
      if (this.elements.quizQuestions) {
        this.elements.quizQuestions.addEventListener('change', this.onAnswerChange.bind(this));
      }
      if (this.elements.finishButton) {
        this.elements.finishButton.addEventListener('click', this.finishSurvey.bind(this));
      }
 
      this.renderStep();
    }
 
    // se dispara cada vez que el usuario marca una opción (radio button)
    onAnswerChange(event) {
      if (!event.target || !event.target.name) {
        return;
      }
      var name = event.target.name;
      if (name.indexOf('q_') !== 0) {
        return; // si el input que cambió no es de una pregunta, no hace nada
      }
      var qid = name.slice(2); // le quita el "q_" de adelante para quedarse solo con el id
      this.answers[qid] = Number(event.target.value);
      this.clearStepWarning();
    }
 
    // se dispara al picarle a "Siguiente"
    onNextClick() {
      if (!this.validateCurrentStep()) {
        return; // si faltan preguntas por responder, no avanza
      }
      this.goToStep(this.currentStep + 1);
    }
 
    clearStepWarning() {
      if (this.elements.stepWarning) {
        this.elements.stepWarning.textContent = '';
      }
    }
 
    // cambia de paso (0 a 5) y vuelve a dibujar la pantalla
    goToStep(step) {
      if (step < 0 || step > TOTAL_STEPS - 1) {
        return;
      }
      this.currentStep = step;
      this.renderStep();
    }
 
    // regresa solo las preguntas que le tocan a una sección
    // (gustos, habilidades, conocimientos o valores)
    questionsForSection(section) {
      var result = [];
      for (var i = 0; i < QUESTIONS.length; i += 1) {
        if (QUESTIONS[i].section === section) {
          result.push(QUESTIONS[i]);
        }
      }
      return result;
    }
 
    // dibuja en pantalla el paso actual: muestra/oculta los bloques
    // (intro, quiz, final) y actualiza la barra de progreso
    renderStep() {
      var stepIntro = this.elements.stepIntro;
      var stepQuiz = this.elements.stepQuiz;
      var stepFinal = this.elements.stepFinal;
      var quizSectionTitle = this.elements.quizSectionTitle;
      var quizSectionDesc = this.elements.quizSectionDesc;
      var prevButton = this.elements.prevButton;
      var nextButton = this.elements.nextButton;
      var stepNav = this.elements.stepNav;
      var progressFill = this.elements.progressFill;
      var progressLabel = this.elements.progressLabel;
 
      if (stepIntro) {
        stepIntro.style.display = this.currentStep === 0 ? 'block' : 'none';
      }
      if (stepQuiz) {
        stepQuiz.style.display = this.currentStep >= 1 && this.currentStep <= 4 ? 'block' : 'none';
      }
      if (stepFinal) {
        stepFinal.style.display = this.currentStep === 5 ? 'block' : 'none';
      }
 
      if (this.currentStep >= 1 && this.currentStep <= 4) {
        var section = SECTIONS[this.currentStep - 1];
        var meta = SECTION_META[section];
        if (quizSectionTitle) {
          quizSectionTitle.textContent = meta.title;
        }
        if (quizSectionDesc) {
          quizSectionDesc.textContent = meta.desc;
        }
        this.renderQuestions(section);
      }
 
      if (prevButton) {
        prevButton.disabled = this.currentStep === 0;
      }
      if (nextButton) {
        nextButton.style.display = this.currentStep === 5 ? 'none' : 'inline-flex';
      }
      if (stepNav) {
        stepNav.style.display = 'flex';
      }
 
      var percent = Math.round((this.currentStep / (TOTAL_STEPS - 1)) * 100);
      if (progressFill) {
        progressFill.style.width = percent + '%';
      }
      if (progressLabel) {
        progressLabel.textContent = 'Paso ' + (this.currentStep + 1) + ' de ' + TOTAL_STEPS;
      }
 
      this.clearStepWarning();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
 
    // arma el HTML de todas las preguntas de una sección (con sus 4 opciones)
    // y lo mete al contenedor. Si ya había una respuesta guardada,
    // deja esa opción marcada con "checked".
    renderQuestions(section) {
      var container = this.elements.quizQuestions;
      if (!container) {
        return;
      }
      var questions = this.questionsForSection(section);
      var html = '';
 
      for (var i = 0; i < questions.length; i += 1) {
        var question = questions[i];
        var optionsHtml = '';
        for (var j = 0; j < question.options.length; j += 1) {
          var option = question.options[j];
          var checked = this.answers[question.id] === j ? 'checked' : '';
          var inputId = 'opt_' + question.id + '_' + j;
          optionsHtml +=
            '<label class="option-item" for="' + inputId + '">' +
            '<input type="radio" id="' + inputId + '" name="q_' + question.id + '" value="' + j + '" ' + checked + '>' +
            '<span>' + option.text + '</span>' +
            '</label>';
        }
        html +=
          '<div class="question-card">' +
          '<h3>' + (i + 1) + '. ' + question.text + '</h3>' +
          '<div class="option-list">' + optionsHtml + '</div>' +
          '</div>';
      }
 
      container.innerHTML = html;
    }
 
    // revisa que todas las preguntas de la sección actual ya
    // tengan respuesta antes de dejar avanzar al siguiente paso
    validateCurrentStep() {
      if (this.currentStep < 1 || this.currentStep > 4) {
        return true; // en la intro o en el final no hay que validar preguntas
      }
      var section = SECTIONS[this.currentStep - 1];
      var questions = this.questionsForSection(section);
      var missing = false;
      for (var i = 0; i < questions.length; i += 1) {
        if (this.answers[questions[i].id] === undefined) {
          missing = true;
          break;
        }
      }
      if (missing) {
        if (this.elements.stepWarning) {
          this.elements.stepWarning.textContent = 'Responde todas las preguntas de esta sección para continuar.';
        }
        return false;
      }
      return true;
    }
 
    // este es el corazón de la encuesta: recorre TODAS las preguntas
    // ya respondidas y suma los puntos a cada categoría (TEC, ART, etc.)
    // según la opción que se eligió en cada una
    computeScores() {
      function emptyScores() {
        return { TEC: 0, ING: 0, ART: 0, HUM: 0, NEG: 0, SAL: 0, CIE: 0, DER: 0 };
      }
      var categoryScores = emptyScores(); // el total general
      var habilidadesScores = emptyScores(); // solo secciones habilidades + conocimientos
      var estadisticasScores = emptyScores(); // solo secciones gustos + valores
 
      for (var i = 0; i < QUESTIONS.length; i += 1) {
        var question = QUESTIONS[i];
        var selected = this.answers[question.id];
        if (selected === undefined) {
          continue; // si no la respondió, no suma nada
        }
        var option = question.options[selected];
        var cats = option.cats;
        if (!cats || !cats.length) {
          continue; // opciones "neutrales" no suman a ninguna categoría
        }
 
        // si una opción tiene 2 categorías (ej. "TEC,ING"), el punto se reparte entre las 2
        var points = 1 / cats.length;
        var isHabilidadGroup = question.section === 'habilidades' || question.section === 'conocimientos';
        var isEstadisticaGroup = question.section === 'gustos' || question.section === 'valores';
        for (var j = 0; j < cats.length; j += 1) {
          var cat = cats[j];
          categoryScores[cat] += points;
          if (isHabilidadGroup) {
            habilidadesScores[cat] += points;
          }
          if (isEstadisticaGroup) {
            estadisticasScores[cat] += points;
          }
        }
      }
 
      return { categoryScores: categoryScores, habilidadesScores: habilidadesScores, estadisticasScores: estadisticasScores };
    }
 
    // se dispara al picarle a "Enviar y ver resultados": arma el
    // resultado final y lo manda a Google Sheets con api.updateUser()
    async finishSurvey() {
      var agreement = document.querySelector('input[name="agreement"]:checked');
      if (!agreement) {
        if (this.elements.surveyMessage) {
          this.elements.surveyMessage.textContent = 'Selecciona si estás de acuerdo con tus respuestas antes de enviar.';
          this.elements.surveyMessage.style.color = '#c0392b';
        }
        return;
      }
 
      if (agreement.value === 'no') {
        if (this.elements.surveyMessage) {
          this.elements.surveyMessage.textContent = 'Usa "Anterior" para revisar y ajustar tus respuestas.';
          this.elements.surveyMessage.style.color = '#c0392b';
        }
        return;
      }
 
      var results = this.computeScores();
      // determinePrimarySecondary viene de carreras-data.js: decide cuál
      // categoría "ganó" (primary) y si hay una segunda muy cercana (secondary)
      var primarySecondary = this.api.determinePrimarySecondary(results.categoryScores);
      var primary = primarySecondary.primary;
      var secondary = primarySecondary.secondary;
 
      var carreraSelect = document.getElementById('carreraSelect');
      var otraCarreraInput = document.getElementById('otraCarreraInput');
      var porQueElegiste = document.getElementById('porQueElegiste');
      var cambiarOpcion = document.getElementById('cambiarOpcion');
      var informacionExtra = document.getElementById('informacionExtra');
      var comentarioInput = document.getElementById('comentarioInput');
 
      var otraCarrera = otraCarreraInput ? otraCarreraInput.value.trim() : '';
      var carreraDeseada = otraCarrera;
      if (!carreraDeseada && carreraSelect) {
        carreraDeseada = carreraSelect.value;
      }
 
      // este es el objeto final con TODO el resultado de la encuesta
      var vocacionalResultado = {
        fecha: new Date().toISOString(),
        categoryScores: results.categoryScores,
        habilidadesScores: results.habilidadesScores,
        estadisticasScores: results.estadisticasScores,
        categoriaPrincipal: primary ? primary.code : null,
        categoriaSecundaria: secondary ? secondary.code : null,
        carreraDeseada: carreraDeseada,
        razonEleccion: porQueElegiste ? porQueElegiste.value.trim() : '',
        cambioOpcion: cambiarOpcion ? cambiarOpcion.value.trim() : '',
        informacionExtra: informacionExtra ? informacionExtra.value.trim() : ''
      };
 
      var comentario = '';
      if (comentarioInput) {
        comentario = comentarioInput.value.trim();
      }
 
      // aquí se manda TODO a Google Sheets (esto también guarda una copia
      // local en el navegador para que escuelas.html pueda leerla al instante)
      var ok = await this.api.updateUser(this.user.usuario, { vocacionalResultado: vocacionalResultado, comentario: comentario });
      if (this.elements.surveyMessage) {
        if (ok) {
          this.elements.surveyMessage.textContent = 'Tus respuestas fueron enviadas. Revisa tus resultados en Escuelas.';
          this.elements.surveyMessage.style.color = '#2f8c52';
          try {
            if (window.HISTORIAL_INTENTOS) {
              window.HISTORIAL_INTENTOS.guardarIntento(this.user.usuario, vocacionalResultado);
            }
          } catch (e) {
            console.warn('No se pudo guardar en el historial local:', e);
          }
        } else {
          this.elements.surveyMessage.textContent = 'No se pudieron guardar tus respuestas. Intenta de nuevo.';
          this.elements.surveyMessage.style.color = '#c0392b';
          return;
        }
      }
 
      setTimeout(function () {
        window.location.href = 'escuelas.html';
      }, 1200);
    }
  }
 
  // esto se ejecuta apenas termina de cargar el HTML de la página
  document.addEventListener('DOMContentLoaded', async function () {
    var api = window.UNICOMPASS;
    if (!api) {
      return;
    }
 
    var progressLabel = document.getElementById('quizProgressLabel');
    if (progressLabel) {
      progressLabel.textContent = 'Cargando encuesta...';
    }
 
    // primero hay que esperar a que lleguen las preguntas antes de mostrar nada
    var cargoBien = await cargarPreguntasRemotas();
    if (!cargoBien) {
      if (progressLabel) {
        progressLabel.textContent = 'No se pudieron cargar las preguntas. Intenta más tarde.';
      }
      return;
    }
 
    var elements = {
      nombreCompleto: document.getElementById('nombreCompleto'),
      usuarioActual: document.getElementById('usuarioActual'),
      stepIntro: document.getElementById('stepIntro'),
      stepQuiz: document.getElementById('stepQuiz'),
      stepFinal: document.getElementById('stepFinal'),
      quizSectionTitle: document.getElementById('quizSectionTitle'),
      quizSectionDesc: document.getElementById('quizSectionDesc'),
      quizQuestions: document.getElementById('quizQuestions'),
      stepWarning: document.getElementById('stepWarning'),
      stepNav: document.getElementById('stepNav'),
      prevButton: document.getElementById('prevStepButton'),
      nextButton: document.getElementById('nextStepButton'),
      progressFill: document.getElementById('quizProgressFill'),
      progressLabel: document.getElementById('quizProgressLabel'),
      finishButton: document.getElementById('finishSurveyButton'),
      surveyMessage: document.getElementById('surveyMessage')
    };
 
    // "new SurveyPage(...)" crea el objeto real a partir de la clase (instanciar)
    var page = new SurveyPage(api, elements);
    page.init();
  });
})();
 