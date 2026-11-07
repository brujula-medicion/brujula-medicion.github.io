/* ============================================================
   BRÚJULA DE LA MEDICIÓN · CONTENIDO
   Todos los textos de la herramienta están aquí. Se pueden
   cambiar sin tocar app.js. Las «anclas» apuntan a apartados de
   guia.html (la guía publicada), para el botón «Saber más».
   ============================================================ */

const CONFIG = {
  nombre: 'Brújula de la medición',
  guia: 'guia.html',
  // Dirección que recibe los e-mails del formulario del PDF (por ejemplo, Formspree o
  // un Google Apps Script). Si se deja vacía, el e-mail no se envía a ningún sitio.
  formEndpoint: '',
  textoLegal: 'Acepto que se use mi e-mail para enviarme novedades sobre medición de la eficacia publicitaria. Puedo darme de baja cuando quiera.',
  enlacePrivacidad: '#privacidad'
};

const PORTADA = {
  antetitulo: 'Guía práctica de modelos de atribución y medición de la eficacia publicitaria',
  titulo: ['Quiero entender cómo está ', 'funcionando mi publicidad'],
  intro: 'Responde seis preguntas y te decimos qué puedes medir, con qué método, con qué apoyarlo y qué errores evitar. Sin registrarte y en menos de tres minutos.',
  datos: [
    { cifra: '32 %', texto: 'de los responsables de marketing mide junto lo tradicional y lo digital (23 % en Europa)', fuente: 'Nielsen, 2025' },
    { cifra: '9', texto: 'puntos de contacto usa de media una campaña; el 86 % señala los silos de datos como la gran barrera', fuente: 'WFA, 2025' },
    { cifra: '< 3 %', texto: 'de los anunciantes se siente capaz de separar el corto plazo de la construcción de marca', fuente: 'WFA y Ebiquity, 2026' }
  ],
  idea: 'No existe un modelo perfecto que responda a todas las preguntas. Existe un buen sistema de medición, que combina varios enfoques y usa cada uno para lo que sabe hacer mejor.'
};

/* ---------- CUESTIONARIO ---------- */
const PREGUNTAS = [
  {
    id: 'saber', titulo: '¿Qué quieres saber?',
    ayuda: 'Son las cuatro preguntas que intenta responder toda medición de la eficacia. Ninguna metodología responde bien a las cuatro.',
    opciones: [
      { id: 'funciona', t: '¿Funciona mi publicidad?', d: '¿Genera resultados que no se habrían producido sin ella?' },
      { id: 'cuanto', t: '¿Cuánto aporta?', d: 'Qué parte de mis ventas, visitas o altas se debe a la publicidad, y su retorno.' },
      { id: 'mejor', t: '¿Qué funciona mejor?', d: 'Qué medios, formatos, creatividades o audiencias son más eficaces.' },
      { id: 'reparto', t: '¿Qué hago ahora?', d: 'Cómo repartir el presupuesto la próxima vez.' }
    ]
  },
  {
    id: 'decision', titulo: '¿Qué decisión quieres tomar con la medición?',
    ayuda: 'Es un error habitual empezar por la herramienta. Cada decisión pide un horizonte, un nivel de detalle y un grado de exigencia distintos.',
    opciones: [
      { id: 'tactica', t: 'Optimizar mis campañas', d: 'Pujas, audiencias, creatividades. El día a día.' },
      { id: 'reparto', t: 'Repartir el presupuesto entre medios', d: 'Cuánto en TV, digital, exterior, radio… y dónde va el siguiente euro.' },
      { id: 'creatividad', t: 'Saber si la creatividad funciona', d: '¿Funciona esta campaña? ¿Esta pieza mejor que aquella?' },
      { id: 'planificacion', t: 'Planificar el próximo trimestre', d: 'Qué pasa si subo o bajo la inversión.' },
      { id: 'marca', t: 'Construir marca a largo plazo', d: 'Qué pasará dentro de dos o tres años si hoy recorto en marca.' },
      { id: 'nose', t: 'Aún no lo sé', d: 'Te orientamos a partir de lo que quieres saber.' }
    ]
  },
  {
    id: 'medios', titulo: '¿Qué medios usas?', multi: true,
    ayuda: 'La atribución a nivel de usuario solo ve lo digital y rastreable.',
    opciones: [
      { id: 'digital', t: 'Digital', d: 'Búsqueda, redes sociales, vídeo online, display, programática.' },
      { id: 'offline', t: 'TV, radio, exterior, prensa o cine', d: 'También televisión conectada y audio.' },
      { id: 'walled', t: 'Mucho en grandes plataformas', d: 'Google, Meta, Amazon, retail media… cada una con su propia medición.' }
    ]
  },
  {
    id: 'datos', titulo: '¿Qué datos tienes?', multi: true,
    ayuda: 'La calidad de cualquier modelo depende de la de sus datos.',
    opciones: [
      { id: 'historico', t: '2-3 años de datos semanales', d: 'Ventas (o altas, visitas) e inversión por medio, semana a semana.' },
      { id: 'region', t: 'Resultados por región', d: 'Ventas o altas por provincia, comunidad o zona.' },
      { id: 'recorridos', t: 'Recorridos digitales', d: 'Analítica web o de app con consentimiento y volumen de conversiones.' },
      { id: 'marca', t: 'Estudios de marca', d: 'Notoriedad, consideración, tracking, búsquedas de marca.' },
      { id: 'pocos', t: 'Todavía pocos', d: 'Tenemos que empezar a ordenarlos.' }
    ]
  },
  {
    id: 'horizonte', titulo: '¿Para cuándo necesitas la respuesta?',
    ayuda: 'Cada método tiene su ritmo: unos responden en días; otros, en semanas.',
    opciones: [
      { id: 'semana', t: 'Para esta semana', d: 'Tengo que decidir ya.' },
      { id: 'trimestre', t: 'Para el próximo trimestre', d: 'Planificación y presupuesto.' },
      { id: 'anos', t: 'Para los próximos años', d: 'Estrategia y marca.' }
    ]
  },
  {
    id: 'papel', titulo: '¿Cuál es tu papel?',
    ayuda: 'Ajustamos los consejos a lo que te van a preguntar a ti.',
    opciones: [
      { id: 'marketing', t: 'Marketing', d: 'Dirección o equipo de marketing y marca.' },
      { id: 'medios', t: 'Medios', d: 'Planificación, compra o performance.' },
      { id: 'finanzas', t: 'Finanzas', d: 'Control, presupuesto, retorno.' },
      { id: 'agencia', t: 'Agencia o consultora', d: 'Trabajo para anunciantes.' },
      { id: 'direccion', t: 'Dirección general', d: 'Tomo la decisión final.' }
    ]
  }
];

