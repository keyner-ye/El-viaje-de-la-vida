// ==========================================================================
// BANCO EXTENSO DE PREGUNTAS DE TRIVIA Y EVALUACIÓN POR ETAPA (triviaData.js)
// Más de 50 preguntas médicas y biológicas categorizadas por etapa gestacional.
// ==========================================================================

export const TRIVIA_QUESTIONS = [
  // ---------- ETAPA 0: CONCEPCIÓN (SEMANA 1) ----------
  {
    id: "s0_1",
    stageId: 0,
    question: "¿Cuántos cromosomas aporta cada gameto (óvulo y espermatozoide) al momento de la fecundación?",
    options: ["23 cromosomas cada uno", "46 cromosomas cada uno", "12 cromosomas cada uno", "48 cromosomas cada uno"],
    correct: 0,
    explanation: "Cada gameto es haploide y aporta 23 cromosomas, formando un cigoto diploide único con 46 cromosomas (23 pares)."
  },
  {
    id: "s0_2",
    stageId: 0,
    question: "¿En qué lugar del aparato reproductor femenino ocurre habitualmente la fecundación?",
    options: ["En el tercio externo de la trompa de Falopio (ámpula)", "Dentro de la cavidad uterina", "En el cuello uterino (cérvix)", "En el ovario"],
    correct: 0,
    explanation: "La fecundación se produce normalmente en la ampolla tubárica de la trompa de Falopio antes de que el embrión viaje hacia el útero."
  },
  {
    id: "s0_3",
    stageId: 0,
    question: "¿Cómo se llama la esfera compacta de 16 a 32 células resultante de las primeras divisiones del cigoto?",
    options: ["Mórula", "Gástrula", "Blastocisto", "Feto"],
    correct: 0,
    explanation: "Se denomina mórula hacia el día 3 o 4 post-fecundación por su parecido físico con una pequeña mora."
  },
  {
    id: "s0_4",
    stageId: 0,
    question: "¿Qué estructura del blastocisto dará origen a la placenta?",
    options: ["El trofoblasto", "La masa celular interna (embrioblasto)", "La zona pelúcida", "El saco vitelino"],
    correct: 0,
    explanation: "La capa externa de células llamada trofoblasto invade el endometrio materno y formará la placenta y las membranas fetales."
  },
  {
    id: "s0_5",
    stageId: 0,
    question: "¿A qué semilla u objeto cotidiano se asemeja el tamaño del cigoto en la semana 1 (0.1 mm)?",
    options: ["Semilla de amapola", "Grano de arroz", "Semilla de sandía", "Lenteja"],
    correct: 0,
    explanation: "Con apenas 0.1 mm a 0.2 mm, el óvulo fecundado tiene el tamaño microscópico de una semilla de amapola."
  },
  {
    id: "s0_6",
    stageId: 0,
    question: "¿Qué fenómeno bloquea la entrada de más de un espermatozoide al óvulo (polispermia)?",
    options: ["La reacción cortical y despolarización de la membrana", "La degradación del acrosoma", "El moco cervical", "La mitosis celular"],
    correct: 0,
    explanation: "La entrada del primer espermatozoide libera gránulos corticales que endurecen la zona pelúcida, impidiendo la entrada de otros espermatozoides."
  },

  // ---------- ETAPA 1: EMBRIÓN TEMPRANO (SEMANAS 2-4) ----------
  {
    id: "s1_1",
    stageId: 1,
    question: "¿En qué semana del desarrollo prenatal comienza a formarse y palpitar el corazón primitivo?",
    options: ["Entre las semanas 3 y 4 (día 21-22)", "En la semana 12", "En la semana 20", "Al nacer"],
    correct: 0,
    explanation: "Hacia el día 21 o 22 de gestación, los dos tubos endocárdicos se fusionan y comienzan las primeras contracciones rítmicas autónomas."
  },
  {
    id: "s1_2",
    stageId: 1,
    question: "¿Qué vitamina fundamental previene defectos graves en el cierre del tubo neural como la espina bífida?",
    options: ["Ácido fólico (Vitamina B9)", "Vitamina C", "Vitamina D3", "Vitamina K"],
    correct: 0,
    explanation: "El ácido fólico es indispensable para la replicación del ADN y el cierre exitoso de los neuroporos anterior y posterior antes del día 28."
  },
  {
    id: "s1_3",
    stageId: 1,
    question: "¿Cuáles son las 3 capas germinativas primordiales formadas durante la gastrulación?",
    options: ["Ectodermo, Mesodermo y Endodermo", "Epidermis, Dermis e Hipodermis", "Córtex, Médula y Núcleo", "Saco amniótico, Corion y Alantoides"],
    correct: 0,
    explanation: "La gastrulación crea el ectodermo (sistema nervioso y piel), mesodermo (músculos, huesos, corazón y riñones) y endodermo (sistema digestivo y respiratorio)."
  },
  {
    id: "s1_4",
    stageId: 1,
    question: "¿Qué bloques de tejido mesodérmico a los lados del tubo neural darán origen a las vértebras y costillas?",
    options: ["Los somitas", "Los blastómeros", "Las crestas neurales", "Los arcos aórticos"],
    correct: 0,
    explanation: "Los somitas se segmentan en esclerotomo (futuras vértebras y costillas), miotomo (músculos) y dermatomo (tejido conectivo de la piel)."
  },
  {
    id: "s1_5",
    stageId: 1,
    question: "¿A qué objeto de la cocina equivale el tamaño del embrión de 4 semanas (aprox. 4 a 5 mm)?",
    options: ["Un grano de arroz", "Una nuez", "Una manzana", "Una semilla de calabaza"],
    correct: 0,
    explanation: "En la semana 4, el embrión en forma de C mide cerca de 4 mm, comparable al tamaño de un grano de arroz."
  },
  {
    id: "s1_6",
    stageId: 1,
    question: "¿Qué órgano primitivo transitorio produce las primeras células sanguíneas antes de que el hígado y la médula ósea maduren?",
    options: ["El saco vitelino", "El timo", "El bazo", "La placenta"],
    correct: 0,
    explanation: "En las primeras semanas, los islotes sanguíneos de la pared del saco vitelino originan los primeros glóbulos rojos primitivos."
  },

  // ---------- ETAPA 2: EMBRIÓN (SEMANAS 5-8) ----------
  {
    id: "s2_1",
    stageId: 2,
    question: "¿Mediante qué proceso biológico se separan los dedos de las manos a partir de las paletas embrionarias?",
    options: ["Muerte celular programada (Apoptosis)", "División celular por mitosis acelerada", "Degradación enzimática externa", "Mutación espontánea"],
    correct: 0,
    explanation: "La apoptosis elimina las células de las membranas interdigitales mediada por proteínas BMP, esculpiendo los dedos independientes."
  },
  {
    id: "s2_2",
    stageId: 2,
    question: "¿Hacia qué semana cesa el periodo embrionario y comienza formalmente la etapa fetal?",
    options: ["Al finalizar la semana 8", "En la semana 16", "En la semana 4", "En la semana 24"],
    correct: 0,
    explanation: "Al final de la semana 8 concluye la organogénesis primordial y el embrión pasa a denominarse feto."
  },
  {
    id: "s2_3",
    stageId: 2,
    question: "¿Con qué fruta pequeña se compara el embrión en las semanas 5 a 8 (aprox. 1.5 a 3 cm)?",
    options: ["Un arándano o frambuesa", "Un limón grande", "Un melón", "Una cereza gigante"],
    correct: 0,
    explanation: "En esta fase de rápido crecimiento, el embrión alcanza entre 1.5 cm y 3 cm, tamaño semejante al de un arándano silvestre."
  },
  {
    id: "s2_4",
    stageId: 2,
    question: "¿Por qué el periodo entre las semanas 3 y 8 es el más vulnerable a teratógenos (fármacos, alcohol, radiación)?",
    options: ["Porque ocurre la organogénesis (formación de todos los órganos básicos)", "Porque la placenta no existe aún", "Porque el feto no se mueve", "Porque el líquido amniótico no protege"],
    correct: 0,
    explanation: "Durante la organogénesis cualquier agresión externa puede provocar anomalías congénitas mayores en los órganos en diferenciación."
  },
  {
    id: "s2_5",
    stageId: 2,
    question: "¿Qué vasos sanguíneos componen el cordón umbilical humano normal?",
    options: ["Dos arterias y una vena", "Dos venas y una arteria", "Una arteria y una vena", "Tres arterias y dos venas"],
    correct: 0,
    explanation: "El cordón normal tiene 2 arterias umbilicales (llevan sangre desoxigenada a la placenta) y 1 vena umbilical (lleva sangre rica en oxígeno al feto)."
  },
  {
    id: "s2_6",
    stageId: 2,
    question: "¿En qué semana aparecen los primeros movimientos reflejos involuntarios del embrión?",
    options: ["Hacia la semana 7 u 8", "En la semana 2", "En la semana 20", "En la semana 32"],
    correct: 0,
    explanation: "Entre las semanas 7 y 8 el embrión realiza suaves flexiones de cuello y tronco al madurar las sinapsis neuromusculares."
  },

  // ---------- ETAPA 3: FETO TEMPRANO (SEMANAS 9-12) ----------
  {
    id: "s3_1",
    stageId: 3,
    question: "¿Qué hueso es uno de los primeros en iniciar su centro primario de osificación en el feto?",
    options: ["La clavícula y la mandíbula", "El fémur", "Las vértebras lumbares", "El hueso parietal"],
    correct: 0,
    explanation: "La clavícula y la mandíbula son los primeros huesos en iniciar la osificación intramembranosa hacia la semana 8-9."
  },
  {
    id: "s3_2",
    stageId: 3,
    question: "¿Qué fruta representa la escala del feto en las semanas 9 a 12 (aprox. 5 a 8 cm)?",
    options: ["Una ciruela", "Una sandía", "Un coco", "Una piña"],
    correct: 0,
    explanation: "El feto temprano alcanza entre 5 y 8 cm de longitud de la coronilla a la rabadilla, semejante al tamaño de una ciruela jugosa."
  },
  {
    id: "s3_3",
    stageId: 3,
    question: "¿Qué órgano comienza a producir orina fetal que contribuye activamente al líquido amniótico?",
    options: ["Los riñones fetales", "El hígado", "Los pulmones", "El bazo"],
    correct: 0,
    explanation: "Hacia la semana 10 a 11 los riñones filtran sangre fetal y producen orina, que se convierte en el componente primordial del líquido amniótico."
  },
  {
    id: "s3_4",
    stageId: 3,
    question: "¿Qué reflejo oral fundamental comienza a manifestarse en el feto hacia la semana 11 o 12?",
    options: ["El reflejo de deglución y succión", "El llanto con lágrimas", "La masticación", "El bostezo sonoro"],
    correct: 0,
    explanation: "El feto empieza a tragar líquido amniótico y puede succionar su propio pulgar, entrenando el aparato digestivo y respiratorio."
  },
  {
    id: "s3_5",
    stageId: 3,
    question: "¿En qué rango suele situarse la frecuencia cardíaca fetal normal en este trimestre?",
    options: ["Entre 120 y 160 latidos por minuto", "Entre 60 y 80 latidos por minuto", "Entre 200 y 240 latidos por minuto", "Más de 300 latidos por minuto"],
    correct: 0,
    explanation: "El corazón fetal palpita con vigor entre 120 y 160 BPM, aproximadamente el doble de rápido que el ritmo cardíaco de un adulto en reposo."
  },
  {
    id: "s3_6",
    stageId: 3,
    question: "¿Qué estudio ecográfico de rutina se realiza entre las semanas 11 y 14 para evaluar riesgos cromosómicos?",
    options: ["Translucencia nucal (TN)", "Radiografía de tórax", "Resonancia funcional", "Tomografía axial"],
    correct: 0,
    explanation: "La translucencia nucal mide el grosor del espacio subcutáneo en la nuca del feto para evaluar riesgos como el síndrome de Down."
  },

  // ---------- ETAPA 4: FETO EN DESARROLLO (SEMANAS 13-20) ----------
  {
    id: "s4_1",
    stageId: 4,
    question: "¿Con qué fruta se compara el feto en las semanas 13 a 20 (aprox. 16 cm)?",
    options: ["Un aguacate", "Una manzana roja", "Un melocotón pequeño", "Un racimo de uvas"],
    correct: 0,
    explanation: "Con cerca de 16 cm de largo y unos 100 a 300 gramos, el feto tiene el tamaño y peso de un aguacate maduro."
  },
  {
    id: "s4_2",
    stageId: 4,
    question: "¿Cómo se llama el vello fino y sedoso que cubre el cuerpo del feto y ayuda a fijar la vérnix?",
    options: ["Lanugo", "Queratina", "Cilio", "Folículo primario"],
    correct: 0,
    explanation: "El lanugo es un vello protector ultrafino que ayuda a mantener la vérnix adherida a la piel para aislarla del líquido amniótico."
  },
  {
    id: "s4_3",
    stageId: 4,
    question: "¿Hacia qué semana la madre suele percibir los primeros movimientos fetales (sensación de aleteo)?",
    options: ["Entre las semanas 16 y 20", "En la semana 6", "En la semana 10", "En la semana 36"],
    correct: 0,
    explanation: "Las madres multíparas los perciben hacia la semana 16-18, y las primerizas comúnmente entre las semanas 18 y 20."
  },
  {
    id: "s4_4",
    stageId: 4,
    question: "¿Qué sentido especial madura en este periodo gracias a la osificación de los huesecillos del oído medio?",
    options: ["La audición (escucha latidos y voz de mamá)", "La visión a color", "El olfato aéreo", "El equilibrio vestibular adulto"],
    correct: 0,
    explanation: "El martillo, yunque y estribo se osifican, permitiendo que el feto escuche los latidos de la madre, el flujo de la aorta y voces exteriores."
  },
  {
    id: "s4_5",
    stageId: 4,
    question: "¿Qué ecografía exhaustiva se recomienda realizar entre las semanas 18 y 22 para revisar toda la anatomía?",
    options: ["Ecografía morfológica de segundo trimestre", "Electrocardiograma materno", "Prueba de esfuerzo", "Densitometría ósea"],
    correct: 0,
    explanation: "La ecografía morfológica evalúa detalladamente el cerebro, corazón, riñones, columna, extremidades y la inserción de la placenta."
  },
  {
    id: "s4_6",
    stageId: 4,
    question: "¿Qué huellas corporales únicas quedan grabadas para siempre en las yemas de los dedos en la semana 17?",
    options: ["Los dermatoglifos (huellas dactilares)", "Las pecas genéticas", "Las líneas de Langer", "Los pliegues ungueales"],
    correct: 0,
    explanation: "Hacia la semana 17 las crestas papilares forman las huellas dactilares permanentes e irrepetibles de cada ser humano."
  },

  // ---------- ETAPA 5: FETO AVANZADO (SEMANAS 21-36) ----------
  {
    id: "s5_1",
    stageId: 5,
    question: "¿Qué sustancia tensoactiva producida en los alvéolos evita que los pulmones colapsen al nacer?",
    options: ["Surfactante pulmonar", "Hemoglobina fetal", "Vérnix caseosa", "Bilis intrauterina"],
    correct: 0,
    explanation: "Los neumocitos tipo II producen surfactante pulmonar a partir de la semana 24-28, reduciendo la tensión superficial alveolar para permitir respirar aire."
  },
  {
    id: "s5_2",
    stageId: 5,
    question: "¿A qué vegetal alargado se asemeja el feto en las semanas 21 a 36 (aprox. 30 cm)?",
    options: ["Una berenjena", "Una zanahoria pequeña", "Un pepinillo", "Una alcachofa"],
    correct: 0,
    explanation: "Hacia las semanas 24 a 28 el feto mide aproximadamente 30 a 35 cm, equivalente a una berenjena hermosa y robusta."
  },
  {
    id: "s5_3",
    stageId: 5,
    question: "¿Hacia qué semana se sitúa el umbral de viabilidad fetal médica con cuidados intensivos neonatales?",
    options: ["Alrededor de las semanas 23 a 24", "En la semana 14", "En la semana 18", "En la semana 38"],
    correct: 0,
    explanation: "A las 24 semanas los pulmones y el sistema nervioso alcanzan la madurez mínima para sobrevivir con soporte en unidad neonatal (UCIN)."
  },
  {
    id: "s5_4",
    stageId: 5,
    question: "¿Qué tipo de ondas cerebrales que demuestran que el feto sueña (sueño REM) se registran desde la semana 28?",
    options: ["Movimientos oculares rápidos (sueño REM)", "Coma fisiológico continuo", "Actividad alfa rígida", "Vigilia permanente"],
    correct: 0,
    explanation: "El feto experimenta ciclos alternados de sueño profundo, sueño REM (con sueños y procesamiento de memoria) y vigilia activa."
  },
  {
    id: "s5_5",
    stageId: 5,
    question: "¿Qué anticuerpo materno crucial atraviesa activamente la placenta para brindarle defensas inmunes al feto?",
    options: ["Inmunoglobulina G (IgG)", "Inmunoglobulina E (IgE)", "Inmunoglobulina M (IgM)", "Histamina"],
    correct: 0,
    explanation: "Los anticuerpos IgG maternos cruzan la barrera placentaria otorgando inmunidad pasiva contra bacterias y virus durante los primeros meses tras nacer."
  },
  {
    id: "s5_6",
    stageId: 5,
    question: "¿Qué tejido metabólico especial acumula el feto para producir calor y protegerse del frío al nacer?",
    options: ["Grasa parda (tejido adiposo marrón)", "Grasa visceral blanca", "Glucógeno hepático estéril", "Lecitina pura"],
    correct: 0,
    explanation: "La grasa parda termoactiva, rica en mitocondrias, genera calor instantáneo sin necesidad de tiritar cuando el bebé nace."
  },

  // ---------- ETAPA 6: TÉRMINO Y PARTO (SEMANAS 37-40) ----------
  {
    id: "s6_1",
    stageId: 6,
    question: "¿Qué fruta grande representa la escala del feto a término (aprox. 50 cm y 3.5 kg)?",
    options: ["Una sandía", "Un pomelo", "Una piña mediana", "Un coco verde"],
    correct: 0,
    explanation: "Con unos 50 cm de longitud y cerca de 3 a 3.5 kg de peso, el feto a término tiene el tamaño de una sandía completa."
  },
  {
    id: "s6_2",
    stageId: 6,
    question: "¿Cómo se llama la posición óptima para el parto en la que la cabeza del bebé mira hacia abajo en la pelvis?",
    options: ["Presentación cefálica de vértice", "Presentación podálica (de nalgas)", "Situación transversa", "Presentación de hombro"],
    correct: 0,
    explanation: "La presentación cefálica permite que la cabeza, la parte más firme, guíe suavemente la dilatación del canal del parto."
  },
  {
    id: "s6_3",
    stageId: 6,
    question: "¿Qué estructuras cartilaginosas del cráneo permiten que los huesos se superpongan ligeramente sin daño durante el parto?",
    options: ["Las fontanelas y suturas elásticas", "Los senos paranasales", "Los agujeros de conjunción", "La mandíbula móvil"],
    correct: 0,
    explanation: "Las fontanelas anterior (bregma) y posterior (lambda) otorgan flexibilidad al cráneo para atravesar el canal pélvico sin lesionar el cerebro."
  },
  {
    id: "s6_4",
    stageId: 6,
    question: "¿Qué examen médico rápido se realiza al primer y quinto minuto de vida para evaluar el bienestar del recién nacido?",
    options: ["Test de Apgar", "Prueba de Guthrie", "Escala de Glasgow", "Test de Allen"],
    correct: 0,
    explanation: "El Test de Apgar evalúa Apariencia (color), Pulso (FC), Gesticulación (reflejos), Actividad (tono muscular) y Respiración sobre 10 puntos."
  },
  {
    id: "s6_5",
    stageId: 6,
    question: "¿Qué hormona materna fundamental desencadena las contracciones rítmicas del útero durante el trabajo de parto?",
    options: ["Oxitocina", "Progesterona", "Insulina", "Tiroxina"],
    correct: 0,
    explanation: "La oxitocina, producida en el hipotálamo y liberada por la neurohipófisis, estimula las contracciones uterinas y el reflejo de eyección de leche."
  },
  {
    id: "s6_6",
    stageId: 6,
    question: "¿Qué cambio circulatorio inmediato ocurre en el corazón del bebé con su primer llanto e inhalación de aire?",
    options: ["Cierre del foramen oval y del conducto arterioso", "Inversión de las válvulas cardíacas", "Apertura de nuevas aurículas", "Aumento del flujo placentario"],
    correct: 0,
    explanation: "Al expandirse los pulmones con aire, la presión en la aurícula izquierda sube, cerrando funcionalmente el foramen oval y desviando la sangre a los pulmones."
  },

  // ---------- SALUD MATERNA Y CUIDADOS PRENATALES ----------
  {
    id: "care_1",
    stageId: null,
    question: "¿Por qué el consumo de alcohol está estrictamente contraindicado en cualquier cantidad durante el embarazo?",
    options: [
      "Porque cruza la placenta sin filtro y causa el Síndrome Alcohólico Fetal",
      "Porque solo causa malestar gástrico en la madre",
      "Porque disminuye el calcio en los huesos maternos",
      "Porque hace que el bebé duerma en exceso"
    ],
    correct: 0,
    explanation: "El alcohol es un teratógeno celular potente que atraviesa la placenta al 100% y destruye neuronas fetales, provocando retraso del crecimiento y daño cognitivo permanente."
  },
  {
    id: "care_2",
    stageId: null,
    question: "¿Qué postura al dormir se aconseja en el tercer trimestre para mejorar el flujo de sangre y oxígeno al feto?",
    options: [
      "De lado izquierdo (decúbito lateral izquierdo)",
      "Boca arriba (decúbito supino)",
      "Boca abajo (decúbito prono)",
      "Sentada completamente vertical"
    ],
    correct: 0,
    explanation: "Dormir sobre el costado izquierdo evita que el útero pesado comprima la vena cava inferior, optimizando el retorno venoso al corazón materno y la placenta."
  },
  {
    id: "care_3",
    stageId: null,
    question: "¿Cuál de estos nutrientes es indispensable para el desarrollo de la retina y la corteza cerebral del feto?",
    options: ["Ácidos grasos Omega-3 (DHA)", "Sodio refinado", "Gluten", "Cafeína"],
    correct: 0,
    explanation: "El DHA (ácido docosahexaenoico) es el lípido estructural predominante en las membranas de los fotorreceptores retinianos y las sinapsis cerebrales."
  }
];

