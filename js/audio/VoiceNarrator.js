// ==========================================================================
// NARRADOR POR VOZ MÉDICA CIENTÍFICA & CÁTEDRA CLÍNICA (VoiceNarrator)
// - Explicación científica y biológica profunda de cada etapa (0 a 6).
// - Argumentación anatómica, genética, histológica, fetal y materna.
// - Compatible al 100% con Chrome, Google en móviles Android, Edge y Safari.
// - Modal interactivo de subtítulos estructurados con fichas científicas.
// ==========================================================================

export class VoiceNarrator {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.synth = window.speechSynthesis || null;
    this.isSpeaking = false;
    this.utterance = null;
    this.voice = null;

    // Cátedras científicas exhaustivas para cada una de las 7 etapas
    this.medicalCatedras = {
      0: {
        title: "Concepción & Cigoto Unicelular",
        weeks: "Semana 1",
        stageNum: "0",
        audioScript: "Bienvenidos a la Cátedra Médica de la Etapa Cero: La Concepción y la Primera Semana de Vida. Desde la perspectiva celular y molecular, todo inicia en la ampolla de la trompa de Falopio. Un espermatozoide capacitado atraviesa la corona radiada liberando enzimas acrosómicas, principalmente hialuronidasa y acrosina, permitiéndole hidrolizar la zona pelúcida mediante la unión al receptor glucoproteico ZP3. En el instante preciso de la fusión entre las membranas del espermatozoide y el ovocito, se activan dos mecanismos biológicos esenciales: la despolarización rápida de la membrana del óvulo y la reacción cortical lenta, donde gránulos exocíticos liberan enzimas que alteran irreversiblemente la zona pelúcida, bloqueando cualquier intento de polispermia. El ovocito concluye su segunda división meiótica, expulsa el segundo cuerpo polar y da paso a la singamia: la fusión de los pronúcleos masculino y femenino. En este instante se restaura el genoma diploide humano de 46 cromosomas, definiendo el sexo cromosómico, la dotación inmunológica y la huella biológica irrepetible del nuevo individuo. Sin perder un segundo, el cigoto inicia la segmentación por mitosis activa. Pasa de una a dos células, luego a cuatro, ocho y dieciséis células totipotentes en fase de mórula. Hacia el cuarto día se forma el blastocisto, una esfera diferenciada en dos linajes: el trofoblasto periférico, que dará origen a la placenta, y la masa celular interna o embrioblasto, origen del cuerpo humano. Alrededor del sexto o séptimo día, el blastocisto eclosiona de la zona pelúcida y se implanta en el endometrio secretor materno. El sincitiotrofoblasto invasivo secreta la hormona gonadotropina coriónica humana, la cual rescata al cuerpo lúteo para que continúe produciendo progesterona, impidiendo la menstruación y asegurando el soporte vital del embarazo.",
        sections: [
          { icon: "fa-dna", title: "Genética & Reacción Cortical", text: "Fusión pronuclear (singamia) que restaura los 46 cromosomas diploides. La exocitosis de gránulos corticales inactiva los receptores ZP3, creando una barrera enzimática infranqueable contra la polispermia." },
          { icon: "fa-cubes-stacked", title: "Segmentación & Blastómeras", text: "Clivajes mitóticos acelerados sin aumento de volumen: cigoto (1 célula) → mórula (16-32 células totipotentes) → blastocisto con cavidad blastocélica y masa celular interna." },
          { icon: "fa-seedling", title: "Implantación & Hormona hCG", text: "Eclosión de la zona pelúcida e invasión del estroma endometrial (días 6-7). El sincitiotrofoblasto produce gonadotropina coriónica humana (hCG) para sostener la progesterona del cuerpo lúteo." }
        ]
      },

      1: {
        title: "Embrión Temprano: Gastrulación & Primer Latido",
        weeks: "Semanas 2 a 4",
        stageNum: "1",
        audioScript: "Cátedra de la Etapa Uno: El Embrión Temprano, de la Semana Dos a la Cuatro. Este periodo representa el mayor salto arquitectónico del desarrollo humano mediante dos procesos fundamentales: la gastrulación y la neurulación. Durante la gastrulación en la tercera semana, el disco embrionario bilaminar se reorganiza en un embrión trilaminar a través de la invaginación celular en la línea primitiva. Surgen las tres hojas germinales definitivas: el ectodermo, que formará el sistema nervioso central, periférico y la epidermis; el mesodermo, origen del esqueleto axial, la musculatura, el aparato cardiovascular y el sistema urogenital; y el endodermo, precursor del revestimiento epitelial de las vías respiratorias y del tubo digestivo. Inmediatamente después, el cordón mesodérmico axial forma la notocorda, la cual emite señales moleculares morfogenéticas que inducen al ectodermo supraadyacente a engrosarse como placa neural. Esta placa se pliega en el surco neural y sus bordes convergen para formar el tubo neural. El cierre coordinado de sus extremos, el neuroporo anterior hacia el día 25 y el posterior hacia el día 28, resulta vital para prevenir malformaciones graves como la anencefalia o la espina bífida. Paralelamente, en el mesodermo paraxial se diferencian los somitas a un ritmo de tres pares por día, los cuales se segmentarán en esclerotomos para esculpir las 33 vértebras y las costillas. Pero el clímax biológico de esta etapa ocurre entre los días 21 y 22: las células mesenquimatosas del campo cardiogénico forman el tubo cardíaco primitivo. Bajo el control de canales iónicos de calcio y marcapasos endógenos, este tubo muscular inicia sus contracciones rítmicas autónomas a más de 105 latidos por minuto, bombeando la primera sangre primitiva. En la madre, la invasión trofoblástica activa y la oleada de progesterona remodelan las arterias espirales uterinas, provocando vasodilatación generalizada, náuseas matutinas y marcada congestión mamaria.",
        sections: [
          { icon: "fa-layer-group", title: "Gastrulación Trilaminar", text: "Creación de las 3 hojas blastodérmicas fundamentales: ectodermo (neuroectodermo y piel), mesodermo (huesos, músculos y sangre) y endodermo (vísceras y epitelio respiratorio)." },
          { icon: "fa-brain", title: "Neurulación & Cierre de Neuroporos", text: "La notocorda induce la invaginación de la placa neural. El neuroporo rostral se sella el día 25 y el caudal el día 28, constituyendo el tubo neural que originará el encéfalo y la médula espinal." },
          { icon: "fa-heart-pulse", title: "Cardiogénesis Primaria (Día 21-22)", text: "Fusión de los tubos endocárdicos. Las células miocárdicas inician contracciones rítmicas autónomas a 105-115 BPM, activando la primera circulación funcional con el saco vitelino." }
        ]
      },

      2: {
        title: "Periodo Embrionario Organogenético",
        weeks: "Semanas 5 a 8",
        stageNum: "2",
        audioScript: "Cátedra de la Etapa Dos: El Periodo Embrionario Organogenético, de la Semana Cinco a la Ocho. Este es el periodo más dinámico y crítico de la morfogénesis humana, en el cual se establecen todas las estructuras fundamentales de los órganos y sistemas. El embrión crece rápidamente de 4 a casi 30 milímetros. En la región cefálica y cervical, se diferencian cuatro pares de arcos faríngeos o branquiales: el primer arco mandibular origina el maxilar superior, la mandíbula y los huesecillos martillo y yunque; el segundo arco origina el estribo y el hueso hioides; mientras los arcos tercero y cuarto forman la laringe, la epiglotis y las glándulas paratiroides. A los lados de la cabeza, las vesículas ópticas se invaginan en copas ópticas y acumulan melanina pura en el epitelio pigmentario de la retina, visible como dos ojos negros circulares. En el plano locomotor, los brotes de las extremidades superiores e inferiores son guiados por la cresta ectodérmica apical. Hacia la séptima semana, las extremidades se aplanan en paletas digitales donde la muerte celular programada o apoptosis mediada por caspasas destruye selectivamente el tejido interdigital, individualizando los cinco dedos de cada mano y pie. En el tórax, el corazón primitivo concluye su tabicación interna mediante el septum primum y secundum, estructurando cuatro cavidades con frecuencia de 140 a 160 pulsaciones. Mientras tanto, en el abdomen, el hígado hematopoyético crece a una velocidad tan desmesurada que la cavidad celómica resulta insuficiente: las asas del intestino medio se hernian fisiológicamente hacia el interior del cordón umbilical en la sexta semana, realizando una rotación tridimensional antihoraria de 270 grados sobre el eje de la arteria mesentérica superior antes de reingresar al abdomen. Al completarse la octava semana, concluye la etapa embrionaria: el embrión tiene aspecto inequívocamente humano, posee todos sus órganos primordiales y se prepara para la fase fetal.",
        sections: [
          { icon: "fa-head-side-virus", title: "Arcos Faríngeos & Retina Pigmentada", text: "Modelado craneofacial: arco 1 (mandíbula, maxilar, martillo y yunque), arco 2 (estribo e hioides), arcos 3-4 (laringe). Las copas ópticas pigmentan las retinas de negro melanocítico." },
          { icon: "fa-hand", title: "Morfogénesis & Apoptosis Interdigital", text: "Las paletas de las extremidades superiores e inferiores sufren apoptosis celular programada dependiente de caspasas en las membranas interdigitales, separando los 5 dedos independientes." },
          { icon: "fa-arrows-spin", title: "Hernia Umbilical & Rotación de 270°", text: "Debido a la hipertrofia del hígado hematopoyético, el intestino medio se hernia fisiológicamente hacia el cordón umbilical y rota 270° antihorario antes de regresar al abdomen." }
        ]
      },

      3: {
        title: "Feto Temprano: Transición & Osteogénesis",
        weeks: "Semanas 9 a 12",
        stageNum: "3",
        audioScript: "Cátedra de la Etapa Tres: El Feto Temprano, de la Semana Nueve a la Doce. A partir de este momento, el organismo deja de denominarse embrión y asume formalmente la designación clínica de feto. Esta transición marca el paso de la organogénesis hacia la maduración fisiológica, la histogénesis y la aceleración del crecimiento hiperplásico. El evento osteológico dominante es el inicio de la osificación endocondral primaria: los osteoblastos comienzan a sustituir las matrices de cartílago hialino por hueso mineralizado denso en las diáfisis de los huesos largos, incluyendo el fémur, la tibia, el peroné y el húmero, así como en las placas óseas del cráneo, permitiendo una visualización nítida y ecogénica en el ultrasonido obstétrico. En la región facial, los párpados superior e inferior crecen activamente hasta fusionarse por puentes epiteliales herméticos, sellando los ojos fetales para proteger las delicadas córneas contra la irritación osmótica del líquido amniótico hasta el tercer trimestre. En el sistema digestivo y excretor, el feto inicia movimientos activos de deglución de líquido amniótico, poniendo en marcha la motilidad peristáltica gástrica e intestinal. Los riñones metanéfricos definitivos inician la ultrafiltración plasmática y secretan orina estéril y diluida directamente a la cavidad amniótica, convirtiéndose en la fuente primordial de líquido amniótico durante el resto del embarazo. En la pelvis, tiene lugar la diferenciación de los genitales externos: si el feto posee el cromosoma Y con el gen SRY, las células de Leydig producen testosterona, induciendo la fusión del surco uretral en pene y escroto; en ausencia de testosterona, los pliegues se convierten en labios menores y clítoris. Al final de la semana doce, el feto mide aproximadamente nueve centímetros, realiza estiramientos reflejos y el riesgo de aborto espontáneo disminuye drásticamente.",
        sections: [
          { icon: "fa-bone", title: "Osteogénesis Endocondral Primaria", text: "Invasión vascular de los moldes de cartílago hialino. Los osteoblastos depositan hidroxiapatita cálcica en el fémur, tibia y costillas, generando los primeros ecos óseos ecográficos." },
          { icon: "fa-eye-slash", title: "Sellado Palpebral Protector", text: "Fusión epitelial hermética de los párpados superior e inferior para resguardar las córneas y los cristalinos en diferenciación contra la maceración por sales amnióticas." },
          { icon: "fa-toilet-portable", title: "Filtración Renal & Deglución", text: "Los glomérulos metanéfricos producen orina hipotónica que se devuelve al saco amniótico, estableciendo la dinámica de reciclaje fisiológico del líquido amniótico mediante deglución fetal." }
        ]
      },

      4: {
        title: "Feto en Desarrollo: Mielinización & Sentidos",
        weeks: "Semanas 13 a 20",
        stageNum: "4",
        audioScript: "Cátedra de la Etapa Cuatro: El Feto en Desarrollo y Segundo Trimestre, de la Semana Trece a la Veinte. Conocido en obstetricia como el periodo del avivamiento fetal, esta etapa destaca por una maduración neuromotriz y sensorial sin precedentes. El feto alcanza una longitud de entre quince y veinte centímetros y su proporción anatómica se equilibra. En el sistema nervioso central, la mielinización de las vías corticoespinales permite una motilidad fina y coordinada: se consolida el reflejo de succión del pulgar y el feto traga rítmicamente hasta 400 mililitros diarios de líquido amniótico, ejercitando las papilas gustativas y fortaleciendo la musculatura labial y maseterina para el amamantamiento neonatal. En la piel, los folículos pilosos primitivos sintetizan el lanugo, un vello sedoso y ultrafino no medulado que cubre el cuerpo del feto, actuando como anclaje para la vérnix caseosa, una capa cérea protectora de lípidos y proteínas que impermeabiliza la epidermis y previene la maceración dérmica provocada por el líquido amniótico. A nivel sensorial, la cóclea en el oído interno y la cadena de huesecillos osificada en el oído medio alcanzan plena funcionalidad acústica: el feto escucha con claridad el flujo pulsátil de la arteria umbilical, los ruidos digestivos maternos, los latidos cardíacos de la madre y los tonos graves de la voz humana, a los cuales responde con aceleraciones cardíacas. En el aparato locomotor, las articulaciones diartrodiales de cadera, rodilla y tobillo están lubricadas con líquido sinovial y los músculos estriados permiten pataditas enérgicas, rotaciones y extensiones que la madre siente por primera vez entre las semanas 16 y 20, marcando un vínculo afectivo insustituible.",
        sections: [
          { icon: "fa-child-reaching", title: "Succión del Pulgar & Deglución", text: "Coordinación psicomotriz avanzada: el feto succiona su pulgar y deglute hasta 400 ml diarios de líquido amniótico, ejercitando reflejos de deglución y el peristaltismo intestinal." },
          { icon: "fa-shield-halved", title: "Lanugo & Vérnix Caseosa", text: "Secreción de lípidos sebáceos y queratina que forman una crema hidrófoba sobre la piel retenida por el lanugo, aislando la epidermis para evitar la maceración del tejido cutáneo." },
          { icon: "fa-ear-listen", title: "Oído Funcional & Quickening", text: "Mielinización del órgano de Corti: el feto responde a la voz y latidos maternos. Las articulaciones completas permiten pataditas perceptibles por la madre (avivamiento fetal)." }
        ]
      },

      5: {
        title: "Feto Avanzado: Surfactante & Neurocorteza",
        weeks: "Semanas 21 a 36",
        stageNum: "5",
        audioScript: "Cátedra de la Etapa Cinco: El Feto Avanzado y Viabilidad Extrauterina, de la Semana Veintiuno a la Treinta y Seis. Durante este periodo, la ganancia ponderal acelerada y la maduración del aparato respiratorio determinan la supervivencia del feto. A nivel pulmonar ocurre la transición crucial de la fase canalicular a la fase sacular alveolar: las células epiteliales respiratorias se diferencian en neumocitos tipo uno para el intercambio de gases y neumocitos tipo dos. Estos últimos inician la síntesis intracelular en cuerpos lamelares del surfactante pulmonar, compuesto por dipalmitoilfosfatidilcolina y apoproteínas surfactantes SP-A, B y C, cuya función fisicoquímica es reducir drásticamente la tensión superficial dentro de los alvéolos, evitando el colapso pulmonar y el síndrome de distrés respiratorio al nacer. En el neurodesarrollo, el encéfalo experimenta una explosiva giro-génesis: la corteza cerebral lisa se pliega formando cisuras y circunvoluciones profundas. Los estudios electroencefalográficos confirman ciclos de vigilia y sueño REM con movimientos oculares rápidos, demostrando que el feto sueña y procesa información sensorial. Hacia la semana 26, los párpados se descongelan y se separan: el feto abre los ojos, parpadea y exhibe fotorrespuesta pupilar al paso de luz brillante sobre el abdomen. Simultáneamente, el metabolismo fetal deposita abundante grasa parda perirrenal e interescapular rica en termogenina UCP-1 para la termogénesis sin tiritar, así como grasa blanca subcutánea que suaviza las arrugas de la piel y provee reservas energéticas. El feto supera los 35 centímetros y los 2 kilogramos de peso, colocándose casi siempre en posición cefálica con la cabeza hacia la pelvis.",
        sections: [
          { icon: "fa-lungs", title: "Surfactante Pulmonar (Neumocitos II)", text: "Síntesis de dipalmitoilfosfatidilcolina y apoproteínas SP-A/B/C. Reduce la tensión superficial intraalveolar, impidiendo la atelectasia pulmonar durante la primera inhalación de aire." },
          { icon: "fa-brain", title: "Girogénesis & Sueño REM Fetal", text: "Plegamiento cortical en circunvoluciones y surcos profundos. Registro de patrones EEG con ciclos de sueño profundo y sueño REM, procesando memorias auditivas y táctiles." },
          { icon: "fa-temperature-arrow-up", title: "Grasa Parda Termogénica (UCP-1)", text: "Acúmulo interescapular de tejido adiposo pardo con alta densidad mitocondrial rica en termogenina para regular la temperatura corporal autónoma al nacer." }
        ]
      },

      6: {
        title: "Feto a Término: Madurez Neonatal & Parto",
        weeks: "Semanas 37 a 40",
        stageNum: "6",
        audioScript: "Cátedra de la Etapa Seis: El Feto a Término y el Nacimiento, de la Semana Treinta y Siete a la Cuarenta. El milagroso viaje del desarrollo intrauterino ha concluido: el nuevo ser humano es biológica y funcionalmente apto para la vida en el mundo exterior. El feto alcanza una longitud de cincuenta centímetros y un peso medio de tres mil trescientos gramos. Sus pulmones están maduros y producen abundante surfactante; los movimientos respiratorios fetales practican la expansión torácica. La piel luce sonrosada, habiendo reabsorbido la mayor parte del lanugo y conservando vérnix en los pliegues axilares e inguinales. La osteología del neurocráneo es una maravilla de la biomecánica: los huesos frontales, parietales y occipital están separados por suturas membranosas y dos fontanelas elásticas: la fontanela anterior o bregmática con forma romboide y la posterior o lambdoidea con forma triangular. Esta plasticidad permite el cabalgamiento óseo durante el canal del parto, reduciendo el diámetro suboccipitobregmático de la cabeza a 9.5 centímetros para franquear la pelvis materna sin causar daño encefálico. El feto adopta la actitud de flexión universal completa, encajando el diámetro biparietal en el estrecho superior de la pelvis materna en Estación Cero de De Lee. La maduración del eje hipotálamo-hipófisis-adrenal fetal desencadena el parto: la glándula suprarrenal fetal secreta cortisol y sulfato de dehidroepiandrosterona, induciendo a la placenta a disparar la síntesis de estrógenos y prostaglandinas, al tiempo que inhibe la progesterona. La compresión cefálica sobre el cuello uterino estimula los barorreceptores cervicales, activando el reflejo neuroendocrino de Ferguson que libera oxitocina materna pulsátil desde la neurohipófisis. El miometrio inicia contracciones rítmicas intensas, abriendo el cuello uterino hacia diez centímetros de dilatación y guiando al bebé a través de los planos de Hodge hacia el nacimiento, su primer llanto expansivo y el corte del cordón umbilical.",
        sections: [
          { icon: "fa-skull", title: "Fontanelas & Cabalgamiento Óseo", text: "Fontanela anterior (bregma) y posterior (lambda) elásticas. Permiten la reducción del diámetro suboccipitobregmático a 9.5 cm durante el tránsito por el canal pélvico." },
          { icon: "fa-arrows-down-to-line", title: "Encajamiento Cefálico (Estación 0)", text: "Descenso del diámetro biparietal en el estrecho superior de la pelvis en flexión universal, ejerciendo presión mecánica directa sobre el segmento uterino inferior." },
          { icon: "fa-fire-flame-curved", title: "Reflejo de Ferguson & Oxitocina", text: "El cortisol fetal y la dilatación cervical desencadenan la liberación pulsátil de oxitocina materna y prostaglandinas, coordinando las contracciones miometriales del parto." }
        ]
      }
    };

    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;