/* ---------- FICHAS ----------
   tipo: 'Método' | 'Concepto' | 'Contexto'
   luz: lo que responde cada método a las 4 preguntas (2 bien, 1 a medias, 0 no),
        según el capítulo «Qué preguntas intenta responder» y la tabla comparativa. */
const FICHAS = [
  {
    id: 'reglas', tipo: 'Método', tema: 'Atribución', titulo: 'Atribución por reglas',
    ancla: 'modelos-de-atribucion-basados-en-reglas',
    puntos: [
      ['Qué es', 'Reparte el mérito de una conversión entre los puntos de contacto digitales con una regla fija: último clic, primer clic, lineal, decaimiento temporal o posicional (40-20-40).'],
      ['Responde', 'Qué contactos digitales preceden a una conversión, de forma sencilla y transparente.'],
      ['No responde', 'Si la publicidad funciona. El reparto es un supuesto, no una medición; no ve TV, radio, exterior ni prensa, y no mide incrementalidad.'],
      ['Necesitas', 'Recorridos digitales rastreables.']
    ],
    ejemplo: 'El último clic sobrevalora la búsqueda de marca. En un gran experimento con eBay, esos anuncios no tenían beneficio medible a corto plazo: los usuarios habrían llegado igual por los resultados orgánicos.',
    luz: { funciona: 0, cuanto: 0, mejor: 1, reparto: 0 }
  },
  {
    id: 'dda', tipo: 'Método', tema: 'Atribución', titulo: 'Atribución basada en datos (DDA)',
    ancla: 'data-driven-attribution-dda',
    puntos: [
      ['Qué es', 'Sustituye la regla fija por un modelo estadístico que aprende de los recorridos reales. Es el modelo por defecto en Google Ads y Google Analytics 4.'],
      ['Responde', 'Qué puntos de contacto digitales contribuyen más a la conversión, con mucho detalle (campaña, palabra clave, anuncio). Muy útil para optimizar el día a día.'],
      ['No responde', 'El efecto de los medios offline ni el efecto total de la publicidad: trabaja con datos observacionales, no con experimentos.'],
      ['Necesitas', 'Recorridos digitales con consentimiento y volumen suficiente de conversiones.']
    ],
    ejemplo: 'Predecir muy bien quién va a comprar no dice qué anuncio le hizo comprar: los usuarios con más intención de compra son también los que más anuncios ven y más clics hacen.',
    luz: { funciona: 0, cuanto: 1, mejor: 2, reparto: 0 }
  },
  {
    id: 'mmm', tipo: 'Método', tema: 'MMM', titulo: 'Marketing Mix Modeling (MMM)',
    ancla: 'que-es-un-mmm',
    puntos: [
      ['Qué es', 'Técnica econométrica que relaciona un resultado de negocio con todo lo que lo explica: inversión en cada medio, precio, promociones, distribución, estacionalidad, competencia.'],
      ['Responde', 'Qué parte de las ventas se debe a la publicidad y a cada medio, su retorno, cómo repartir el presupuesto y qué pasaría en distintos escenarios. Ve el corto y el largo plazo.'],
      ['No responde', 'El detalle táctico (palabra clave, anuncio). Por sí solo, su capacidad causal es limitada: gana credibilidad al calibrarlo y validarlo con experimentos.'],
      ['Necesitas', '2-3 años de datos semanales de todos los medios y del negocio, y criterio experto.']
    ],
    ejemplo: 'Ocho de cada diez anunciantes ya usan modelos de marketing mix y estudios de brand lift (WFA y Ebiquity, 2026). Google (Meridian) y Meta (Robyn) tienen modelos de código abierto.',
    luz: { funciona: 1, cuanto: 2, mejor: 1, reparto: 2 }
  },
  {
    id: 'simulacion', tipo: 'Método', tema: 'MMM', titulo: 'Simulación de escenarios',
    ancla: 'planificacion-a-corto-plazo',
    puntos: [
      ['Qué es', 'Usar las curvas de respuesta del MMM para anticipar el resultado de distintas alternativas de inversión.'],
      ['Responde', '¿Qué campañas lanzar el próximo trimestre? ¿Cómo responderá el negocio si subo o bajo la inversión, o si cambio el reparto entre medios?'],
      ['No responde', 'Un escenario es tan bueno como el modelo que lo sostiene: conviene validarlo con experimentos.'],
      ['Necesitas', 'Un MMM con curvas de saturación por medio.']
    ],
    ejemplo: 'La saturación explica por qué un medio puede tener un retorno medio alto y un retorno marginal (el del siguiente euro) bajo. Pruébalo en el simulador.',
    luz: { funciona: 1, cuanto: 2, mejor: 1, reparto: 2 }
  },
  {
    id: 'largo', tipo: 'Método', tema: 'MMM', titulo: 'Medir el largo plazo',
    ancla: 'medicion-de-efectos-de-corto-y-largo-plazo',
    puntos: [
      ['Qué es', 'Medir la parte del efecto que se acumula con el tiempo: la construcción de marca, la mejora del nivel base, la capacidad de vender más al mismo precio.'],
      ['Responde', '¿Está mi publicidad construyendo marca? ¿Qué pasará con las ventas dentro de dos o tres años si hoy recorto?'],
      ['No responde', 'Las métricas inmediatas no lo ven: un MMM que solo capture el corto plazo infravalora los medios y campañas que construyen marca.'],
      ['Necesitas', 'Un MMM con efecto de largo plazo (adstocks largos, variables de marca o evolución del nivel base) y tracking de marca.']
    ],
    ejemplo: 'Elasticidad media de la publicidad: 0,12 a corto plazo y 0,24 a largo plazo (Sethuraman, Tellis y Briesch, 2011). Metaanálisis más recientes rebajan ambas cifras, pero el largo plazo sigue siendo muy superior.',
    luz: { funciona: 1, cuanto: 2, mejor: 1, reparto: 2 }
  },
  {
    id: 'creatividad', tipo: 'Método', tema: 'Experimentos', titulo: 'Evaluar la creatividad',
    ancla: 'evaluacion-de-creatividad',
    puntos: [
      ['Qué es', 'Pretest, estudios de brand lift, test A/B en digital y, si hay suficiente variación, el propio MMM.'],
      ['Responde', '¿Funciona esta campaña? ¿Funciona mejor esta pieza que aquella?'],
      ['No responde', 'Un test A/B compara alternativas entre sí, pero no mide el efecto total frente a no hacer publicidad.'],
      ['Necesitas', 'Audiencia o tráfico suficiente para el test; para el MMM, creatividades que hayan variado lo bastante en el tiempo.']
    ],
    ejemplo: 'La creatividad es uno de los factores con más impacto en la eficacia y, sin embargo, uno de los menos medidos.',
    luz: { funciona: 1, cuanto: 1, mejor: 2, reparto: 0 }
  },
  {
    id: 'testab', tipo: 'Método', tema: 'Experimentos', titulo: 'Test A/B',
    ancla: 'test-a-b',
    puntos: [
      ['Qué es', 'Compara dos versiones de un estímulo (creatividad, mensaje, página de destino) asignadas al azar a grupos distintos.'],
      ['Responde', 'Qué alternativa funciona mejor dentro de un canal digital, con capacidad causal alta.'],
      ['No responde', 'El efecto total de la publicidad frente a no hacer publicidad.'],
      ['Necesitas', 'Tráfico digital suficiente.']
    ],
    ejemplo: 'Es la herramienta natural para optimizar elementos concretos: barata, rápida y muy detallada.',
    luz: { funciona: 0, cuanto: 0, mejor: 2, reparto: 0 }
  },
  {
    id: 'geo', tipo: 'Método', tema: 'Experimentos', titulo: 'Geoexperimentos',
    ancla: 'geoexperimentos',
    puntos: [
      ['Qué es', 'Se cambia la inversión (se activa, se sube o se apaga) en unas regiones y se mantiene en otras, que hacen de control.'],
      ['Responde', '¿Funciona? El efecto incremental de un medio o una campaña, también offline (TV, radio, exterior). Sus resultados sirven para calibrar el MMM.'],
      ['No responde', 'Es puntual: mide un momento y un contexto concretos. Tiene coste de oportunidad y no siempre hay regiones comparables.'],
      ['Necesitas', 'Datos de resultado por región con suficiente frecuencia. Para países con pocas regiones, como España, hay métodos específicos.']
    ],
    ejemplo: 'No rastrea usuarios, así que es compatible con cualquier marco de privacidad. Meridian GeoX (Google) permite llevar sus resultados directamente al MMM.',
    luz: { funciona: 2, cuanto: 1, mejor: 1, reparto: 1 }
  },
  {
    id: 'lift', tipo: 'Método', tema: 'Experimentos', titulo: 'Test de incrementalidad (lift)',
    ancla: 'incrementality-testing',
    puntos: [
      ['Qué es', 'Compara un grupo expuesto con un grupo de control al que se retiene la publicidad. El conversion lift mide conversiones; el brand lift, notoriedad o intención de compra.'],
      ['Responde', 'Cuánto añade de verdad una campaña dentro de una plataforma.'],
      ['No responde', 'Lo que pasa fuera de esa plataforma: cada estudio mide su propia publicidad en su propio entorno.'],
      ['Necesitas', 'Un tamaño de audiencia suficiente.']
    ],
    ejemplo: 'En 2.226 experimentos en Meta, la atribución de último clic a siete días apenas predice la incrementalidad real (R² de 0,19).',
    luz: { funciona: 2, cuanto: 1, mejor: 1, reparto: 0 }
  },
  {
    id: 'cuasi', tipo: 'Método', tema: 'Experimentos', titulo: 'Diseños cuasi-experimentales',
    ancla: 'disenos-cuasi-experimentales',
    puntos: [
      ['Qué es', 'Aprovechan variaciones naturales cuando no se puede asignar al azar: diferencias en diferencias, control sintético, series temporales bayesianas o regresión en discontinuidad.'],
      ['Responde', 'El efecto de un cambio que ya ha ocurrido: un apagón, un lanzamiento, una región que empieza antes.'],
      ['No responde', 'Su credibilidad depende del diseño y de sus supuestos.'],
      ['Necesitas', 'Series históricas y un evento o cambio aprovechable.']
    ],
    ejemplo: 'Un operador de telecomunicaciones de EE. UU. suspendió la TV una semana elegida al azar: las búsquedas de su marca cayeron entre un 5 % y un 15 % diario, y la caída duró dos semanas más.',
    luz: { funciona: 1, cuanto: 1, mejor: 1, reparto: 0 }
  },
  /* --- Conceptos --- */
  {
    id: 'causalidad', tipo: 'Concepto', tema: 'Conceptos', titulo: 'Correlación, contribución y causalidad',
    ancla: 'diferencia-entre-correlacion-contribucion-y-causalidad',
    puntos: [
      ['Correlación', 'Dos variables se mueven a la vez. No significa que una cause la otra: las dos pueden responder a la estacionalidad o a una promoción.'],
      ['Contribución', 'El reparto del resultado entre sus causas, según un modelo. Es una estimación tan buena como el modelo y sus datos.'],
      ['Causalidad', 'Relación causa-efecto demostrada. El estándar es la experimentación aleatorizada.']
    ],
    ejemplo: 'En quince grandes experimentos en Facebook, los métodos observacionales a menudo no reprodujeron los efectos medidos con experimentos.'
  },
  {
    id: 'adstock', tipo: 'Concepto', tema: 'MMM', titulo: 'Adstock y saturación',
    ancla: 'adstock-y-saturacion',
    puntos: [
      ['Adstock', 'El efecto de la publicidad se prolonga y se va diluyendo: un adstock del 50 % conserva la mitad del efecto de una semana a la siguiente.'],
      ['Saturación', 'Cada euro adicional rinde menos que el anterior: los primeros impactos llegan a gente nueva; los siguientes, a quien ya vio el anuncio.'],
      ['Por qué importa', 'Recortar no hace caer las ventas de inmediato, y esa aparente inmunidad es engañosa. Y un buen ROI medio puede esconder un ROI marginal bajo.']
    ],
    ejemplo: 'Mueve la inversión en el simulador y mira cómo cambia lo que rinde el siguiente euro.',
    simulador: true
  },
  {
    id: 'errores', tipo: 'Concepto', tema: 'Conceptos', titulo: 'Los cinco errores de interpretación',
    ancla: 'principales-errores-de-interpretacion',
    puntos: [
      ['1', 'Confundir el canal donde se registra la venta con el que la generó.'],
      ['2', 'Sumar las métricas de las plataformas.'],
      ['3', 'Olvidar el largo plazo.'],
      ['4', 'Tomar el ROI medio por el ROI marginal.'],
      ['5', 'Confundir precisión con exactitud.']
    ],
    ejemplo: 'Ponte a prueba en «¿Mito o realidad?».',
    quiz: true
  },
  {
    id: 'integrada', tipo: 'Concepto', tema: 'Conceptos', titulo: 'Medición integrada: el triángulo',
    ancla: 'complementariedad-entre-mmm-atribucion-digital-y-experimenta',
    puntos: [
      ['MMM', 'El marco estratégico: todos los medios y el largo plazo. La base del reparto del presupuesto.'],
      ['Experimentos', 'El ancla de causalidad: validan y calibran el MMM donde hay más incertidumbre.'],
      ['Atribución digital', 'La herramienta táctica para el día a día, coherente con lo que dicen los otros dos.'],
      ['Regla de oro', 'Un mismo experimento no sirve a la vez para calibrar el modelo y para validarlo.']
    ],
    ejemplo: 'En digital, la atribución suele dar el límite superior del efecto y los experimentos el inferior; una buena estimación del MMM debería quedar entre ambos (Google, 2024).'
  },
  {
    id: 'fullfunnel', tipo: 'Concepto', tema: 'Conceptos', titulo: 'Medición full funnel',
    ancla: 'medicion-full-funnel',
    puntos: [
      ['Qué es', 'Medir todo el embudo, de la notoriedad y la consideración a la compra y la fidelidad.'],
      ['Por qué importa', 'Los indicadores intermedios conectan la inversión en marca con los resultados de negocio a largo plazo.'],
      ['Cuidado', 'La TV aumenta las búsquedas de marca, que luego registran las conversiones. Si el modelo no incluye esas búsquedas, sobrevalora la parte baja del embudo.']
    ],
    ejemplo: 'Notoriedad, consideración y búsquedas de marca son los indicadores intermedios más habituales.'
  },
  /* --- Contexto --- */
  {
    id: 'dificil', tipo: 'Contexto', tema: 'Contexto', titulo: 'Por qué medir es hoy más difícil',
    ancla: 'por-que-la-medicion-es-hoy-mas-compleja-que-nunca',
    puntos: [
      ['La paradoja', 'Nunca hubo tantos datos, pero cada métrica vive en su silo y se atribuye un mérito que es compartido.'],
      ['El síntoma', 'Si se suma lo que cada plataforma dice haber generado, el total suele superar con creces lo que se ha vendido.'],
      ['El contexto', 'Más medios, formatos y pantallas: 12.745 M€ de inversión real estimada en España en 2025 y más del 55 % en digital (InfoAdex, 2026).']
    ],
    ejemplo: '«Las ventas han subido un 15 % gracias a la campaña». La pregunta siguiente siempre es: ¿y eso es mucho, poco o lo habitual?'
  },
  {
    id: 'privacidad', tipo: 'Contexto', tema: 'Contexto', titulo: 'Cookies y privacidad',
    ancla: 'limitaciones-de-las-cookies-y-nuevos-marcos-de-privacidad',
    puntos: [
      ['Regulación', 'El RGPD y la LSSI exigen consentimiento para las cookies no esenciales; desde 2024, rechazar no puede ser más difícil que aceptar (AEPD).'],
      ['Sistemas operativos', 'Desde 2021, las apps de iOS deben pedir permiso para rastrear (App Tracking Transparency).'],
      ['Navegadores', 'Chrome mantiene las cookies de terceros, pero el consentimiento sigue siendo obligatorio.']
    ],
    ejemplo: 'Tras ATT, el tráfico rastreable de dispositivos Apple en EE. UU. cayó del 73 % al 22 % (Kraft, Skiera y Koschella, 2023).'
  },
  {
    id: 'walled', tipo: 'Contexto', tema: 'Tendencias', titulo: 'Walled gardens y clean rooms',
    ancla: 'clean-rooms',
    puntos: [
      ['Walled gardens', 'Alphabet, Meta y Amazon suman el 57,6 % del mercado publicitario mundial fuera de China (WPP Media, 2026), y miden sus resultados con sus propios datos.'],
      ['Clean rooms', 'Entornos seguros donde anunciante y medio o distribuidor cruzan datos sin ver los datos individuales del otro.'],
      ['Para qué', 'Medir, por ejemplo, cuántos expuestos a una campaña acabaron comprando, respetando la privacidad. Clave en retail media.']
    ],
    ejemplo: 'Más de la mitad de las organizaciones europeas encuestadas está adoptando o probando clean rooms o identificadores unificados (IAB Europe, 2025).'
  },
  {
    id: 'tendencias', tipo: 'Contexto', tema: 'Tendencias', titulo: 'Tendencias: IA, unified y cross-media',
    ancla: 'tendencias-futuras',
    puntos: [
      ['IA', 'Automatiza y acelera los modelos y acerca los resultados a equipos no técnicos. Pero un modelo mal especificado sigue siéndolo, aunque se ejecute en segundos.'],
      ['Unified measurement', 'Un único marco con taxonomía y métricas comunes (Proyecto Eidos del IAB, 2026).'],
      ['Cross-media', 'Monedas comunes de audiencia entre medios: Origin (Reino Unido), Aquila (EE. UU.) y MAPA en España, presentado por la AEA en abril de 2026.']
    ],
    ejemplo: 'Todo converge en sistemas híbridos: MMM para la estrategia, experimentos para la causalidad y atribución para la táctica.'
  },
  {
    id: 'recomendaciones', tipo: 'Concepto', tema: 'Conceptos', titulo: 'Ocho recomendaciones para anunciantes',
    ancla: 'recomendaciones-para-anunciantes',
    puntos: [
      ['1-2', 'Empezar por las preguntas, no por las herramientas. No repartir entre medios con las métricas de cada plataforma.'],
      ['3-4', 'Adoptar el MMM como marco estratégico. Incorporar la experimentación de forma sistemática.'],
      ['5-6', 'Medir el largo plazo. Cuidar los datos.'],
      ['7-8', 'Aceptar la incertidumbre. Conectar la medición con la organización.']
    ],
    ejemplo: 'Medir no es el objetivo. El objetivo es decidir mejor.'
  }
];