export const GLOSSARY_DATA = [
  {
    term: "Apoptosis",
    definition: "Muerte celular programada indispensable para eliminar membranas entre los dedos y modelar cavidades corporales."
  },
  {
    term: "Surfactante Pulmonar",
    definition: "Líquido lipoproteico producido por los neumocitos tipo II que impide el colapso de los alvéolos al respirar aire por primera vez."
  },
  {
    term: "Vérnix Caseosa",
    definition: "Capa sebácea blanquecina rica en lípidos que impermeabiliza e hidrata la piel fetal contra el líquido amniótico."
  },
  {
    term: "Lanugo",
    definition: "Vello fino y suave que recubre el cuerpo del feto, manteniendo la vérnix adherida a la piel para aislarla térmicamente."
  },
  {
    term: "Tubo Neural",
    definition: "Estructura cilíndrica embrionaria formada a partir del ectodermo que origina el encéfalo y la médula espinal."
  },
  {
    term: "Somitas",
    definition: "Bloques segmentarios de mesodermo paraaxial que forman las vértebras, costillas, músculos esqueléticos y dermis."
  },
  {
    term: "Fontanelas",
    definition: "Espacios membranosos entre los huesos del cráneo del feto que permiten su elasticidad durante el parto y el crecimiento cerebral."
  },
  {
    term: "Test de Apgar",
    definition: "Puntuación rápida de 0 a 10 evaluada al minuto 1 y 5 de vida para verificar la frecuencia cardíaca, respiración, tono muscular, reflejos y color del recién nacido."
  }
];

