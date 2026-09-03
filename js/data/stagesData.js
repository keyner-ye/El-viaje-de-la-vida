// ==========================================================================
// BASE DE DATOS CIENTÍFICA: LAS 7 ETAPAS DEL DESARROLLO PRENATAL HUMANO
// Basado estrictamente en la infografía "El viaje de la vida: de la concepción al nacimiento"
// ==========================================================================

export const STAGES_DATA = [
  {
    id: 0,
    name: "Concepción",
    weeks: "Semana 1",
    subtitle: "El inicio milagroso de una nueva vida",
    sizeMm: 0.1,
    sizeDisplay: "0.1 mm",
    fruitName: "Semilla de amapola",
    fruitIcon: "🌱",
    fruitScale: 0.08,
    bpm: 0, // Aún sin latido
    fetalMilestones: [
      "La unión del óvulo y el espermatozoide (fecundación) forma el cigoto unicelular con ADN completo.",
      "Comienza la división celular mitótica acelerada: 2, 4, 8, 16 células (mórula) y luego blastocisto.",
      "El blastocisto viaja por la trompa de Falopio y se implanta firmemente en el endometrio uterino."
    ],
    maternalChanges: [
      "Posible retraso menstrual (primer signo detectable de embarazo).",
      "Oleada hormonal inicial con liberación acelerada de hCG (gonadotropina coriónica humana).",
      "Posible leve manchado o sangrado de implantación."
    ],
    minigameId: "fertilization",
    minigameTitle: "La Carrera de la Concepción",
    minigameDesc: "Guía al espermatozoide pionero a través del tracto femenino hasta alcanzar el óvulo y activar la chispa de la fecundación.",
    meshConfig: {
      type: "zygote",
      color: 0xec4899,
      coreColor: 0x818cf8,
      roughness: 0.25,
      transmission: 0.85,
      radius: 1.2
    }
  },
  {
    id: 1,
    name: "Embrión Temprano",
    weeks: "Semanas 2 - 4",
    subtitle: "Construcción de los cimientos vitales",
    sizeMm: 5,
    sizeDisplay: "0.5 cm",
    fruitName: "Grano de arroz",
    fruitIcon: "🌾",
    fruitScale: 0.35,
    bpm: 110,
    fetalMilestones: [
      "Se forman las estructuras básicas del cuerpo a través de la gastrulación en 3 capas germinales.",
      "Se forma y se cierra el tubo neural, base del futuro cerebro y la médula espinal.",
      "Comienza a formarse y palpitar el corazón tubular primordial alrededor del día 21."
    ],
    maternalChanges: [
      "Aparición de náuseas matutinas y sensación pronunciada de cansancio.",
      "Sensibilidad notable e hinchazón en los senos.",
      "Incremento en la necesidad de orinar debido al aumento del flujo sanguíneo."
    ],
    minigameId: "heartbeat",
    minigameTitle: "El Primer Latido y Tubo Neural",
    minigameDesc: "Conecta los impulsos bioeléctricos del tubo neural y activa el ritmo del primer latido cardíaco de la vida.",
    meshConfig: {
      type: "early_embryo",
      color: 0xf472b6,
      coreColor: 0xef4444,
      roughness: 0.3,
      transmission: 0.6,
      radius: 1.4
    }
  },
  {
    id: 2,
    name: "Embrión",
    weeks: "Semanas 5 - 8",
    subtitle: "Aparición de extremidades y órganos",
    sizeMm: 25,
    sizeDisplay: "2.5 cm",
    fruitName: "Arándano",
    fruitIcon: "🫐",
    fruitScale: 0.8,
    bpm: 155,
    fetalMilestones: [
      "Se desarrollan y diferencian los órganos y sistemas principales (organogénesis activa).",
      "Aparición visible de brotes de brazos, piernas y posterior individualización de dedos.",
      "Formación de los ojos (con retina pigmentada), vesículas cerebrales y sistema digestivo primitivo."
    ],
    maternalChanges: [
      "Crecimiento progresivo del útero (del tamaño de un puño).",
      "Mayor necesidad de descanso y reposo diario.",
      "Fluctuaciones emocionales debido a altos niveles de estrógeno y progesterona."
    ],
    minigameId: "morphogenesis",
    minigameTitle: "Morfogénesis y Dedos",
    minigameDesc: "Activa los factores moleculares de crecimiento para esculpir las extremidades y separar los deditos.",
    meshConfig: {
      type: "embryo",
      color: 0xfbcfe8,
      coreColor: 0x6366f1,
      roughness: 0.35,
      transmission: 0.45,
      radius: 1.6
    }
  },
  {
    id: 3,
    name: "Feto Temprano",
    weeks: "Semanas 9 - 12",
    subtitle: "Transición fetal y primeros reflejos",
    sizeMm: 60,
    sizeDisplay: "6 cm",
    fruitName: "Ciruela",
    fruitIcon: "🍑",
    fruitScale: 1.3,
    bpm: 160,
    fetalMilestones: [
      "El cuerpo crece con rapidez y los órganos previamente formados comienzan su maduración funcional.",
      "Primeros movimientos reflejos involuntarios (flexionar dedos, mover labios y pataditas sutiles).",
      "Se diferencia con claridad el sexo biológico del bebé en los genitales externos."
    ],
    maternalChanges: [
      "Disminuyen gradualmente las náuseas y el malestar digestivo del primer trimestre.",
      "Aumenta la vitalidad y la energía corporal general.",
      "Ligero ensanchamiento de la cintura y abdomen inferior."
    ],
    minigameId: "ultrasound",
    minigameTitle: "Escáner de Ultrasonido 3D",
    minigameDesc: "Maneja el transductor ecográfico para identificar el cráneo, corazón latiendo y extremidades en formación.",
    meshConfig: {
      type: "early_fetus",
      color: 0xffedd5,
      coreColor: 0xf43f5e,
      roughness: 0.4,
      transmission: 0.35,
      radius: 1.8
    }
  },
  {
    id: 4,
    name: "Feto en Desarrollo",
    weeks: "Semanas 13 - 20",
    subtitle: "Crecimiento acelerado y primeras pataditas",
    sizeMm: 160,
    sizeDisplay: "16 cm",
    fruitName: "Aguacate",
    fruitIcon: "🥑",
    fruitScale: 2.1,
    bpm: 145,
    fetalMilestones: [
      "El bebé experimenta un estirón acelerado y sus sistemas sensoriales y óseos se consolidan.",
      "La madre puede percibir los primeros movimientos fetales nítidos (quickening o 'aleteos').",
      "Se forma el lanugo (vello protector muy fino) y la piel se recubre de vérnix caseosa protectora."
    ],
    maternalChanges: [
      "Crece notablemente el abdomen, haciéndose evidente el embarazo.",
      "Posibles calambres musculares nocturnos y cambios de pigmentación en la piel (línea alba).",
      "Apetito saludable y mayor volumen sanguíneo en circulación."
    ],
    minigameId: "placenta",
    minigameTitle: "El Guardián Placentario",
    minigameDesc: "Filtra nutrientes esenciales (calcio, hierro, oxígeno) hacia el cordón umbilical y bloquea sustancias dañinas.",
    meshConfig: {
      type: "developing_fetus",
      color: 0xfde047,
      coreColor: 0xec4899,
      roughness: 0.45,
      transmission: 0.25,
      radius: 2.1
    }
  },
  {
    id: 5,
    name: "Feto Avanzado",
    weeks: "Semanas 21 - 36",
    subtitle: "Maduración sensorial y preparación pulmonar",
    sizeMm: 280,
    sizeDisplay: "28 cm",
    fruitName: "Berenjena",
    fruitIcon: "🍆",
    fruitScale: 2.8,
    bpm: 138,
    fetalMilestones: [
      "Los órganos continúan su maduración terminal y el cuerpo gana capas de grasa aislante.",
      "Los pulmones maduran sintetizando surfactante alveolar para prepararse para la primera bocanada de aire.",
      "Abre y cierra los ojos, reconoce la voz de sus padres y tiene ciclos coordinados de vigilia y sueño."
    ],
    maternalChanges: [
      "Falta de aire ocasional por la presión del útero sobre el diafragma y sensación de fatiga.",
      "Mayor presión en la espalda baja, pelvis y pesadez en las piernas.",
      "Pataditas vigorosas y rotaciones visibles a través del vientre materno."
    ],
    minigameId: "sensory",
    minigameTitle: "Sinfonía Sensorial",
    minigameDesc: "Responde a estímulos sonoros de voz y música armoniosa para crear sinapsis en la corteza cerebral fetal.",
    meshConfig: {
      type: "advanced_fetus",
      color: 0xfed7aa,
      coreColor: 0x3b82f6,
      roughness: 0.48,
      transmission: 0.18,
      radius: 2.5
    }
  },
  {
    id: 6,
    name: "Término",
    weeks: "Semanas 37 - 40",
    subtitle: "¡Listo para llegar al mundo!",
    sizeMm: 500,
    sizeDisplay: "48 - 52 cm",
    fruitName: "Sandía",
    fruitIcon: "🍉",
    fruitScale: 3.5,
    bpm: 130,
    fetalMilestones: [
      "El bebé ha alcanzado la madurez orgánica completa y está 100% listo para nacer.",
      "Todos los reflejos de succión, prensión y deglución están perfectamente desarrollados.",
      "Se encaja en la pelvis en posición cefálica (cabeza hacia abajo), esperando el inicio del parto."
    ],
    maternalChanges: [
      "Contracciones de práctica más regulares y notorias (Braxton-Hicks).",
      "Descenso del abdomen (aliviando la respiración pero aumentando la presión vesical).",
      "Preparación física y emocional familiar para el momento del nacimiento."
    ],
    minigameId: "birth",
    minigameTitle: "Preparación para el Nacimiento",
    minigameDesc: "Acompaña la rotación cefálica del bebé y sincroniza la respiración rítmica para recibir a la nueva vida.",
    meshConfig: {
      type: "full_term",
      color: 0xffedd5,
      coreColor: 0x10b981,
      roughness: 0.5,
      transmission: 0.1,
      radius: 2.9
    }
  }
];