    const setVoice = () => {
      const voices = this.synth.getVoices();
      this.voice =
        voices.find((v) => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Sabina') || v.name.includes('Alvaro') || v.name.includes('Jorge') || v.name.includes('Google español'))) ||
        voices.find((v) => v.lang.startsWith('es')) ||
        null;
    };

    setVoice();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = setVoice;
    }
  }

  toggleNarration(stageData) {
    if (this.isSpeaking) {
      this.stop();
      return false;
    } else {
      this.speak(stageData);
      return true;
    }
  }

  speak(stageData) {
    const stageId = stageData.id !== undefined ? stageData.id : 0;
    const catedra = this.medicalCatedras[stageId] || this.medicalCatedras[0];

    // Desplegar el modal interactivo con la cátedra científica en pantalla
    this.showCatedraModal(catedra);

    if (!this.synth) {
      if (this.engine) this.engine.showToast("📖 Cátedra Médica y Científica activa en pantalla.");
      return;
    }

    this.stopAudioOnly();

    this.utterance = new SpeechSynthesisUtterance(catedra.audioScript);
    if (this.voice) this.utterance.voice = this.voice;
    this.utterance.rate = 0.94; // Cadencia médica sosegada, reflexiva y articulada
    this.utterance.pitch = 1.0;
    this.utterance.lang = 'es-ES';

    this.utterance.onstart = () => {
      this.isSpeaking = true;
      const btn = document.getElementById('btn-voice-narrator');
      if (btn) btn.classList.add('active');
      if (this.engine) this.engine.showToast("🎙️ Cátedra Científica Médica en Curso (Audio y Transcripción)");
      this.updateAudioIndicator(true);
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      const btn = document.getElementById('btn-voice-narrator');
      if (btn) btn.classList.remove('active');
      this.updateAudioIndicator(false);
    };

    this.utterance.onerror = () => {
      this.isSpeaking = false;
      const btn = document.getElementById('btn-voice-narrator');
      if (btn) btn.classList.remove('active');
      this.updateAudioIndicator(false);
    };

    this.synth.speak(this.utterance);
  }

  updateAudioIndicator(speaking) {
    const badge = document.getElementById('audio-status-pill');
    if (badge) {
      badge.innerHTML = speaking
        ? `<span class="wave-anim" style="color: #38bdf8;">● Reproduciendo Audio Médico</span>`
        : `<span style="color: #94a3b8;">⏸️ Audio en pausa</span>`;
    }
  }

  showCatedraModal(catedra) {
    let box = document.getElementById('medical-narration-subtitles');
    if (!box) {
      box = document.createElement('div');
      box.id = 'medical-narration-subtitles';
      box.style.cssText = `
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 130;
        width: 740px;
        max-width: 95vw;
        max-height: 62vh;
        overflow-y: auto;
        background: rgba(8, 14, 28, 0.96);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid #38bdf8;
        border-radius: 16px;
        box-shadow: 0 16px 50px rgba(0,0,0,0.8);
        padding: 18px 22px;
        color: #f8fafc;
        animation: fadeIn 0.25s ease-out;
      `;
      document.body.appendChild(box);
    }

    const sectionsHtml = catedra.sections.map(s => `
      <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid #38bdf8; padding: 8px 12px; border-radius: 0 8px 8px 0; margin-bottom: 8px;">
        <strong style="color: #67e8f9; font-size: 13px; display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
          <i class="fa-solid ${s.icon}"></i> ${s.title}
        </strong>
        <p style="margin: 0; font-size: 12.5px; color: #cbd5e1; line-height: 1.5;">${s.text}</p>
      </div>
    `).join('');

    box.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(56, 189, 248, 0.3); padding-bottom: 10px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="background: linear-gradient(135deg, #0284c7, #38bdf8); color: #000; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">CÁTEDRA CLÍNICA</span>
          <div>
            <h3 style="margin: 0; font-size: 16px; color: #ffffff;">Etapa ${catedra.stageNum}: ${catedra.title}</h3>
            <span style="font-size: 11.5px; color: #38bdf8; font-weight: 600;">Periodo: ${catedra.weeks}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div id="audio-status-pill" style="font-size: 11px; padding: 3px 8px; background: rgba(56, 189, 248, 0.1); border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
            ${this.isSpeaking ? '<span style="color: #38bdf8;">● Reproduciendo Audio</span>' : '<span style="color: #94a3b8;">Transcripción Lista</span>'}
          </div>
          <button id="btn-stop-narration-box" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 12px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer; transition: all 0.2s ease;">
            <i class="fa-solid fa-stop"></i> Detener
          </button>
          <button id="btn-close-narration-box" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 2px 6px;">✕</button>
        </div>
      </div>

      <!-- Fichas de Síntesis Científica -->
      <div style="margin-bottom: 12px;">
        ${sectionsHtml}
      </div>

      <!-- Relato Clínico Continuo Completo -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 12px 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
          <i class="fa-solid fa-microphone"></i> Transcripción Completa de la Cátedra Médica:
        </span>
        <p style="color: #e2e8f0; font-size: 13px; line-height: 1.65; margin: 0; font-family: Inter, sans-serif; text-align: justify;">
          ${catedra.audioScript}
        </p>
      </div>
    `;

    box.style.display = 'block';

    const btnClose = document.getElementById('btn-close-narration-box');
    if (btnClose) btnClose.addEventListener('click', () => box.style.display = 'none');

    const btnStop = document.getElementById('btn-stop-narration-box');
    if (btnStop) {
      btnStop.addEventListener('click', () => {
        this.stop();
      });
    }
  }

  stopAudioOnly() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    const btn = document.getElementById('btn-voice-narrator');
    if (btn) btn.classList.remove('active');
  }

  stop() {
    this.stopAudioOnly();
    const box = document.getElementById('medical-narration-subtitles');
    if (box) box.style.display = 'none';
  }
}