/* ---------- ERRORES (los cinco de la guía) ---------- */
const ERRORES = {
  registro: { t: 'Confundir registro con generación', d: 'El canal donde se registra la conversión no es necesariamente el que la generó. La búsqueda de marca recoge una demanda que muchas veces crearon otros medios.' },
  sumar: { t: 'Sumar las métricas de las plataformas', d: 'Cada una mide con sus reglas y ventanas de atribución. Sumarlas cuenta varias veces la misma venta.' },
  largo: { t: 'Olvidar el largo plazo', d: 'Las métricas inmediatas capturan solo una parte del efecto. La construcción de marca se acumula durante meses o años.' },
  marginal: { t: 'Tomar el ROI medio por el ROI marginal', d: 'Que un medio tenga buen retorno medio no significa que el siguiente euro vaya a rendir lo mismo: los rendimientos son decrecientes.' },
  precision: { t: 'Confundir precisión con exactitud', d: 'Un dashboard con decimales no es más cierto que una estimación con un intervalo. A veces la medición más honesta es la que reconoce su incertidumbre.' }
};

/* ---------- PRIMEROS PASOS (recomendaciones de la guía) ---------- */
const PASOS = {
  preguntas: 'Empieza por las preguntas, no por las herramientas: define qué decisión quieres tomar y qué nivel de evidencia necesita.',
  plataformas: 'No decidas el reparto entre medios con las métricas de cada plataforma: usa una métrica común y una visión de conjunto que incluya los medios offline.',
  mmm: 'Adopta el MMM como marco estratégico: con al menos dos o tres años de datos, actualizado con regularidad y revisado por expertos.',
  experimentos: 'Incorpora la experimentación de forma sistemática: una agenda de experimentos que priorice los medios y decisiones con más incertidumbre, y que calibre el MMM.',
  largo: 'Mide el largo plazo: incluye indicadores de marca y modelos que capturen el efecto acumulado, para no penalizar la inversión en marca.',
  datos: 'Cuida los datos: inversiones completas por medio, datos de exposición fiables y variables de negocio bien documentadas.',
  incertidumbre: 'Acepta la incertidumbre: una estimación con un intervalo razonable es más útil que una cifra exacta que no es cierta.',
  organizacion: 'Conecta la medición con la organización: comparte un marco común con finanzas, dirección general, agencias y proveedores, y usa la evidencia para decidir.'
};

