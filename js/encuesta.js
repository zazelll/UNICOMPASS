
(function () {
  var QUESTIONS = [];

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

  var SECTIONS = ['gustos', 'habilidades', 'conocimientos', 'valores'];
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

  var TOTAL_STEPS = 6;

  class SurveyPage extends PageBase {
    constructor(api, elements) {
      super(api);
      this.api = api;
      this.elements = elements;
      this.answers = {};
      this.currentStep = 0;
      this.user = null;
    }

    init() {
      this.user = this.api.getCurrentUser();
      if (!this.user) {
        this.redirect('secion.html');
        return;
      }

      if (this.elements.nombreCompleto) {
        this.elements.nombreCompleto.textContent = (this.user.nombre || '') + ' ' + (this.user.apellido || '');
      }
      if (this.elements.usuarioActual) {
        this.elements.usuarioActual.textContent = this.user.usuario || '';
      }

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

    onAnswerChange(event) {
      if (!event.target || !event.target.name) {
        return;
      }
      var name = event.target.name;
      if (name.indexOf('q_') !== 0) {
        return;
      }
      var qid = name.slice(2);
      this.answers[qid] = Number(event.target.value);
      this.clearStepWarning();
    }

    onNextClick() {
      if (!this.validateCurrentStep()) {
        return;
      }
      this.goToStep(this.currentStep + 1);
    }

    clearStepWarning() {
      if (this.elements.stepWarning) {
        this.elements.stepWarning.textContent = '';
      }
    }

    goToStep(step) {
      if (step < 0 || step > TOTAL_STEPS - 1) {
        return;
      }
      this.currentStep = step;
      this.renderStep();
    }

    questionsForSection(section) {
      var result = [];
      for (var i = 0; i < QUESTIONS.length; i += 1) {
        if (QUESTIONS[i].section === section) {
          result.push(QUESTIONS[i]);
        }
      }
      return result;
    }

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

    validateCurrentStep() {
      if (this.currentStep < 1 || this.currentStep > 4) {
        return true;
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

    computeScores() {
      function emptyScores() {
        return { TEC: 0, ING: 0, ART: 0, HUM: 0, NEG: 0, SAL: 0, CIE: 0, DER: 0 };
      }
      var categoryScores = emptyScores();
      var habilidadesScores = emptyScores();
      var estadisticasScores = emptyScores();

      for (var i = 0; i < QUESTIONS.length; i += 1) {
        var question = QUESTIONS[i];
        var selected = this.answers[question.id];
        if (selected === undefined) {
          continue;
        }
        var option = question.options[selected];
        var cats = option.cats;
        if (!cats || !cats.length) {
          continue;
        }

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

      var ok = await this.api.updateUser(this.user.usuario, { vocacionalResultado: vocacionalResultado, comentario: comentario });
      if (this.elements.surveyMessage) {
        if (ok) {
          this.elements.surveyMessage.textContent = 'Tus respuestas fueron enviadas. Revisa tus resultados en Escuelas.';
          this.elements.surveyMessage.style.color = '#2f8c52';
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

  document.addEventListener('DOMContentLoaded', async function () {
    var api = window.UNICOMPASS;
    if (!api) {
      return;
    }

    var progressLabel = document.getElementById('quizProgressLabel');
    if (progressLabel) {
      progressLabel.textContent = 'Cargando encuesta...';
    }

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

    var page = new SurveyPage(api, elements);
    page.init();
  });
})();