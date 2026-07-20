(function () {
<<<<<<< Updated upstream
  function Q(id, section, text, opts) {
    return {
      id,
      section,
      text,
      options: opts.map((o) => ({ label: o[0], text: o[1], cats: o[2] }))
    };
  }

  // ---------------------------------------------------------------------
  // Banco de preguntas. Cada opción suma puntos a una o dos categorías:
  // TEC, ING, ART, HUM, NEG, SAL, CIE, DER (ver js/carreras-data.js)
  // ---------------------------------------------------------------------
  const QUESTIONS = [
    // --- Sección 1: Gustos e Intereses ---
    Q('g1', 'gustos', '¿Sobre qué tema te resulta más interesante conversar por horas?', [
      ['a', 'Nuevos gadgets, software o avances científicos', ['TEC', 'CIE']],
      ['b', 'Películas, música, diseño o corrientes artísticas', ['ART']],
      ['c', 'Política, historia, psicología o problemas sociales', ['HUM']],
      ['d', 'Estrategias para ganar dinero, criptomonedas o empresas', ['NEG']]
    ]),
    Q('g2', 'gustos', 'En un videojuego, ¿qué es lo que más disfrutas hacer?', [
      ['a', 'Construir bases, gestionar recursos o resolver acertijos lógicos', ['TEC', 'ING']],
      ['b', 'Explorar la historia profunda de los personajes y el mundo', ['HUM']],
      ['c', 'Personalizar la estética de mi personaje y el entorno', ['ART']],
      ['d', 'Administrar la economía del juego y comerciar', ['NEG']]
    ]),
    Q('g3', 'gustos', 'Si tuvieras presupuesto ilimitado para un proyecto personal, ¿qué harías?', [
      ['a', 'Abrir mi propia empresa o franquicia', ['NEG']],
      ['b', 'Crear una fundación para ayudar a personas o animales', ['SAL', 'HUM']],
      ['c', 'Desarrollar una nueva aplicación o invento tecnológico', ['TEC']],
      ['d', 'Financiar la producción de una película, disco o galería', ['ART']]
    ]),
    Q('g4', 'gustos', '¿Qué tipo de noticias sueles leer o seguir con más frecuencia?', [
      ['a', 'Descubrimientos médicos o investigaciones sobre la naturaleza', ['SAL', 'CIE']],
      ['b', 'Movimientos en la bolsa de valores y startups', ['NEG']],
      ['c', 'Reseñas culturales, exposiciones o moda', ['ART']],
      ['d', 'Avances en inteligencia artificial o ciberseguridad', ['TEC']]
    ]),
    Q('g5', 'gustos', 'Si escribieras un libro, ¿de qué género sería?', [
      ['a', 'Un manual de liderazgo y éxito financiero', ['NEG']],
      ['b', 'Ciencia ficción pura y viajes espaciales', ['TEC', 'CIE']],
      ['c', 'Un ensayo sobre la mente humana o la historia mundial', ['HUM']],
      ['d', 'Una novela gráfica, poesía o libro de ilustración', ['ART']]
    ]),
    Q('g6', 'gustos', '¿Qué actividad prefieres hacer al aire libre?', [
      ['a', 'Identificar plantas, observar animales o entender el ecosistema', ['CIE', 'SAL']],
      ['b', 'Fotografía de paisajes o dibujar al natural', ['ART']],
      ['c', 'Organizar un evento comunitario o platicar con gente nueva', ['HUM']],
      ['d', 'Pensar en cómo mejorar la infraestructura del lugar', ['ING']]
    ]),
    Q('g7', 'gustos', 'Si visitas una ciudad nueva, ¿qué museo eliges primero?', [
      ['a', 'Museo de Historia Natural o Anatomía', ['SAL', 'CIE']],
      ['b', 'Museo de Arte Contemporáneo o Bellas Artes', ['ART']],
      ['c', 'Museo de la Innovación, Industria o Tecnología', ['TEC']],
      ['d', 'Museo de Historia Nacional o Antropología', ['HUM']]
    ]),
    Q('g8', 'gustos', '¿Qué tipo de aplicaciones dominan tu celular?', [
      ['a', 'Finanzas, gestión de tareas y productividad', ['NEG']],
      ['b', 'Edición de fotos, video y dibujo', ['ART']],
      ['c', 'Redes sociales para debatir y leer noticias', ['HUM']],
      ['d', 'Juegos de lógica, programación o simuladores', ['TEC']]
    ]),
    Q('g9', 'gustos', '¿Qué te llama más la atención cuando ves una película?', [
      ['a', 'Los efectos especiales y cómo se grabó técnicamente', ['ING', 'ART']],
      ['b', 'El desarrollo psicológico de los personajes', ['HUM']],
      ['c', 'El vestuario, la paleta de colores y la banda sonora', ['ART']],
      ['d', 'Cuánto dinero costó hacerla y cuánto recaudó en taquilla', ['NEG']]
    ]),
    Q('g10', 'gustos', 'Si pudieras viajar en el tiempo, ¿cuál sería tu objetivo?', [
      ['a', 'Conocer a los grandes pintores, músicos o arquitectos', ['ART']],
      ['b', 'Entender cómo funcionaban las sociedades y gobiernos del pasado', ['HUM']],
      ['c', 'Ir al futuro para ver los avances tecnológicos', ['TEC']],
      ['d', 'Ver cómo era la flora, fauna o la medicina antigua', ['CIE', 'SAL']]
    ]),
    Q('g11', 'gustos', '¿A quién prefieres seguir en redes sociales?', [
      ['a', 'Emprendedores, CEOs o inversionistas', ['NEG']],
      ['b', 'Artistas, ilustradores o creadores de contenido audiovisual', ['ART']],
      ['c', 'Divulgadores de ciencia, tecnología o medicina', ['CIE', 'TEC']],
      ['d', 'Activistas, periodistas o escritores', ['HUM']]
    ]),
    Q('g12', 'gustos', '¿Cómo ordenas tus cosas (tu cuarto o escritorio)?', [
      ['a', 'Con un sistema altamente funcional y práctico, aunque no se vea bonito', ['ING']],
      ['b', 'Busco que todo se vea estéticamente agradable y combine', ['ART']],
      ['c', 'Me enfoco en mantener todo estéril y extremadamente limpio', ['SAL']],
      ['d', 'No soy muy ordenado físicamente, todo está en mi cabeza o en carpetas digitales', []]
    ]),

    // --- Sección 2: Habilidades ---
    Q('h1', 'habilidades', 'Cuando hay un conflicto entre dos amigos, tu rol suele ser:', [
      ['a', 'Escuchar a ambos y mediar para que se entiendan', ['HUM']],
      ['b', 'Analizar quién tiene la razón basándome en los hechos objetivos', ['CIE', 'DER']],
      ['c', 'No meterme, prefiero evitar los dramas sociales', []],
      ['d', 'Proponer un acuerdo donde ambos ganen algo', ['NEG']]
    ]),
    Q('h2', 'habilidades', '¿Qué tan bueno eres armando muebles con instrucciones (ej. IKEA)?', [
      ['a', 'Excelente, entiendo los diagramas a la perfección y me sobra tiempo', ['ING']],
      ['b', 'Me frustra, prefiero pagarle a alguien o que alguien más lo haga', ['NEG']],
      ['c', 'Lo armo, pero le añado mi toque personal o lo pinto', ['ART']],
      ['d', 'Lo intento, pero muchas veces me sobran piezas', ['HUM']]
    ]),
    Q('h3', 'habilidades', '¿Qué facilidad tienes para vender una idea o un producto a otra persona?', [
      ['a', 'Mucha, sé leer lo que la otra persona quiere escuchar', ['NEG']],
      ['b', 'Poca, me incomoda tratar de convencer a la gente', ['TEC', 'CIE']],
      ['c', 'Solo si puedo usar argumentos altamente lógicos y demostrables', ['ING']],
      ['d', 'Prefiero convencer a través de imágenes o un diseño atractivo', ['ART']]
    ]),
    Q('h4', 'habilidades', 'Ante una emergencia física (alguien se desmaya o se lastima), ¿cómo reaccionas?', [
      ['a', 'Mantengo la calma y sé cómo aplicar primeros auxilios básicos', ['SAL']],
      ['b', 'Me paralizo o me da mucha impresión ver sangre', ['NEG', 'ART']],
      ['c', 'Analizo rápidamente la estructura del lugar para pedir ayuda', ['ING']],
      ['d', 'Consuelo a los acompañantes de la persona afectada', ['HUM']]
    ]),
    Q('h5', 'habilidades', 'Si tienes que redactar un ensayo o texto largo:', [
      ['a', 'Se me da muy bien, las palabras fluyen y estructuro bien los argumentos', ['HUM', 'DER']],
      ['b', 'Odio escribir paja, prefiero entregar un reporte con puro código o datos', ['TEC']],
      ['c', 'Prefiero hacer una presentación en PowerPoint muy visual', ['ART']],
      ['d', 'Lo enfoco en cómo los resultados pueden mejorar una métrica', ['NEG']]
    ]),
    Q('h6', 'habilidades', '¿Qué tan detallista eres visualmente?', [
      ['a', 'Noto de inmediato si un color no combina o si algo está descentrado', ['ART']],
      ['b', 'Noto errores ortográficos o inconsistencias en un texto', ['HUM']],
      ['c', 'Noto errores en fórmulas, facturas o en la lógica de un proceso', ['TEC', 'NEG']],
      ['d', 'Solo me fijo en el panorama general, no en los detalles', ['NEG']]
    ]),
    Q('h7', 'habilidades', '¿Cómo te va administrando tu propio dinero?', [
      ['a', 'Excelente, llevo un registro de ingresos y gastos, y trato de invertir', ['NEG']],
      ['b', 'Mal, lo gasto impulsivamente en cosas que me gustan estéticamente', ['ART']],
      ['c', 'Lo uso principalmente para comprar mejores equipos o herramientas', ['TEC']],
      ['d', 'Me preocupo más por ayudar a otros que por acumularlo', ['HUM', 'SAL']]
    ]),
    Q('h8', 'habilidades', '¿Cuál es tu nivel de empatía al escuchar los problemas de los demás?', [
      ['a', 'Muy alto, me pongo en sus zapatos y me afecta su estado de ánimo', ['SAL', 'HUM']],
      ['b', 'Bajo, prefiero darles la solución técnica a su problema y ya', ['ING']],
      ['c', 'Medio, trato de animarlos invitándolos a hacer algo divertido', ['ART']],
      ['d', 'Analizo qué ganan o pierden con ese problema', ['NEG']]
    ]),
    Q('h9', 'habilidades', 'Frente a una tarea muy repetitiva y detallada (ej. capturar cientos de datos):', [
      ['a', 'Me concentro fácilmente y lo termino sin errores', ['CIE', 'TEC']],
      ['b', 'Me vuelvo loco, necesito estímulos nuevos y creativos constantemente', ['ART']],
      ['c', 'Busco cómo automatizarlo creando un pequeño script o fórmula', ['TEC']],
      ['d', 'Lo delego a otra persona y yo superviso el resultado', ['NEG']]
    ]),
    Q('h10', 'habilidades', '¿Qué tanta destreza manual tienes (cirugía, modelado 3D, reparación de circuitos)?', [
      ['a', 'Mucha, tengo pulso firme y me gusta el trabajo microscópico/preciso', ['SAL', 'TEC']],
      ['b', 'Mucha, pero orientada a pintar, esculpir o manualidades', ['ART']],
      ['c', 'Poca, soy más de pensar conceptos generales abstractos', ['HUM']],
      ['d', 'Poca, prefiero usar el teclado o hablar', ['NEG']]
    ]),
    Q('h11', 'habilidades', 'Al aprender un software nuevo y complejo, tú:', [
      ['a', 'Pico todos los botones hasta entender la lógica del sistema', ['TEC', 'ING']],
      ['b', 'Busco un curso estructurado o leo el manual primero', ['HUM']],
      ['c', 'Solo aprendo las herramientas gráficas que me sirven para crear', ['ART']],
      ['d', 'Pregunto si este software realmente me ahorrará tiempo y dinero', ['NEG']]
    ]),
    Q('h12', 'habilidades', '¿Qué tal se te da coordinar a un grupo de personas rebeldes?', [
      ['a', 'Bien, sé motivarlos, delegar tareas y hacer que cumplan la meta', ['NEG']],
      ['b', 'Bien, uso la empatía y la comunicación para entender sus frustraciones', ['HUM']],
      ['c', 'Mal, prefiero hacer el trabajo yo solo para asegurarme de que quede bien', ['TEC', 'ART']],
      ['d', 'Les impongo reglas estrictas y lógicas para que funcionen', ['ING']]
    ]),
    Q('h13', 'habilidades', '¿Tienes facilidad para hablar en público frente a muchas personas?', [
      ['a', 'Sí, me encanta ser el centro de atención y persuadir a la audiencia', ['NEG', 'ART']],
      ['b', 'Sí, siempre y cuando exponga datos duros o investigaciones científicas', ['CIE']],
      ['c', 'No, me pone muy nervioso y prefiero trabajar tras bambalinas', ['TEC', 'ING']],
      ['d', 'Sí, si es para defender una causa social justa o enseñar', ['HUM']]
    ]),
    Q('h14', 'habilidades', 'Cuando te pierdes en una ciudad, ¿cómo te ubicas?', [
      ['a', 'Mentalmente tengo un mapa claro del norte/sur y las calles', ['ING']],
      ['b', 'Me fijo en puntos de referencia visuales (monumentos, colores)', ['ART']],
      ['c', 'Le pregunto sin problema a los habitantes locales', ['HUM']],
      ['d', 'Uso el GPS y calculo la ruta más eficiente en tiempo', ['TEC', 'NEG']]
    ]),
    Q('h15', 'habilidades', '¿Cómo se te dan los idiomas extranjeros?', [
      ['a', 'Muy bien, capto rápido la gramática y el vocabulario', ['HUM']],
      ['b', 'Entiendo la lógica del idioma casi como si fuera código de programación', ['TEC']],
      ['c', 'Prefiero el lenguaje musical o visual antes que el hablado', ['ART']],
      ['d', 'Solo aprendo las frases necesarias para hacer negociaciones o viajar', ['NEG']]
    ]),

    // --- Sección 3: Conocimientos y Aptitudes ---
    Q('c1', 'conocimientos', 'En la preparatoria, ¿qué materia pasabas con buenas notas sin esforzarte mucho?', [
      ['a', 'Matemáticas, Física o Química', ['ING', 'CIE']],
      ['b', 'Historia, Literatura o Ética', ['HUM']],
      ['c', 'Biología o Ciencias de la Salud', ['SAL', 'CIE']],
      ['d', 'Taller de lectura, Artes o Diseño', ['ART']]
    ]),
    Q('c2', 'conocimientos', 'Cuando ves una gráfica de barras o un reporte estadístico:', [
      ['a', 'Entiendo rápidamente la tendencia y saco conclusiones matemáticas', ['ING', 'NEG']],
      ['b', 'Me fijo en si la paleta de colores y el diseño de la gráfica son atractivos', ['ART']],
      ['c', 'Me pregunto qué contexto social hay detrás de esos números', ['HUM']],
      ['d', 'Me cuestan trabajo los números, prefiero que me expliquen con texto', ['HUM', 'ART']]
    ]),
    Q('c3', 'conocimientos', '¿Qué tanta facilidad tienes para comprender cómo funciona el cuerpo humano?', [
      ['a', 'Mucha, me fascinan los procesos celulares, órganos y enfermedades', ['SAL', 'CIE']],
      ['b', 'Poca, me resulta complejo o me da impresión', ['NEG', 'TEC']],
      ['c', 'Lo entiendo como si fuera una máquina perfecta con piezas conectadas', ['ING']],
      ['d', 'Me interesa más la mente humana que el cuerpo físico', ['HUM']]
    ]),
    Q('c4', 'conocimientos', 'Si te explican un problema complejo de la sociedad (ej. pobreza extrema):', [
      ['a', 'Pienso en soluciones económicas y creación de empleos', ['NEG']],
      ['b', 'Pienso en leyes, educación y políticas públicas', ['HUM', 'DER']],
      ['c', 'Pienso en infraestructura urbana o tecnología agrícola', ['ING']],
      ['d', 'Pienso en crear campañas visuales para generar consciencia', ['ART']]
    ]),
    Q('c5', 'conocimientos', '¿Qué tan fácil se te da el cálculo mental rápido (porcentajes, divisiones)?', [
      ['a', 'Muy fácil, rara vez uso calculadora para cosas simples', ['CIE', 'NEG']],
      ['b', 'Difícil, siempre verifico con calculadora para no equivocarme', ['SAL', 'HUM']],
      ['c', 'Lo hago bien, pero me gustan más las matemáticas algebraicas abstractas', ['TEC']],
      ['d', 'No es mi fuerte, mi inteligencia es más verbal o visual', ['ART', 'HUM']]
    ]),
    Q('c6', 'conocimientos', 'Frente a las reglas físicas del universo (gravedad, electricidad, termodinámica):', [
      ['a', 'Me resultan intuitivas y me gusta aplicar fórmulas para predecirlas', ['ING']],
      ['b', 'Las entiendo pero me interesan más los fenómenos biológicos o químicos', ['SAL']],
      ['c', 'Prefiero filosofar sobre el origen del universo que calcular su masa', ['HUM']],
      ['d', 'Las ignoro, a menos que me sirvan para animar un objeto en 3D', ['ART']]
    ]),
    Q('c7', 'conocimientos', '¿Cómo retienes mejor la información a largo plazo?', [
      ['a', 'Construyendo mapas mentales o dibujando esquemas', ['ART']],
      ['b', 'Leyendo y repitiendo los textos o debatiéndolos', ['HUM']],
      ['c', 'Aplicando la fórmula en un ejercicio práctico o un programa de computadora', ['TEC']],
      ['d', 'Asociando los datos a su valor práctico en la vida real', ['NEG']]
    ]),
    Q('c8', 'conocimientos', '¿Qué tanto sabes o te interesa aprender sobre el mercado de valores y economía?', [
      ['a', 'Mucho, me gusta saber cómo fluye el dinero mundialmente', ['NEG']],
      ['b', 'Solo lo suficiente para administrar mi propio sueldo', ['SAL', 'CIE']],
      ['c', 'Me parece un sistema frío, me interesan más los modelos de economía solidaria', ['HUM']],
      ['d', 'Lo automatizaría con un algoritmo para no tener que pensarlo', ['TEC']]
    ]),
    Q('c9', 'conocimientos', '¿Qué facilidad tienes para detectar ritmos, simetrías y proporciones?', [
      ['a', 'Mucha, tengo muy buen "ojo" u "oído" para las artes', ['ART']],
      ['b', 'Mucha, pero la aplico para diseñar puentes o arquitectura', ['ING']],
      ['c', 'Poca, no suelo prestarle atención a la estética de las cosas', ['CIE', 'TEC']],
      ['d', 'Me fijo más en el significado de la obra que en sus proporciones matemáticas', ['HUM']]
    ]),
    Q('c10', 'conocimientos', '¿Cómo reaccionas ante el método científico (hipótesis, experimentación, conclusión)?', [
      ['a', 'Es la única forma válida de comprobar la realidad para mí', ['CIE', 'SAL']],
      ['b', 'Es útil, pero creo que las ciencias sociales no pueden medirse igual', ['HUM']],
      ['c', 'Prefiero la lógica de la programación: si compila, funciona', ['TEC']],
      ['d', 'Prefiero explorar la realidad a través de la subjetividad y el arte', ['ART']]
    ]),
    Q('c11', 'conocimientos', '¿Qué nivel de cultura general tienes sobre historia y geopolítica mundial?', [
      ['a', 'Alto, me gusta saber de guerras, imperios y tratados internacionales', ['HUM', 'DER']],
      ['b', 'Alto, pero enfocado en la historia de las invenciones y la industria', ['ING']],
      ['c', 'Bajo, me interesa más el presente financiero y las proyecciones a futuro', ['NEG']],
      ['d', 'Medio, me interesa más la historia de los movimientos artísticos', ['ART']]
    ]),
    Q('c12', 'conocimientos', 'Ante una base de datos gigante y desordenada:', [
      ['a', 'Me emociona pensar en filtrar, limpiar y programar consultas', ['TEC']],
      ['b', 'Busco la manera de extraer conclusiones para vender más', ['NEG']],
      ['c', 'Me abruma, los números fríos sin contexto humano no me gustan', ['HUM', 'ART']],
      ['d', 'La organizaría visualmente en infografías para que sea entendible', ['ART']]
    ]),
    Q('c13', 'conocimientos', '¿Tienes facilidad para entender diagramas de flujo y algoritmos?', [
      ['a', 'Sí, mi cerebro funciona de manera secuencial (Paso A lleva a Paso B)', ['TEC', 'ING']],
      ['b', 'Sí, pero aplicados a la logística de envíos o empresas', ['NEG']],
      ['c', 'No, mi pensamiento es más abstracto y no lineal', ['ART', 'HUM']],
      ['d', 'Los uso solo para entender rutas metabólicas en biología', ['SAL']]
    ]),
    Q('c14', 'conocimientos', 'Cuando lees un contrato o un documento legal lleno de cláusulas:', [
      ['a', 'Lo analizo meticulosamente buscando lagunas lógicas o trampas', ['DER', 'NEG']],
      ['b', 'Me aburre profundamente, me salto a donde tengo que firmar', ['ART', 'TEC']],
      ['c', 'Me fijo en el formato del texto y la tipografía elegida', ['ART']],
      ['d', 'Trato de traducirlo a un lenguaje de código (If esto, Then lo otro)', ['TEC']]
    ]),
    Q('c15', 'conocimientos', 'En un debate, ¿cuál es tu mayor fortaleza?', [
      ['a', 'Citar leyes, eventos históricos o pensadores filosóficos', ['HUM']],
      ['b', 'Mostrar gráficas, métricas de crecimiento y costos reales', ['NEG']],
      ['c', 'Demostrar el punto empíricamente con un experimento o hardware', ['CIE', 'TEC']],
      ['d', 'Apelar a la empatía, los valores humanos y el bienestar de los afectados', ['SAL', 'HUM']]
    ]),

    // --- Sección 4: Valores Laborales ---
    Q('v1', 'valores', '¿Qué tipo de ingreso prefieres en tu futuro trabajo?', [
      ['a', 'Sueldo fijo, alto y muy seguro, con todas las prestaciones de ley', ['SAL', 'ING']],
      ['b', 'Ingreso variable: que dependa de cuántas comisiones o tratos cierre', ['NEG']],
      ['c', 'Ingreso por proyecto: cobrar por mis obras gráficas o de código a mi propio ritmo', ['ART', 'TEC']],
      ['d', 'El sueldo es secundario, me importa más que mi trabajo ayude a la sociedad', ['HUM']]
    ]),
    Q('v2', 'valores', '¿Cuál es tu postura sobre viajar por trabajo?', [
      ['a', 'Me encantaría viajar constantemente cerrando tratos internacionales', ['NEG']],
      ['b', 'Me gustaría viajar para dar atención médica humanitaria o educar', ['SAL', 'HUM']],
      ['c', 'Prefiero trabajar 100% remoto desde mi casa usando mi computadora', ['TEC', 'ART']],
      ['d', 'Viajaría solo para asistir a congresos científicos o supervisar obras civiles', ['ING', 'CIE']]
    ]),
    Q('v3', 'valores', '¿Qué nivel de riesgo estás dispuesto a asumir en tu carrera?', [
      ['a', 'Alto: invertiría todos mis ahorros en mi propia empresa o startup', ['NEG']],
      ['b', 'Alto: apostaría todo por mi carrera artística aunque sea inestable al principio', ['ART']],
      ['c', 'Bajo: prefiero la estabilidad de un hospital, juzgado o corporativo establecido', ['SAL', 'DER']],
      ['d', 'Medio: me arriesgaría solo si los datos y probabilidades matemáticas están a mi favor', ['TEC', 'ING']]
    ]),
    Q('v4', 'valores', '¿Qué opinas de usar uniforme, bata o traje todos los días?', [
      ['a', 'Me gusta, representa profesionalismo, estatus o higiene', ['SAL', 'NEG']],
      ['b', 'Lo acepto si es estrictamente necesario por seguridad industrial', ['ING']],
      ['c', 'Lo detesto, quiero vestir tan cómodo o raro como yo decida', ['ART', 'TEC']],
      ['d', 'No me importa, me adapto a la norma social del lugar', ['HUM']]
    ]),
    Q('v5', 'valores', '¿Cómo te relacionas con las normas estrictas y los protocolos rígidos?', [
      ['a', 'Son vitales; un error de protocolo en mi área puede costar vidas o millones', ['SAL', 'ING']],
      ['b', 'Los respeto, pero busco cómo optimizarlos para ahorrar tiempo', ['NEG', 'TEC']],
      ['c', 'Son una guía, pero hay que flexibilizarlos según el contexto humano', ['HUM']],
      ['d', 'Son un obstáculo; la creatividad necesita que se rompan las reglas', ['ART']]
    ]),
    Q('v6', 'valores', '¿Qué tan importante es para ti el reconocimiento público (fama o prestigio)?', [
      ['a', 'Muy importante, quiero que mi obra artística sea recordada', ['ART']],
      ['b', 'Importante, pero prefiero el respeto corporativo o ser un gerente famoso', ['NEG']],
      ['c', 'Poco importante, me basta con saber que mi código o investigación funciona', ['TEC', 'CIE']],
      ['d', 'Lo rechazo, prefiero el anonimato ayudando a los demás en silencio', ['SAL', 'HUM']]
    ]),
    Q('v7', 'valores', '¿Qué estructura de horario prefieres?', [
      ['a', 'Horario fijo de lunes a viernes, para poder desconectarme el fin de semana', ['ING', 'HUM']],
      ['b', 'Horario nocturno o rotativo, no me molesta hacer guardias largas', ['SAL']],
      ['c', 'Trabajo 100% por objetivos, a cualquier hora si me inspiro', ['TEC', 'ART']],
      ['d', 'Trabajaría todo el día sin horario si el negocio es mío', ['NEG']]
    ]),
    Q('v8', 'valores', '¿Estarías dispuesto a tener en tus manos la responsabilidad de la vida de alguien más?', [
      ['a', 'Sí, de forma directa (como médico, cirujano o paramédico)', ['SAL']],
      ['b', 'Sí, de forma indirecta (asegurando que un puente o software no falle y mate gente)', ['ING', 'TEC']],
      ['c', 'Solo me haría responsable de la salud mental, legal o emocional de la persona', ['HUM', 'DER']],
      ['d', 'No, es demasiada presión; prefiero trabajar con objetos, arte o dinero', ['ART', 'NEG']]
    ]),
    Q('v9', 'valores', '¿Cuál sería para ti el peor ambiente de trabajo?', [
      ['a', 'Un entorno burocrático y lento donde no se puede innovar tecnológicamente', ['TEC', 'ING']],
      ['b', 'Un espacio sin ventanas, gris, que reprima la autoexpresión estética', ['ART']],
      ['c', 'Un lugar donde haya injusticia social y no pueda hacer nada al respecto', ['HUM', 'DER']],
      ['d', 'Un sitio donde todos ganen lo mismo sin importar quién se esfuerce más', ['NEG']]
    ]),
    Q('v10', 'valores', '¿Con quién preferirías relacionarte día a día en el trabajo?', [
      ['a', 'Con máquinas, servidores, algoritmos o microscopios', ['TEC', 'CIE']],
      ['b', 'Con pacientes vulnerables, estudiantes o comunidades necesitadas', ['SAL', 'HUM']],
      ['c', 'Con clientes de alto poder adquisitivo e inversionistas', ['NEG']],
      ['d', 'Con otros creativos, músicos, diseñadores o actores', ['ART']]
    ]),
    Q('v11', 'valores', '¿Qué tanto trabajo físico estás dispuesto a hacer?', [
      ['a', 'Nada, quiero estar sentado frente a una computadora todo el tiempo', ['TEC', 'NEG']],
      ['b', 'Moderado, estar de pie todo el día en quirófanos o clínicas no me asusta', ['SAL']],
      ['c', 'Mucho, me gustaría ensuciarme las manos en obras, motores o trabajo de campo', ['ING', 'CIE']],
      ['d', 'Depende de mi proyecto creativo (ej. armar escenarios, esculpir, etc.)', ['ART']]
    ]),
    Q('v12', 'valores', '¿Qué opinas de estudiar de por vida para mantenerte actualizado?', [
      ['a', 'Es indispensable, los lenguajes de programación y hardware cambian cada mes', ['TEC']],
      ['b', 'Es mi deber ético, siempre hay nuevos tratamientos y medicinas', ['SAL']],
      ['c', 'Prefiero estudiar las leyes o las nuevas tendencias de mercado constantemente', ['DER', 'NEG']],
      ['d', 'Estudiar técnicas está bien, pero el talento natural es lo que manda', ['ART']]
    ]),
    Q('v13', 'valores', '¿Qué te motivaría a renunciar inmediatamente a un trabajo?', [
      ['a', 'Que me pidan hacer algo fraudulento con el dinero o romper la ley', ['DER', 'NEG']],
      ['b', 'Que se comprometa la seguridad estructural o sanitaria por ahorrar dinero', ['ING', 'SAL']],
      ['c', 'Que usen mi código o tecnología para fines no éticos', ['TEC']],
      ['d', 'Que me obliguen a diseñar algo que va en contra de mi visión estética o moral', ['ART', 'HUM']]
    ]),
    Q('v14', 'valores', '¿Cómo manejas la competencia agresiva con tus compañeros de trabajo?', [
      ['a', 'Me motiva a producir más ventas y subir de puesto más rápido', ['NEG']],
      ['b', 'Me parece tóxica, prefiero entornos colaborativos donde todos se cuiden', ['SAL', 'HUM']],
      ['c', 'La ignoro, dejo que la calidad de mi trabajo o de mis cálculos hable por mí', ['ING', 'TEC']],
      ['d', 'Me enfoco únicamente en mi propia evolución y estilo único', ['ART']]
    ]),
    Q('v15', 'valores', 'Finalmente, define qué es para ti el "Éxito Profesional":', [
      ['a', 'Ser libre financieramente, liderar mi imperio y jubilarme joven', ['NEG']],
      ['b', 'Haber salvado vidas, educado a muchos o mejorado las leyes de mi país', ['SAL', 'HUM']],
      ['c', 'Construir o programar un sistema que usen millones de personas a diario', ['TEC', 'ING']],
      ['d', 'Vivir de lo que amo hacer con mis manos y mi imaginación, dejando mi huella', ['ART']]
    ])
  ];

  const SECTIONS = ['gustos', 'habilidades', 'conocimientos', 'valores'];
  const SECTION_META = {
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
=======
  // Las preguntas ya NO se escriben aquí. Siempre se traen desde la pestaña
  // "Preguntas" de tu Google Sheet, la misma que edita el admin desde admin.html.
  // Cada respuesta trae su(s) categoría(s) (TEC, ING, ART, HUM, NEG, SAL, CIE, DER)
  // y con eso se suman los puntos para saber la carrera del usuario.
  let QUESTIONS = [];

  async function cargarPreguntasRemotas() {
    try {
      const response = await fetch(`${GOOGLE_SHEET_WEBAPP_URL}?action=preguntas`);
      const data = await response.json();

      if (data && data.ok && Array.isArray(data.preguntas)) {
        QUESTIONS = data.preguntas;
      }
    } catch (error) {
      console.warn('No se pudieron cargar las preguntas desde Google Sheets:', error);
    }

    return QUESTIONS.length > 0;
  }

  const SECTIONS = ['gustos', 'habilidades', 'conocimientos', 'valores'];
  const SECTION_META = {
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
>>>>>>> Stashed changes
  };

  // Pasos: 0 = intro (datos ya en el HTML), 1-4 = secciones del quiz, 5 = datos extra + confirmación
  const TOTAL_STEPS = 6;

  class SurveyEngine {
    constructor(api, elements) {
      this.api = api;
      this.elements = elements;
      this.answers = {}; // { questionId: optionIndex }
      this.currentStep = 0;
      this.user = null;
    }

    init() {
      this.user = this.api.getCurrentUser();
      if (!this.user) {
        window.location.href = 'secion.html';
        return;
      }

      if (this.elements.nombreCompleto) {
        this.elements.nombreCompleto.textContent = `${this.user.nombre || ''} ${this.user.apellido || ''}`.trim();
      }
      if (this.elements.usuarioActual) this.elements.usuarioActual.textContent = this.user.usuario || '';
<<<<<<< Updated upstream
      if (this.elements.nivelEscuelaActual) this.elements.nivelEscuelaActual.textContent = this.user.nivelEscuela || '';
=======
>>>>>>> Stashed changes

      if (this.elements.prevButton) {
        this.elements.prevButton.addEventListener('click', () => this.goToStep(this.currentStep - 1));
      }
      if (this.elements.nextButton) {
        this.elements.nextButton.addEventListener('click', () => {
          if (!this.validateCurrentStep()) return;
          this.goToStep(this.currentStep + 1);
        });
      }
      if (this.elements.quizQuestions) {
        this.elements.quizQuestions.addEventListener('change', (event) => {
          if (event.target && event.target.name && event.target.name.startsWith('q_')) {
            const qid = event.target.name.slice(2);
            this.answers[qid] = Number(event.target.value);
            this.clearStepWarning();
          }
        });
      }
      if (this.elements.finishButton) {
        this.elements.finishButton.addEventListener('click', () => this.finishSurvey());
      }

      this.renderStep();
    }

    clearStepWarning() {
      if (this.elements.stepWarning) this.elements.stepWarning.textContent = '';
    }

    goToStep(step) {
      if (step < 0 || step > TOTAL_STEPS - 1) return;
      this.currentStep = step;
      this.renderStep();
    }

    questionsForSection(section) {
      return QUESTIONS.filter((q) => q.section === section);
    }

    renderStep() {
      const { stepIntro, stepQuiz, stepFinal, quizSectionTitle, quizSectionDesc, prevButton, nextButton, stepNav, progressFill, progressLabel } = this.elements;

      if (stepIntro) stepIntro.style.display = this.currentStep === 0 ? 'block' : 'none';
      if (stepQuiz) stepQuiz.style.display = this.currentStep >= 1 && this.currentStep <= 4 ? 'block' : 'none';
      if (stepFinal) stepFinal.style.display = this.currentStep === 5 ? 'block' : 'none';

      if (this.currentStep >= 1 && this.currentStep <= 4) {
        const section = SECTIONS[this.currentStep - 1];
        const meta = SECTION_META[section];
        if (quizSectionTitle) quizSectionTitle.textContent = meta.title;
        if (quizSectionDesc) quizSectionDesc.textContent = meta.desc;
        this.renderQuestions(section);
      }

      if (prevButton) prevButton.disabled = this.currentStep === 0;
      if (nextButton) nextButton.style.display = this.currentStep === 5 ? 'none' : 'inline-flex';
      if (stepNav) stepNav.style.display = 'flex';

      const percent = Math.round((this.currentStep / (TOTAL_STEPS - 1)) * 100);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressLabel) progressLabel.textContent = `Paso ${this.currentStep + 1} de ${TOTAL_STEPS}`;

      this.clearStepWarning();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderQuestions(section) {
      const container = this.elements.quizQuestions;
      if (!container) return;
      const questions = this.questionsForSection(section);

      container.innerHTML = questions
        .map((question, index) => {
          const optionsHtml = question.options
            .map((option, optIndex) => {
              const checked = this.answers[question.id] === optIndex ? 'checked' : '';
              const inputId = `opt_${question.id}_${optIndex}`;
              return `
                <label class="option-item" for="${inputId}">
                  <input type="radio" id="${inputId}" name="q_${question.id}" value="${optIndex}" ${checked}>
                  <span>${option.text}</span>
                </label>`;
            })
            .join('');

          return `
            <div class="question-card">
              <h3>${index + 1}. ${question.text}</h3>
              <div class="option-list">${optionsHtml}</div>
            </div>`;
        })
        .join('');
    }

    validateCurrentStep() {
      if (this.currentStep < 1 || this.currentStep > 4) return true;
      const section = SECTIONS[this.currentStep - 1];
      const questions = this.questionsForSection(section);
      const missing = questions.some((q) => this.answers[q.id] === undefined);

      if (missing) {
        if (this.elements.stepWarning) {
          this.elements.stepWarning.textContent = 'Responde todas las preguntas de esta sección para continuar.';
        }
        return false;
      }
      return true;
    }

    computeScores() {
      const empty = () => ({ TEC: 0, ING: 0, ART: 0, HUM: 0, NEG: 0, SAL: 0, CIE: 0, DER: 0 });
      const categoryScores = empty();
      const habilidadesScores = empty(); // habilidades + conocimientos
      const estadisticasScores = empty(); // gustos + valores

      QUESTIONS.forEach((question) => {
        const selected = this.answers[question.id];
        if (selected === undefined) return;
        const option = question.options[selected];
        const cats = option.cats;
        if (!cats || cats.length === 0) return;

        const points = 1 / cats.length;
        const isHabilidadGroup = question.section === 'habilidades' || question.section === 'conocimientos';
        const isEstadisticaGroup = question.section === 'gustos' || question.section === 'valores';

        cats.forEach((cat) => {
          categoryScores[cat] += points;
          if (isHabilidadGroup) habilidadesScores[cat] += points;
          if (isEstadisticaGroup) estadisticasScores[cat] += points;
        });
      });

      return { categoryScores, habilidadesScores, estadisticasScores };
    }

<<<<<<< Updated upstream
    finishSurvey() {
=======
    async finishSurvey() {
>>>>>>> Stashed changes
      const agreement = document.querySelector('input[name="agreement"]:checked');
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

      const { categoryScores, habilidadesScores, estadisticasScores } = this.computeScores();
      const { primary, secondary } = this.api.determinePrimarySecondary(categoryScores);

      const carreraSelect = document.getElementById('carreraSelect');
      const otraCarreraInput = document.getElementById('otraCarreraInput');
      const porQueElegiste = document.getElementById('porQueElegiste');
      const cambiarOpcion = document.getElementById('cambiarOpcion');
      const informacionExtra = document.getElementById('informacionExtra');

      const otraCarrera = otraCarreraInput ? otraCarreraInput.value.trim() : '';
      const carreraDeseada = otraCarrera || (carreraSelect ? carreraSelect.value : '');

      const vocacionalResultado = {
        fecha: new Date().toISOString(),
        categoryScores,
        habilidadesScores,
        estadisticasScores,
        categoriaPrincipal: primary ? primary.code : null,
        categoriaSecundaria: secondary ? secondary.code : null,
        carreraDeseada,
        razonEleccion: porQueElegiste ? porQueElegiste.value.trim() : '',
        cambioOpcion: cambiarOpcion ? cambiarOpcion.value.trim() : '',
        informacionExtra: informacionExtra ? informacionExtra.value.trim() : ''
      };

<<<<<<< Updated upstream
      const ok = this.api.updateUser(this.user.usuario, { vocacionalResultado });
=======
      const ok = await this.api.updateUser(this.user.usuario, { vocacionalResultado });
>>>>>>> Stashed changes

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

      setTimeout(() => {
        window.location.href = 'escuelas.html';
      }, 1200);
    }
  }

<<<<<<< Updated upstream
  document.addEventListener('DOMContentLoaded', () => {
    const api = window.UNICOMPASS;
    if (!api) return;

    const elements = {
      nombreCompleto: document.getElementById('nombreCompleto'),
      usuarioActual: document.getElementById('usuarioActual'),
      nivelEscuelaActual: document.getElementById('nivelEscuelaActual'),
=======
  document.addEventListener('DOMContentLoaded', async () => {
    const api = window.UNICOMPASS;
    if (!api) return;

    const progressLabel = document.getElementById('quizProgressLabel');
    if (progressLabel) progressLabel.textContent = 'Cargando encuesta...';

    const cargoBien = await cargarPreguntasRemotas();

    if (!cargoBien) {
      if (progressLabel) progressLabel.textContent = 'No se pudieron cargar las preguntas. Intenta más tarde.';
      return;
    }

    const elements = {
      nombreCompleto: document.getElementById('nombreCompleto'),
      usuarioActual: document.getElementById('usuarioActual'),
>>>>>>> Stashed changes
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

    new SurveyEngine(api, elements).init();
  });
})();