const PAPELES = {
  marketing: 'Para defender la inversión en marca, el largo plazo es tu mejor argumento.',
  medios: 'Tu reto es que el día a día (atribución) y la estrategia (MMM) cuenten la misma historia.',
  finanzas: 'Pregunta siempre por el ROI marginal y por el intervalo, no solo por el ROI medio.',
  agencia: 'Tu valor está en dar al anunciante una visión de conjunto, no la suma de lo que dice cada plataforma.',
  direccion: 'Solo el 15 % de los anunciantes dice que la evidencia de eficacia es lo que más pesa al fijar sus presupuestos. Medir mejor solo sirve si se usa para decidir.'
};

/* ---------- COMPARADOR (tabla comparativa de la guía) ---------- */
const COMPARADOR = {
  atributos: ['Horizonte temporal', 'Nivel de detalle', 'Coste', 'Necesidad de datos', 'Capacidad causal'],
  metodos: [
    { id: 'reglas', n: 'Atribución por reglas', v: ['Inmediato (días)', 'Muy alto: campaña, palabra clave, anuncio', 'Bajo', 'Recorridos digitales rastreables', 'Nula: el reparto es un supuesto'] },
    { id: 'dda', n: 'Atribución basada en datos (DDA)', v: ['Corto plazo (días a semanas)', 'Muy alto, solo en canales digitales', 'Bajo / medio', 'Recorridos digitales con consentimiento; volumen de conversiones', 'Baja: lógica contrafactual con datos observacionales'] },
    { id: 'mmm', n: 'Marketing Mix Modeling', v: ['Corto y largo plazo (semanas a años)', 'Medio: medio y, a veces, subcanal', 'Medio', '2-3 años de datos semanales de todos los medios y del negocio', 'Limitada por sí solo; aumenta su credibilidad causal mediante calibración y validación experimental'] },
    { id: 'testab', n: 'Test A/B', v: ['Inmediato', 'Alto: elementos concretos', 'Bajo', 'Tráfico digital suficiente', 'Alta, pero solo entre alternativas'] },
    { id: 'geo', n: 'Geoexperimentos', v: ['Duración del test (semanas)', 'Medio: medio o campaña', 'Medio / alto (incluye coste de oportunidad)', 'Datos de resultado por región', 'Alta'] },
    { id: 'lift', n: 'Test de incrementalidad (lift)', v: ['Duración del test', 'Alto, dentro de cada plataforma', 'Bajo / medio', 'Tamaño de audiencia suficiente', 'Alta, dentro del entorno de la plataforma'] },
    { id: 'cuasi', n: 'Diseños cuasi-experimentales', v: ['Según el evento analizado', 'Medio', 'Medio', 'Series históricas y un evento o cambio aprovechable', 'Media / alta, según el diseño'] }
  ]
};