export const GLOSSARY_TERMS = GLOSSARY_DATA;

export const MEDALS_DATA = [
  {
    id: "first_breath",
    title: "El Milagro de la Vida",
    desc: "Inicia la exploración en 3D del desarrollo prenatal humano.",
    icon: "fa-baby",
    unlocked: true
  },
  {
    id: "explorer_3d",
    title: "Biólogo del Desarrollo",
    desc: "Recorre y explora las 7 etapas completas de la gestación.",
    icon: "fa-dna",
    unlocked: false
  },
  {
    id: "fruit_master",
    title: "Medidas Cotidianas",
    desc: "Activa la comparativa en 3D con frutas a escala real.",
    icon: "fa-apple-whole",
    unlocked: false
  },
  {
    id: "healthy_mom",
    title: "Ángel Guardián Prenatal",
    desc: "Supera los 7 pilares de cuidados y salud materna en el simulador.",
    icon: "fa-person-breastfeeding",
    unlocked: false
  },
  {
    id: "trivia_master",
    title: "Doctor en Embriología",
    desc: "Obtén una puntuación perfecta (10/10) en la trivia interactiva.",
    icon: "fa-graduation-cap",
    unlocked: false
  },
  {
    id: "minigame_champion",
    title: "Héroe Celular",
    desc: "Supera al menos 4 de los 7 minijuegos interactivos de las etapas.",
    icon: "fa-gamepad",
    unlocked: false
  }
];