/* ---------- ¿MITO O REALIDAD? ---------- */
const MITOS = [
  { f: 'El canal donde se registra la venta es el que la ha generado.', mito: true, e: 'Es el error más común. La búsqueda de marca, el retargeting o los comparadores recogen una demanda que muchas veces crearon otros medios, como la TV o el vídeo.', ancla: 'principales-errores-de-interpretacion' },
  { f: 'Si sumo lo que dice cada plataforma, tengo el efecto total de mi publicidad.', mito: true, e: 'Cada plataforma mide con sus reglas y ventanas. Al sumarlas, la misma venta se cuenta varias veces y el total suele superar lo que se ha vendido.', ancla: 'principales-errores-de-interpretacion' },
  { f: 'Si recorto la inversión y las ventas no caen enseguida, es que esa publicidad no hacía nada.', mito: true, e: 'Es el adstock: el efecto se prolonga y se diluye poco a poco. Esa aparente inmunidad es engañosa; la base se va erosionando.', ancla: 'adstock-y-saturacion' },
  { f: 'Si un medio tiene un buen ROI medio, el siguiente euro que invierta en él rendirá lo mismo.', mito: true, e: 'Los rendimientos son decrecientes. Lo que importa para decidir es el ROI marginal, el del siguiente euro.', ancla: 'adstock-y-saturacion' },
  { f: 'Un experimento aleatorizado bien diseñado es la referencia para demostrar que la publicidad causa ventas.', mito: false, e: 'Es el estándar para identificar causalidad, como en un ensayo clínico: se compara un grupo expuesto con otro lo más parecido posible que no lo está.', ancla: 'experimentacion-y-causalidad' },
  { f: 'Los anuncios de búsqueda de marca traen siempre ventas que no llegarían de otra forma.', mito: true, e: 'En un gran experimento con eBay no tenían beneficio medible a corto plazo: los usuarios habrían llegado igual por los resultados orgánicos.', ancla: 'last-click' },
  { f: 'El MMM es compatible con los nuevos marcos de privacidad.', mito: false, e: 'Trabaja con datos agregados y no necesita rastrear usuarios. Por eso ha vivido un renacimiento.', ancla: 'que-es-un-mmm' },
  { f: 'Un dashboard con decimales es más fiable que una estimación con intervalo de confianza.', mito: true, e: 'Precisión no es exactitud. A veces la medición más honesta es la que reconoce su incertidumbre.', ancla: 'principales-errores-de-interpretacion' },
  { f: 'Ningún modelo responde por sí solo a todas las preguntas de la medición.', mito: false, e: 'Es la idea central de la guía: atribución, MMM y experimentos se complementan, y cada uno sirve para lo que sabe hacer mejor.', ancla: 'por-que-ningun-modelo-responde-a-todas-las-preguntas' },
  { f: 'Un modelo de machine learning que predice muy bien quién va a comprar dice qué anuncio le hizo comprar.', mito: true, e: 'Predicción no es causalidad: los usuarios con más intención de compra son también los que más anuncios ven.', ancla: 'tecnicas-basadas-en-machine-learning' }
];

/* ---------- EVIDENCIA EN UNA FRASE ---------- */
const EVIDENCIAS = [
  { c: 'R² 0,19', t: 'En 2.226 experimentos en Meta, la atribución de último clic a siete días apenas predice la incrementalidad real de las campañas.', f: 'Gordon, Moakler y Zettelmeyer, 2026' },
  { c: 'eBay', t: 'Un gran experimento de campo mostró que los anuncios de búsqueda de marca no tenían beneficio medible a corto plazo.', f: 'Blake, Nosko y Tadelis, 2015' },
  { c: '73 % → 22 %', t: 'Caída del tráfico rastreable desde dispositivos Apple en EE. UU. tras App Tracking Transparency.', f: 'Kraft, Skiera y Koschella, 2023' },
  { c: '−37 %', t: 'Tasa de clics perdida por los anuncios de Meta optimizados a conversión tras ATT.', f: 'Aridor, Che, Hollenbeck, Kaiser y McCarthy, 2026' },
  { c: '0,12 vs 0,24', t: 'Elasticidad media de la publicidad a corto y a largo plazo: el efecto de largo plazo dobla al inmediato.', f: 'Sethuraman, Tellis y Briesch, 2011' },
  { c: '60 / 40', t: 'Equilibrio aproximado entre inversión en marca y en activación, tras analizar casi mil casos de eficacia del IPA.', f: 'Binet y Field, 2013' },
  { c: '57,6 %', t: 'Del mercado publicitario mundial (fuera de China) se lo llevan Alphabet, Meta y Amazon, que miden sus propios resultados.', f: 'WPP Media, 2026' },
  { c: '5-15 %', t: 'Caída diaria de las búsquedas de marca de un operador de telecomunicaciones al apagar la TV una semana. Duró dos semanas más.', f: 'Liu, Hill y Rothschild, 2026' },
  { c: '8 de 10', t: 'Anunciantes que ya usan modelos de marketing mix y estudios de brand lift.', f: 'WFA y Ebiquity, 2026' },
  { c: '15 %', t: 'Solo el 15 % de los anunciantes dice que la evidencia de eficacia es el principal factor al fijar sus presupuestos.', f: 'WFA y Ebiquity, 2026' },
  { c: '32 %', t: 'De los responsables de marketing mide de forma conjunta medios tradicionales y digitales. En Europa, el 23 %.', f: 'Nielsen, 2025' },
  { c: '< 3 %', t: 'De las conversiones web de Google Ads se atribuían con modelos de reglas cuando Google los retiró en 2023.', f: 'Google, 2023' }
];
