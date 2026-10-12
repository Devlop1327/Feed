if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                fontFamily: {
                    sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                    serif: ['"Playfair Display"', 'serif'],
                },
                colors: {
                    brand: {
                        cyan: '#0284c7',
                        amber: '#f59e0b',
                        rose: '#f43f5e',
                        emerald: '#10b981',
                        purple: '#8b5cf6'
                    }
                },
                keyframes: {
                    float: {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                    },
                    walkBounce: {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-8px)' }
                    },
                    dashMove: {
                        to: { strokeDashoffset: '-40' }
                    },
                    feedFloat: {
                        '0%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-15px)' },
                        '100%': { transform: 'translateY(0px)' }
                    }
                },
                animation: {
                    float: 'float 3.5s ease-in-out infinite',
                    walk: 'walkBounce 0.3s linear infinite',
                    dash: 'dashMove 1.5s linear infinite',
                    feedSlow: 'feedFloat 8s ease-in-out infinite'
                }
            }
        }
    };
}

const appState = {
            studentName: "Alex",
            studentGrade: "10.º Grado",
            hairStyle: "braids",
            hairColor: "#1c1917",
            skinTone: "bronze",
            expression: "happy",
            eyewear: "none",
            headwear: "none",
            clothingColor: "#0284c7",
            accessoryColor: "#f59e0b",
            audioEnabled: true,
            isDarkMode: false,
            stationStepProgress: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
            completedStations: [],
            avatarPos: { x: 4, y: 70 },
            currentStationId: 1,
            diagnosticData: null,
            stationEvidence: {},
            localSaveEnabled: false,
            badges: {
                1: { title: "Observador del feed", icon: "fa-mobile-screen-button", color: "bg-amber-400 text-amber-950" },
                2: { title: "Detective digital", icon: "fa-user-secret", color: "bg-sky-400 text-sky-950" },
                3: { title: "Voz crítica", icon: "fa-scale-balanced", color: "bg-indigo-400 text-indigo-950" },
                4: { title: "Explorador de posibilidades", icon: "fa-signs-post", color: "bg-emerald-400 text-emerald-950" },
                5: { title: "Arquitecto de posibilidades", icon: "fa-pen-ruler", color: "bg-purple-400 text-purple-950" },
                6: { title: "Creador consciente", icon: "fa-wand-magic-sparkles", color: "bg-rose-400 text-rose-950" }
            }
        };

        const stationPositions = {
            1: { x: 10, y: 68 },
            2: { x: 26, y: 28 },
            3: { x: 45, y: 45 },
            4: { x: 64, y: 35 },
            5: { x: 76, y: 18 },
            6: { x: 88, y: 48 }
        };

        const stationEvidencePrompts = {
            1: { label: "Leer entre líneas", prompt: "En el caso ficticio del reto, ¿qué parte del éxito se muestra, qué queda fuera y qué pregunta harías antes de creerlo?", placeholder: "Anota una señal, una omisión y una pregunta de verificación...", criterion: "Distingo lo visible de lo omitido y formulo una pregunta crítica." },
            2: { label: "Rastrear una afirmación", prompt: "Elige una afirmación del reto. ¿Qué fuente consultarías y qué dato necesitarías para considerarla confiable?", placeholder: "Afirmación · fuente que consultarías · dato que buscarías...", criterion: "Propongo una fuente pertinente y explico qué evidencia buscaría." },
            3: { label: "Construir una voz crítica", prompt: "Frente a la afirmación del reto, escribe una razón que sostenga tu postura y una pregunta respetuosa para alguien que piensa distinto.", placeholder: "Mi razón es... / Una pregunta que abriría el diálogo es...", criterion: "Argumento con razones y considero otra perspectiva." },
            4: { label: "Trazar una ruta posible", prompt: "Para el personaje ficticio del reto, propón un primer paso, una habilidad que puede fortalecer y un apoyo u oportunidad que podría explorar.", placeholder: "Primer paso · habilidad · apoyo u oportunidad...", criterion: "Relaciono un paso concreto con habilidades y apoyos posibles." },
            5: { label: "Explorar sin decidirlo todo", prompt: "Imagina un personaje con un interés que quiere explorar. ¿Qué experiencia pequeña podría probar y qué apoyo le serviría? También puedes responder desde una aspiración propia, sin incluir datos personales.", placeholder: "Interés o caso ficticio · pequeño paso · apoyo posible...", criterion: "Conecto un interés con un siguiente paso exploratorio." },
            6: { label: "Diseñar un feed consciente", prompt: "Crea un borrador que amplíe la idea de éxito: puede ser un titular, una escena, una frase para un audio o la primera lámina de un carrusel. No se publica en redes.", placeholder: "Escribe el mensaje principal de tu pieza...", criterion: "Creo un mensaje respetuoso, con propósito y sin obligación de publicarlo." }
        };

        const progressStorageKey = 'mi-vida-mi-feed-progress-v1';

        // Synthesized Audio Effects using Web Audio API
        function playSfx(type) {
            if (!appState.audioEnabled) return;
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                if (type === 'click') {
                    osc.frequency.setValueAtTime(400, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
                    gain.gain.setValueAtTime(0.15, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                } else if (type === 'success') {
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.35);
                }
            } catch (e) {
                console.log("Audio not supported");
            }
        }

        function toggleAudio() {
            appState.audioEnabled = !appState.audioEnabled;
            const btn = document.getElementById('audio-btn');
            btn.innerHTML = appState.audioEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
            playSfx('click');
        }

        function toggleTheme() {
            appState.isDarkMode = !appState.isDarkMode;
            const html = document.documentElement;
            const icon = document.getElementById('theme-icon');
            if (appState.isDarkMode) {
                html.classList.remove('light');
                html.classList.add('dark');
                icon.className = 'fa-solid fa-sun';
            } else {
                html.classList.remove('dark');
                html.classList.add('light');
                icon.className = 'fa-solid fa-moon';
            }
            playSfx('click');
        }

        // STATION QUESTION DATA BANKS (5 STEPS PER STATION)
        const stationQuestions = {
            1: [
                {
                    type: "1. Caso Viral",
                    icon: "fa-magnifying-glass",
                    question: "Analiza esta publicación: 'Abandona el colegio a los 15. Compré un auto de lujo vendiendo humo digital. ¡El estudio no sirve!' ¿Qué falta en esta historia?",
                    options: [
                        { text: "Falta el sesgo de supervivencia: no muestra a las miles de personas que pierden su dinero en esquemas engañosos.", correct: true },
                        { text: "Nada, muestra la única realidad del éxito acelerado actual.", correct: false },
                        { text: "Solo falta que indique en qué plataforma compró el vehículo.", correct: false }
                    ],
                    explanation: "¡Correcto! Los videos virales muestran excepciones extremas y ocultan las deudas y la insostenibilidad de las promesas de dinero rápido."
                },
                {
                    type: "2. Trivia Algoritmo",
                    icon: "fa-brain",
                    question: "¿Por qué los algoritmos de redes sociales recomiendan constantemente contenidos de lujo y dinero fácil?",
                    options: [
                        { text: "Porque las redes sociales investigan académicamente la verdad de cada video.", correct: false },
                        { text: "Porque retienen la atención mediante emociones de sorpresa, deseo y comparación.", correct: true },
                        { text: "Porque todos los creadores de contenido son empresarios certificados.", correct: false }
                    ],
                    explanation: "¡Exacto! Los algoritmos están diseñados para captar tiempo de pantalla, no para educar sobre finanzas o proyectos de vida."
                },
                {
                    type: "3. Quiz Evidencia",
                    icon: "fa-circle-question",
                    question: "Si ves una imagen con fajos de dinero y un texto que dice 'Gana $10.000 USD hoy', ¿qué prueba debes exigir?",
                    options: [
                        { text: "Que el creador tenga más de 100.000 seguidores en TikTok.", correct: false },
                        { text: "Que el video tenga música de tendencia de fondo.", correct: false },
                        { text: "Auditoría financiera real, modelo de negocio transparente e información sobre impuestos y leyes.", correct: true }
                    ],
                    explanation: "¡Muy bien! Los seguidores y la popularidad no son prueba técnica de veracidad ni sostenibilidad."
                },
                {
                    type: "4. Escenario Decisión",
                    icon: "fa-tree-city",
                    question: "Un compañero de 10.º te propone retirarse del colegio para meterse a una app que promete ingresos mágicos sin trabajar. ¿Qué le recomiendas?",
                    options: [
                        { text: "Investigar los riesgos de pirámides financieras y acudir a Orientación Escolar antes de tomar decisiones impulsivas.", correct: true },
                        { text: "Apoyarlo e imitarlo para no quedarse atrás en las redes.", correct: false },
                        { text: "Ignorarlo y no hablarle nunca más.", correct: false }
                    ],
                    explanation: "¡Excelente decisión! El acompañamiento reflexivo previene estafas y protege las oportunidades de futuro."
                },
                {
                    type: "5. Debate Grupal",
                    icon: "fa-comments",
                    question: "En equipo de aula: ¿Cuál es la diferencia entre el 'éxito de apariencia en redes' y el 'éxito personal sostenible'?",
                    options: [
                        { text: "No existe diferencia, el éxito depende únicamente del número de vistas.", correct: false },
                        { text: "El éxito real requiere aprendizaje, ética, bienestar personal y aportes significativos a la comunidad, no solo likes.", correct: true }
                    ],
                    explanation: "¡Reflexión impecable! Has completado las 5 misiones de la Estación 1."
                }
            ],

            2: [
                {
                    type: "1. Caso Viral",
                    icon: "fa-magnifying-glass",
                    question: "Titular sensacionalista: '¡Científicos descubren chip que reemplaza la escuela y los libros!'. ¿Cuál es el primer paso?",
                    options: [
                        { text: "Compartir de inmediato en el grupo de WhatsApp del salón.", correct: false },
                        { text: "Identificar la fuente original, la fecha y consultar si existe en revistas científicas indexadas.", correct: true }
                    ],
                    explanation: "¡Correcto! Las noticias falsas aprovechan títulos llamativos para volverse virales sin sustento."
                },
                {
                    type: "2. Trivia Algoritmo",
                    icon: "fa-brain",
                    question: "¿Qué es una 'cámara de eco' en las plataformas digitales?",
                    options: [
                        { text: "Un fenómeno donde el algoritmo solo te muestra publicaciones que reafirman lo que ya crees, aislándote de otras realidades.", correct: true },
                        { text: "Un filtro de audio utilizado para grabar videos en TikTok.", correct: false }
                    ],
                    explanation: "¡Así es! Las cámaras de eco impiden el pensamiento crítico al ocultar visiones diversas."
                },
                {
                    type: "3. Quiz Evidencia",
                    icon: "fa-circle-question",
                    question: "¿Qué caracteriza a una afirmación con suficiente evidencia académica o científica?",
                    options: [
                        { text: "Ser dicha con tono seguro por un influencer famoso.", correct: false },
                        { text: "Datos replicables, metodología transparente, revisión por pares y fuentes declaradas.", correct: true }
                    ],
                    explanation: "¡Perfecto! El tono o la fama del emisor no reemplazan el rigor probatorio."
                },
                {
                    type: "4. Escenario Decisión",
                    icon: "fa-tree-city",
                    question: "Llega una cadena que afirma que las becas de educación superior en Buenaventura fueron suspendidas. ¿Qué haces?",
                    options: [
                        { text: "Ingresar a los canales oficiales de la Secretaría de Educación y el Ministerio antes de alarmarse.", correct: true },
                        { text: "Reenviarla a todos los contactos para que protesten de inmediato.", correct: false }
                    ],
                    explanation: "¡Gran actitud crítica! La verificación oficial previene la desinformación colectiva."
                },
                {
                    type: "5. Debate Grupal",
                    icon: "fa-comments",
                    question: "Pensemos Juntos: ¿Por qué es irresponsable difundir contenidos sin verificar su veracidad?",
                    options: [
                        { text: "Porque los administradores del grupo se molestarían.", correct: false },
                        { text: "Porque perjudica las decisiones de vida de las personas y genera confusión en la comunidad.", correct: true }
                    ],
                    explanation: "¡Excelente! Has superado los 5 niveles de la Estación 2."
                }
            ],

            3: [
                {
                    type: "1. Caso Viral",
                    icon: "fa-magnifying-glass",
                    question: "Un influencer afirma: 'Los títulos universitarios no sirven para nada en el Pacífico'. ¿Cómo evalúas esta afirmación?",
                    options: [
                        { text: "Es una generalización apresurada; la formación técnica y profesional abre puertas estratégicas en el desarrollo territorial.", correct: true },
                        { text: "Es una verdad absoluta que aplica para todos los jóvenes.", correct: false }
                    ],
                    explanation: "¡Correcto! Las opiniones individuales no deben confundirse con datos de empleo e impacto social."
                },
                {
                    type: "2. Trivia Algoritmo",
                    icon: "fa-brain",
                    question: "¿Qué es la falacia 'Ad Hominem' en un debate sobre educación y futuro?",
                    options: [
                        { text: "Defender una idea utilizando gráficos y estadísticas reales.", correct: false },
                        { text: "Atacar o descalificar a la persona que opina en lugar de refutar sus argumentos con razones.", correct: true }
                    ],
                    explanation: "¡Muy bien! Respetar al interlocutor y debatir sobre las ideas es la base del pensamiento crítico."
                },
                {
                    type: "3. Quiz Evidencia",
                    icon: "fa-circle-question",
                    question: "¿Cuál es la diferencia clave entre una 'opinión' y un 'argumento'?",
                    options: [
                        { text: "La opinión expresa una preferencia personal; el argumento respalda la conclusión con datos, ejemplos y lógica.", correct: true },
                        { text: "No hay diferencia, ambas valen exactamente lo mismo en un debate científico.", correct: false }
                    ],
                    explanation: "¡Así se argumenta! El sustento de los hechos le da solidez a la voz crítica."
                },
                {
                    type: "4. Escenario Decisión",
                    icon: "fa-tree-city",
                    question: "En un grupo escolar se burlan de quien estudia para el examen del ICFES. ¿Cómo actúas con criterio?",
                    options: [
                        { text: "Dejar de estudiar para encajar en el grupo.", correct: false },
                        { text: "Expresar con respeto la importancia de prepararse autónomamente para acceder a oportunidades.", correct: true }
                    ],
                    explanation: "¡Muy bien! Defender el valor del aprendizaje fortalece tu proyecto de vida."
                },
                {
                    type: "5. Debate Grupal",
                    icon: "fa-comments",
                    question: "Debate en Aula: ¿Qué contraejemplos de éxito a través del estudio conocemos en Buenaventura?",
                    options: [
                        { text: "Docentes, científicos, ingenieros, artistas y líderes etnoeducativos que transforman el distrito.", correct: true },
                        { text: "Ninguno, solo los creadores de contenido tienen éxito.", correct: false }
                    ],
                    explanation: "¡Excelente! Completaste los 5 pasos de la Estación 3."
                }
            ],

            4: [
                {
                    type: "1. Caso Viral",
                    icon: "fa-magnifying-glass",
                    question: "Se promueve la idea de que 'Si no entras a una carrera tradicional de 5 años, fracasaste'. ¿Es cierto?",
                    options: [
                        { text: "Verdadero. Solo las carreras tradicionales garantizan realización.", correct: false },
                        { text: "Falso. Existen rutas técnicas, tecnológicas, emprendimientos y formación continua altamente valiosos.", correct: true }
                    ],
                    explanation: "¡Exacto! Cada estudiante puede construir un trayecto educativo acorde a sus metas."
                },
                {
                    type: "2. Trivia Algoritmo",
                    icon: "fa-brain",
                    question: "¿Qué oportunidades de formación superior y técnica existen en el Distrito de Buenaventura?",
                    options: [
                        { text: "El SENA, la Universidad del Pacífico, la Universidad del Valle y centros etnoeducativos.", correct: true },
                        { text: "Únicamente cursos virtuales fuera del país.", correct: false }
                    ],
                    explanation: "¡Muy bien! Conocer la oferta territorial permite tomar decisiones informadas."
                },
                {
                    type: "3. Quiz Evidencia",
                    icon: "fa-circle-question",
                    question: "¿Qué son las 'competencias transversales' para el mundo laboral y comunitario?",
                    options: [
                        { text: "Saber manejar únicamente una aplicación de redes sociales.", correct: false },
                        { text: "Capacidades como la resolución de problemas, la empatía, el trabajo en equipo y la comunicación.", correct: true }
                    ],
                    explanation: "¡Impecable! Las habilidades socioemocionales son claves en todas las rutas."
                },
                {
                    type: "4. Escenario Decisión",
                    icon: "fa-tree-city",
                    question: "El personaje no obtiene el cupo en su primera opción universitaria. ¿Qué alternativa constructiva elige?",
                    options: [
                        { text: "Iniciar una técnica afín, fortalecer áreas en el ICFES y explorar becas locales.", correct: true },
                        { text: "Abandonar sus aspiraciones y no volver a intentar nada.", correct: false }
                    ],
                    explanation: "¡Resiliencia total! Las rutas de vida tienen desvíos y alternativas válidas."
                },
                {
                    type: "5. Debate Grupal",
                    icon: "fa-comments",
                    question: "Pensemos Juntos: ¿Cómo se complementan el trabajo y el estudio en el proyecto de futuro?",
                    options: [
                        { text: "Permiten aplicar conocimientos, adquirir experiencia real y financiar metas de aprendizaje.", correct: true },
                        { text: "Son incompatibles y nunca deben juntarse.", correct: false }
                    ],
                    explanation: "¡Felicitaciones! Superaste las 5 pruebas de la Estación 4."
                }
            ],

            5: [
                {
                    type: "1. Caso Viral",
                    icon: "fa-magnifying-glass",
                    question: "Mito digital: 'Debes tener resuelto todo tu proyecto de vida a los 15 años'. ¿Cómo responder?",
                    options: [
                        { text: "Si no tienes carrera definida a los 15, ya no podrás lograr nada.", correct: false },
                        { text: "El proyecto de vida es un proceso dinámico de exploración, ajustes y aprendizaje continuo.", correct: true }
                    ],
                    explanation: "¡Exacto! No se trata de imponer un destino rígido, sino de construir criterios propios."
                },
                {
                    type: "2. Trivia Algoritmo",
                    icon: "fa-brain",
                    question: "¿Qué elementos integran la Matriz de Autoconocimiento?",
                    options: [
                        { text: "Intereses personales, habilidades por desarrollar, valores, red de apoyo y oportunidades del entorno.", correct: true },
                        { text: "El número de seguidores y los me gusta recibidos.", correct: false }
                    ],
                    explanation: "¡Así es! El autoconocimiento reflexivo sostiene decisiones auténticas."
                },
                {
                    type: "3. Quiz Evidencia",
                    icon: "fa-circle-question",
                    question: "¿Quiénes forman parte de tu red de apoyo institucional en la I.E. Francisco José de Caldas?",
                    options: [
                        { text: "Exclusivamente cuentas anónimas de redes sociales.", correct: false },
                        { text: "Orientación Escolar, docentes, directivos, familia y pares colaboradores.", correct: true }
                    ],
                    explanation: "¡Muy bien! Reconocer los apoyos comunitarios da confianza para explorar."
                },
                {
                    type: "4. Escenario Decisión",
                    icon: "fa-tree-city",
                    question: "Sientes dudas sobre tus verdaderos gustos frente a las expectativas de la red. ¿Qué estrategia aplicas?",
                    options: [
                        { text: "Escribir en la bitácora personal, probar distintas actividades y consultar a Orientación.", correct: true },
                        { text: "Copiar la profesión del influencer con más vistas del día.", correct: false }
                    ],
                    explanation: "¡Excelente! Priorizar la voz propia frente al ruido digital."
                },
                {
                    type: "5. Debate Grupal",
                    icon: "fa-comments",
                    question: "Construcción colectiva: ¿Cómo aportan mis talentos al desarrollo del Distrito de Buenaventura?",
                    options: [
                        { text: "Poniendo el conocimiento y el arte al servicio de soluciones locales y la identidad etnoeducativa.", correct: true },
                        { text: "No aportando nada al territorio.", correct: false }
                    ],
                    explanation: "¡Logro alcanzado! Completaste los 5 ejercicios de la Estación 5."
                }
            ],

            6: [
                {
                    type: "1. Caso Viral",
                    icon: "fa-magnifying-glass",
                    question: "Un video viral promueve burlas y estereotipos sobre el estudio en el colegio. ¿Cómo cambiamos el feed?",
                    options: [
                        { text: "Dándole me gusta y compartiéndolo en todas las historias.", correct: false },
                        { text: "Creando contenidos que visibilicen el talento, los proyectos escolares y el pensamiento crítico.", correct: true }
                    ],
                    explanation: "¡Grandioso! Somos creadores conscientes capaces de transformar la conversación digital."
                },
                {
                    type: "2. Trivia Algoritmo",
                    icon: "fa-brain",
                    question: "¿Qué es la 'Huella Digital' y por qué es relevante para tu futuro?",
                    options: [
                        { text: "El rastro permanente de comentarios, fotos y datos que dejas en internet y que influye en tu reputación.", correct: true },
                        { text: "La marca que dejas en la pantalla del celular cuando lo usas.", correct: false }
                    ],
                    explanation: "¡Así se piensa! Publicar de forma ética cuida tus oportunidades académicas y personales."
                },
                {
                    type: "3. Quiz Evidencia",
                    icon: "fa-circle-question",
                    question: "¿Qué elementos caracterizan a una publicación digital responsable y argumentada?",
                    options: [
                        { text: "Lenguaje agresivo, títulos engañosos y provocación desinformada.", correct: false },
                        { text: "Lenguaje respetuoso, datos verificados, reconocimiento de fuentes y propósito constructivo.", correct: true }
                    ],
                    explanation: "¡Perfecto! La responsabilidad digital distingue al creador consciente."
                },
                {
                    type: "4. Escenario Decisión",
                    icon: "fa-tree-city",
                    question: "El grupo de 10.º decide lanzar una campaña contra el ciberacoso y los mitos del éxito fácil. ¿Cuál es el formato más potente?",
                    options: [
                        { text: "Infografías interactivas, podcasts breves con testimonios de la comunidad e historias explicativas.", correct: true },
                        { text: "Publicar cadenas sin texto informativo.", correct: false }
                    ],
                    explanation: "¡Excelente iniciativa! La creatividad al servicio de la educación."
                },
                {
                    type: "5. Debate Grupal",
                    icon: "fa-comments",
                    question: "Compromiso de Aula: ¿Cómo será nuestro feed colectivo de la I.E. Francisco José de Caldas?",
                    options: [
                        { text: "Un espacio para consumir contenido sin criterio.", correct: false },
                        { text: "Un espacio para cuestionar mitos, inspirar a otros jóvenes y construir el futuro más allá de la pantalla.", correct: true }
                    ],
                    explanation: "¡FELICITACIONES! Has superado las 5 actividades de la Estación 6."
                }
            ]
        };

        // Renders realistic solid SVG Avatars
        function renderAvatarSVG(isMap = false) {
            const skinMap = {
                ebony: "#3b200b",
                bronze: "#8d5524",
                warm: "#c68642",
                chestnut: "#6b3e19",
                caramel: "#d69358"
            };
            const skinCol = skinMap[appState.skinTone] || "#8d5524";
            const hairCol = appState.hairColor || "#1c1917";
            const clothCol = appState.clothingColor || "#0b7a57";
            const shirtCol = "#f8fafc";
            const shirtAccent = appState.clothingColor === '#f9dfe9' || appState.clothingColor === '#f8e6f1' || appState.clothingColor === '#fbe7ef' || appState.clothingColor === '#f8d7cb' ? '#f4c7d6' : '#d7b35f';

            let hairSVG = "";
            if (appState.hairStyle === "braids") {
                hairSVG = `
                    <path d="M 25 32 C 25 10, 75 10, 75 32 C 75 22, 25 22, 25 32 Z" fill="${hairCol}"/>
                    <rect x="22" y="30" width="8" height="42" rx="4" fill="${hairCol}"/>
                    <rect x="33" y="28" width="8" height="48" rx="4" fill="${hairCol}"/>
                    <rect x="59" y="28" width="8" height="48" rx="4" fill="${hairCol}"/>
                    <rect x="70" y="30" width="8" height="42" rx="4" fill="${hairCol}"/>
                `;
            } else if (appState.hairStyle === "afro") {
                hairSVG = `
                    <circle cx="50" cy="30" r="34" fill="${hairCol}"/>
                    <circle cx="30" cy="38" r="22" fill="${hairCol}"/>
                    <circle cx="70" cy="38" r="22" fill="${hairCol}"/>
                `;
            } else if (appState.hairStyle === "dreads") {
                hairSVG = `
                    <path d="M 20 25 Q 50 12 80 25 L 82 55 Q 50 48 18 55 Z" fill="${hairCol}"/>
                    <rect x="18" y="25" width="7" height="38" rx="3" fill="${hairCol}"/>
                    <rect x="28" y="22" width="7" height="45" rx="3" fill="${hairCol}"/>
                    <rect x="65" y="22" width="7" height="45" rx="3" fill="${hairCol}"/>
                    <rect x="75" y="25" width="7" height="38" rx="3" fill="${hairCol}"/>
                `;
            } else { // fade / default
                hairSVG = `
                    <path d="M 26 35 C 26 16, 74 16, 74 35 L 74 32 C 74 18, 26 18, 26 32 Z" fill="${hairCol}"/>
                    <path d="M 28 32 C 28 18, 72 18, 72 32 Z" fill="${hairCol}"/>
                `;
            }

            let eyewearSVG = "";
            if (appState.eyewear === "classic" || appState.eyewear === "round") {
                eyewearSVG = `
                    <rect x="32" y="42" width="14" height="10" rx="3" fill="none" stroke="#000" stroke-width="2.5"/>
                    <rect x="54" y="42" width="14" height="10" rx="3" fill="none" stroke="#000" stroke-width="2.5"/>
                    <line x1="46" y1="47" x2="54" y2="47" stroke="#000" stroke-width="2.5"/>
                `;
            } else if (appState.eyewear === "shades") {
                eyewearSVG = `
                    <path d="M 30 42 L 48 42 L 45 54 L 33 54 Z" fill="#111827"/>
                    <path d="M 52 42 L 70 42 L 67 54 L 55 54 Z" fill="#111827"/>
                    <line x1="48" y1="44" x2="52" y2="44" stroke="#111827" stroke-width="3"/>
                `;
            }

            let headwearSVG = "";
            if (appState.headwear === "headphones") {
                headwearSVG = `
                    <path d="M 20 45 C 20 12, 80 12, 80 45" fill="none" stroke="#f59e0b" stroke-width="5"/>
                    <rect x="15" y="40" width="10" height="20" rx="4" fill="#1e293b"/>
                    <rect x="75" y="40" width="10" height="20" rx="4" fill="#1e293b"/>
                `;
            } else if (appState.headwear === "cap") {
                headwearSVG = `
                    <path d="M 22 34 C 22 18, 78 18, 78 34 Z" fill="#f59e0b"/>
                    <path d="M 15 34 Q 50 30 85 34 L 85 38 Q 50 34 15 38 Z" fill="#d97706"/>
                `;
            }

            return `
                <svg class="w-full h-full" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet" fill="none">
                    <!-- Neck -->
                    <rect x="42" y="62" width="16" height="18" rx="4" fill="${skinCol}"/>
                    
                    <!-- Uniform body -->
                    <path d="M 18 84 C 25 72, 75 72, 82 84 L 92 138 L 8 138 Z" fill="${clothCol}"/>
                    <path d="M 26 82 L 50 96 L 74 82 L 78 138 L 22 138 Z" fill="${clothCol}" opacity="0.9"/>
                    <path d="M 28 80 L 50 94 L 72 80 L 74 118 L 26 118 Z" fill="${shirtCol}"/>
                    <path d="M 34 79 L 50 90 L 66 79 Z" fill="#ffffff"/>
                    <path d="M 46 90 L 50 116 L 54 90 Z" fill="${shirtAccent}"/>
                    <path d="M 22 82 L 28 90 L 36 80 L 36 104 L 22 116 Z" fill="#0b5f4d" opacity="0.36"/>
                    <path d="M 78 82 L 72 90 L 64 80 L 64 104 L 78 116 Z" fill="#0b5f4d" opacity="0.36"/>
                    <path d="M 22 100 L 28 96 L 28 130 L 22 138 Z" fill="${clothCol}"/>
                    <path d="M 78 100 L 72 96 L 72 130 L 78 138 Z" fill="${clothCol}"/>

                    <!-- School shield emblem - right side of shirt -->
                    <g transform="translate(66 101) scale(0.78)">
                        <path d="M -18 18 C -18 -8, -10 -18, 0 -26 C 10 -18, 18 -8, 18 18 L 12 22 C 8 28, 4 31, 0 35 C -4 31, -8 28, -12 22 Z" fill="#d4a72c" stroke="#f1d77c" stroke-width="1.2"/>
                        <path d="M -16 16 C -13 -7, -7 -15, 0 -20 C 7 -15, 13 -7, 16 16 L 11 20 C 9 27, 5 31, 0 34 C -5 31, -9 27, -11 20 Z" fill="#0d4f8f"/>
                        <path d="M -11 6 L 0 15 L 11 6 L 11 16 L 0 24 L -11 16 Z" fill="#d4a72c" opacity="0.7"/>
                        <path d="M -15 2 L 15 2 L 15 6 L 10 6 L 10 11 L 15 11 L 15 16 L -15 16 L -15 11 L -10 11 L -10 6 L -15 6 Z" fill="#f8fafc" opacity="0.9"/>
                        <path d="M -15 -5 L -5 -10 L -5 9 L 0 14 L 5 9 L 5 -10 L 15 -5 L 0 -15 Z" fill="#d4a72c" opacity="0.9"/>
                        <path d="M -10 -6 L -2 -12 L 0 -14 L 2 -12 L 10 -6" stroke="#f9e7a5" stroke-width="1" fill="none" stroke-linecap="round"/>
                        <path d="M -8 2 L 8 2" stroke="#f9e7a5" stroke-width="1.25" stroke-linecap="round"/>
                        <circle cx="10" cy="-8" r="3.2" fill="#f6d86a"/>
                        <path d="M -18 18 C -18 26, -6 31, 0 35 C 6 31, 18 26, 18 18" fill="none" stroke="#f1d77c" stroke-width="1.4"/>
                    </g>

                    <!-- Head Base -->
                    <rect x="28" y="28" width="44" height="44" rx="20" fill="${skinCol}"/>
                    <!-- Ears -->
                    <circle cx="27" cy="50" r="5" fill="${skinCol}"/>
                    <circle cx="73" cy="50" r="5" fill="${skinCol}"/>

                    <!-- Eyes -->
                    <circle cx="40" cy="47" r="3.5" fill="#ffffff"/>
                    <circle cx="60" cy="47" r="3.5" fill="#ffffff"/>
                    <circle cx="40" cy="47" r="2" fill="#1e293b"/>
                    <circle cx="60" cy="47" r="2" fill="#1e293b"/>
                    
                    <!-- Eyebrows -->
                    <path d="M 35 41 Q 40 39 45 41" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>
                    <path d="M 55 41 Q 60 39 65 41" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>

                    <!-- Nose & Smile -->
                    <path d="M 50 49 L 48 54 L 52 54" stroke="#000000" stroke-width="1.2" opacity="0.3" fill="none"/>
                    <path d="M 42 59 Q 50 66 58 59" stroke="#000000" stroke-width="2.5" stroke-linecap="round" fill="none"/>

                    <!-- Hair Layer -->
                    ${hairSVG}

                    <!-- Accessories Layer -->
                    ${eyewearSVG}
                    ${headwearSVG}
                </svg>
            `;
        }

        function renderWelcomeAvatarVariant(profile = {}) {
            const previousState = {
                hairStyle: appState.hairStyle,
                hairColor: appState.hairColor,
                skinTone: appState.skinTone,
                eyewear: appState.eyewear,
                headwear: appState.headwear,
                clothingColor: appState.clothingColor
            };

            Object.assign(appState, profile);
            const svg = renderAvatarSVG();
            Object.assign(appState, previousState);
            return svg;
        }

        function refreshAvatars() {
            const svgContent = renderAvatarSVG();
            
            const studioPrev = document.getElementById('studio-avatar-preview');
            if (studioPrev) studioPrev.innerHTML = svgContent;

            const mapAvatar = document.getElementById('map-avatar-svg-container');
            if (mapAvatar) mapAvatar.innerHTML = svgContent;

            const headerAvatar = document.getElementById('header-avatar-preview');
            if (headerAvatar) headerAvatar.innerHTML = svgContent;

            const passportAvatar = document.getElementById('passport-avatar-container');
            if (passportAvatar) passportAvatar.innerHTML = svgContent;

            const welcomeAvatars = document.getElementById('welcome-avatars-container');
            if (welcomeAvatars) {
                const profileVariants = [
                    { hairStyle: 'braids', hairColor: '#2f1d18', skinTone: 'bronze', clothingColor: '#0b7a57', eyewear: 'none', headwear: 'none' },
                    { hairStyle: 'afro', hairColor: '#3b1f1f', skinTone: 'caramel', clothingColor: '#f8e6f1', eyewear: 'round', headwear: 'none' },
                    { hairStyle: 'fade', hairColor: '#2b150e', skinTone: 'warm', clothingColor: '#0a5d8f', eyewear: 'none', headwear: 'none' },
                    { hairStyle: 'braids', hairColor: '#4b2c1d', skinTone: 'ebony', clothingColor: '#fbe7ef', eyewear: 'shades', headwear: 'none' },
                    { hairStyle: 'dreads', hairColor: '#301d12', skinTone: 'chestnut', clothingColor: '#0c6d53', eyewear: 'none', headwear: 'headphones' },
                    { hairStyle: 'curls', hairColor: '#1f2937', skinTone: 'bronze', clothingColor: '#f8d7cb', eyewear: 'classic', headwear: 'none' }
                ];

                welcomeAvatars.innerHTML = profileVariants.map((profile, index) => {
                    const offset = index % 2 === 0 ? 'scale-105' : '-translate-y-3 opacity-95';
                    const size = index === 0 || index === profileVariants.length - 1 ? 'w-24 h-32' : 'w-20 h-28';
                    return `<div class="welcome-avatar-item ${size} ${offset}">${renderWelcomeAvatarVariant(profile)}</div>`;
                }).join('');
            }
        }

        // Navigation and Map Positioning
        function updateLockedStationsUI() {
            for (let i = 1; i <= 6; i++) {
                const node = document.getElementById(`island-node-${i}`);
                const lockBadge = document.getElementById(`lock-badge-${i}`);
                const isUnlocked = (i === 1) || appState.completedStations.includes(i - 1);
                
                if (node) {
                    if (isUnlocked) {
                        node.classList.remove('opacity-40', 'grayscale', 'pointer-events-none');
                        node.classList.add('cursor-pointer');
                    } else {
                        node.classList.add('opacity-40', 'grayscale');
                    }
                }
                
                if (lockBadge) {
                    if (isUnlocked) {
                        lockBadge.classList.add('hidden');
                    } else {
                        lockBadge.classList.remove('hidden');
                    }
                }
            }
        }

        function selectStation(id) {
            // Sequential progression check: station `id` requires `id - 1` to be completed
            if (id > 1 && !appState.completedStations.includes(id - 1)) {
                playSfx('click');
                const speech = document.getElementById('avatar-speech');
                if (speech) {
                    speech.textContent = `🔒 ¡Completa la Estación ${id - 1} para desbloquear esta isla!`;
                }
                return;
            }

            playSfx('click');
            appState.currentStationId = id;
            const pos = stationPositions[id];
            
            const avatarEl = document.getElementById('student-avatar-map');
            if (avatarEl && pos) {
                avatarEl.style.left = `${pos.x}%`;
                avatarEl.style.top = `${pos.y}%`;
            }

            const speech = document.getElementById('avatar-speech');
            if (speech) {
                speech.textContent = `¡Estación ${id}: ${appState.badges[id].title}!`;
            }

            openStationModal(id);
        }

        function moveAvatarToStation(id) {
            selectStation(id);
        }

        function moveAvatarDirection(dir) {
            let current = appState.currentStationId || 1;
            let target = current;
            if (dir === 'right' || dir === 'down') {
                target = Math.min(6, current + 1);
            } else if (dir === 'left' || dir === 'up') {
                target = Math.max(1, current - 1);
            }
            if (target !== current) {
                selectStation(target);
            }
        }

        // Modal triggers
        function openOnboardingModal() {
            goToOnboardingStep(1);
            const modal = document.getElementById('onboarding-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function goToOnboardingStep(step) {
            playSfx('click');
            const step1 = document.getElementById('onboarding-step-1');
            const step2 = document.getElementById('onboarding-step-2');
            if (step === 1) {
                if (step1) step1.classList.remove('hidden');
                if (step2) step2.classList.add('hidden');
            } else if (step === 2) {
                if (step1) step1.classList.add('hidden');
                if (step2) step2.classList.remove('hidden');
                const nameInput = document.getElementById('onboarding-input-name');
                if (nameInput) nameInput.value = appState.studentName || "Alex";
            }
        }

        function selectOnboardingGrade(grade) {
            playSfx('click');
            appState.studentGrade = grade;
            const btns = document.querySelectorAll('.ob-grade-btn');
            btns.forEach(btn => {
                if (btn.getAttribute('data-ob-grade') === grade) {
                    btn.className = 'ob-grade-btn py-2.5 rounded-xl font-black text-xs border border-amber-400 bg-amber-400 text-amber-950 shadow-md scale-105';
                } else {
                    btn.className = 'ob-grade-btn py-2.5 rounded-xl font-black text-xs border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white';
                }
            });
        }

        function finishOnboardingAndStart() {
            playSfx('success');
            const nameInput = document.getElementById('onboarding-input-name');
            if (nameInput && nameInput.value.trim() !== "") {
                appState.studentName = nameInput.value.trim();
            }
            saveStudentProfile(false);

            // Hide onboarding modal
            const obModal = document.getElementById('onboarding-modal');
            if (obModal) {
                obModal.classList.add('opacity-0');
                setTimeout(() => obModal.classList.add('hidden'), 300);
            }

            // Hide landing screen
            const welcome = document.getElementById('welcome-screen');
            if (welcome) {
                welcome.classList.add('opacity-0');
                setTimeout(() => welcome.classList.add('hidden'), 500);
            }
        }

        function startGameExperience() {
            playSfx('click');
            openOnboardingModal();
        }

        function returnToLanding() {
            playSfx('click');
            const welcome = document.getElementById('welcome-screen');
            if (welcome) {
                welcome.classList.remove('hidden');
                setTimeout(() => welcome.classList.remove('opacity-0'), 10);
            }
        }

        function openAvatarStudioScreen() {
            playSfx('click');
            const modal = document.getElementById('avatar-studio-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function closeAvatarStudioScreen() {
            playSfx('click');
            const modal = document.getElementById('avatar-studio-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        function switchStudioTab(tab) {
            playSfx('click');
            ['hair', 'face', 'style', 'clothes'].forEach(t => {
                const el = document.getElementById(`tab-content-${t}`);
                const btn = document.getElementById(`tab-btn-${t}`);
                if (el) el.classList.add('hidden');
                if (btn) btn.className = 'px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
            });
            const targetEl = document.getElementById(`tab-content-${tab}`);
            const targetBtn = document.getElementById(`tab-btn-${tab}`);
            if (targetEl) targetEl.classList.remove('hidden');
            if (targetBtn) targetBtn.className = 'px-3 py-2 rounded-xl bg-amber-400 text-amber-950 shadow-md';
        }

        function selectHairStyle(style) {
            playSfx('click');
            appState.hairStyle = style;
            refreshAvatars();
        }

        function selectHairColor(color) {
            playSfx('click');
            appState.hairColor = color;
            refreshAvatars();
        }

        function selectSkinTone(tone) {
            playSfx('click');
            appState.skinTone = tone;
            refreshAvatars();
        }

        function setStudioPose(pose) {
            playSfx('click');
            appState.expression = pose;
            refreshAvatars();
        }

        function selectEyewear(item) {
            playSfx('click');
            appState.eyewear = item;
            refreshAvatars();
        }

        function selectHeadwear(item) {
            playSfx('click');
            appState.headwear = item;
            refreshAvatars();
        }

        function selectClothingColor(col) {
            playSfx('click');
            appState.clothingColor = col;
            refreshAvatars();
        }

        function setStudentGrade(grade) {
            playSfx('click');
            appState.studentGrade = grade;
            
            // Highlight selected grade button and unhighlight others
            const buttons = document.querySelectorAll('.grade-btn');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-grade') === grade) {
                    btn.className = 'grade-btn flex-1 py-1.5 rounded-lg text-[10px] font-black border border-amber-400 bg-amber-400 text-amber-950 shadow-md transition-all scale-105';
                } else {
                    btn.className = 'grade-btn flex-1 py-1.5 rounded-lg text-[10px] font-black border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all';
                }
            });

            saveStudentProfile(false);
        }

        function randomizeAvatarVisual() {
            playSfx('click');
            const hairs = ['braids', 'afro', 'dreads', 'fade', 'curls', 'bun'];
            const hairCols = ['#1c1917', '#451a03', '#b45309', '#7f1d1d'];
            const skins = ['bronze', 'ebony', 'warm', 'chestnut', 'caramel'];
            const exprs = ['happy', 'confident', 'focused', 'cool'];
            const eyeWears = ['none', 'classic', 'round', 'shades'];
            const headWears = ['none', 'headphones', 'earrings', 'cap'];

            const rand = arr => arr[Math.floor(Math.random() * arr.length)];

            appState.hairStyle = rand(hairs);
            appState.hairColor = rand(hairCols);
            appState.skinTone = rand(skins);
            appState.expression = rand(exprs);
            appState.eyewear = rand(eyeWears);
            appState.headwear = rand(headWears);

            refreshAvatars();
        }

        function saveStudentProfile(close = true) {
            const input = document.getElementById('studio-student-name');
            if (input) {
                appState.studentName = input.value || "Alex";
            }

            const hName = document.getElementById('header-student-name');
            const hGrade = document.getElementById('header-student-grade');
            const pName = document.getElementById('passport-name');
            const pGrade = document.getElementById('passport-grade');

            if (hName) hName.textContent = appState.studentName;
            if (hGrade) hGrade.textContent = appState.studentGrade;
            if (pName) pName.textContent = appState.studentName;
            if (pGrade) pGrade.textContent = `Estudiante de ${appState.studentGrade}`;

            refreshAvatars();

            if (close) {
                playSfx('success');
                closeAvatarStudioScreen();
            }
        }

        // Helper to shuffle options array dynamically so answers are never always 'A'
        function shuffleArray(array) {
            const cloned = [...array];
            for (let i = cloned.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
            }
            return cloned;
        }

        function renderStationModalHTML(stationId) {
            const currentStep = appState.stationStepProgress[stationId] || 1;
            const qList = stationQuestions[stationId];
            const qData = qList[currentStep - 1];

            // Dynamically shuffle options for display
            const shuffledOptions = shuffleArray(qData.options);
            const letterLabels = ['A', 'B', 'C', 'D'];

            const progressStepsHTML = qList.map((st, idx) => {
                const stepNum = idx + 1;
                let stepStyle = "bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700";
                
                if (stepNum < currentStep) {
                    stepStyle = "bg-emerald-500 text-white border-emerald-400 font-black shadow-md";
                } else if (stepNum === currentStep) {
                    stepStyle = "bg-amber-400 text-amber-950 border-amber-300 font-black shadow-lg scale-105 ring-2 ring-amber-400/50";
                }

                return `
                    <div class="flex-1 min-w-[70px] p-2 rounded-xl text-center border text-[10px] sm:text-xs transition-all ${stepStyle}">
                        <div class="font-black">${stepNum < currentStep ? '✓' : stepNum}</div>
                        <div class="truncate text-[9px] font-bold hidden sm:block">${st.type.split('. ')[1]}</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 rounded-2xl ${appState.badges[stationId].color} flex flex-col items-center justify-center font-black shadow-md">
                            <i class="fa-solid ${appState.badges[stationId].icon} text-lg"></i>
                            <i class="fa-solid fa-book-open text-[10px] opacity-90 -mt-0.5"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900 dark:text-white">Estación ${stationId}: ${appState.badges[stationId].title}</h3>
                            <p class="text-xs text-amber-600 dark:text-amber-400 font-extrabold">Debes completar los 5 tipos de juegos para obtener el distintivo con libro base</p>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <div class="flex justify-between items-center text-xs font-black text-slate-700 dark:text-slate-300">
                            <span>Progreso de la Estación:</span>
                            <span class="text-amber-600 dark:text-amber-400 font-extrabold">Misión ${currentStep} de 5</span>
                        </div>
                        <div class="flex space-x-1.5 pt-1">
                            ${progressStepsHTML}
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-4">
                        <div class="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/40 text-xs font-black">
                            <i class="fa-solid ${qData.icon} mr-1.5"></i>
                            <span>Tipo de Juego ${currentStep}/5: ${qData.type}</span>
                        </div>

                        <p class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
                            ${qData.question}
                        </p>

                        <div class="space-y-2 pt-1">
                            ${shuffledOptions.map((opt, idx) => `
                                <button onclick="handleStepChoice(${stationId}, ${currentStep}, ${opt.correct})" class="w-full text-left p-3.5 rounded-2xl bg-slate-100 hover:bg-amber-400/15 dark:bg-slate-800/80 dark:hover:bg-amber-400/20 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-400 text-xs font-extrabold text-slate-900 dark:text-white transition-all shadow-sm active:scale-[0.99] flex items-start space-x-2">
                                    <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-amber-950 font-black text-[11px]">${letterLabels[idx]}</span>
                                    <span class="flex-1">${opt.text}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div id="st-feedback" class="hidden"></div>
                </div>
            `;
        }

        function renderStationEvidenceHTML(stationId) {
            const promptData = stationEvidencePrompts[stationId];
            const saved = appState.stationEvidence[stationId] || {};
            const level = saved.level || '';
            const mode = saved.mode || 'individual';
            const reflection = saved.text || '';
            const levelOptions = [
                ['exploring', 'Lo estoy explorando'],
                ['practicing', 'Lo practico con apoyo'],
                ['confident', 'Puedo explicarlo']
            ];
            const modeOptions = [['individual', 'Individual'], ['team', 'En equipo']];
            const creatorFields = stationId === 6 ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label class="block text-[11px] font-black text-slate-700 dark:text-slate-200">Formato
                        <select id="evidence-format" onchange="updateCreatorPreview()" class="mt-1 w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                            <option ${saved.format === 'Carrusel · 3 láminas' ? 'selected' : ''}>Carrusel · 3 láminas</option>
                            <option ${saved.format === 'Guion para audio' ? 'selected' : ''}>Guion para audio</option>
                            <option ${saved.format === 'Historieta breve' ? 'selected' : ''}>Historieta breve</option>
                            <option ${saved.format === 'Publicación simulada' ? 'selected' : ''}>Publicación simulada</option>
                        </select>
                    </label>
                    <label class="block text-[11px] font-black text-slate-700 dark:text-slate-200">¿A quién le habla?
                        <input id="evidence-audience" maxlength="80" oninput="updateCreatorPreview()" value="${escapeHTML(saved.audience || '')}" placeholder="Ej. estudiantes de mi curso" class="mt-1 w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                    </label>
                </div>
                <div class="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-white">
                    <div class="flex items-center justify-between px-4 py-2 border-b border-white/10"><span class="text-[9px] font-black uppercase tracking-widest text-teal-300">Vista previa · no se publicará</span><span class="text-[9px] text-slate-400">FEED / BORRADOR</span></div>
                    <div class="p-4 min-h-24"><p id="creator-preview-format" class="text-[9px] uppercase tracking-wider font-black text-amber-300">${escapeHTML(saved.format || 'Carrusel · 3 láminas')}</p><p id="creator-preview-message" class="mt-2 text-sm font-bold leading-relaxed">${escapeHTML(reflection || 'Tu idea aparecerá aquí mientras la construyes.')}</p><p id="creator-preview-audience" class="mt-3 text-[10px] text-slate-400">${escapeHTML(saved.audience ? `Para ${saved.audience}` : 'Una idea consciente empieza con una audiencia en mente.')}</p></div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                    <p class="text-[10px] text-slate-400">Pieza vertical · se genera en este dispositivo</p>
                    <button onclick="downloadCreatorArtwork()" class="px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-black flex items-center justify-center gap-2"><i class="fa-solid fa-download"></i> Descargar pieza SVG</button>
                </div>
            ` : '';

            return `
                <div class="space-y-5">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-xl ${appState.badges[stationId].color} flex items-center justify-center shadow-sm"><i class="fa-solid ${appState.badges[stationId].icon} text-xl"></i></div>
                            <div><p class="text-[9px] uppercase tracking-widest font-black text-teal-700 dark:text-teal-300">Bitácora · estación ${stationId} de 6</p><h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${promptData.label}</h3></div>
                        </div>
                        <button onclick="openStationModal(${stationId})" class="shrink-0 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-200"><i class="fa-solid fa-arrow-left mr-1"></i><span class="hidden sm:inline">Retos</span></button>
                    </div>

                    <div class="p-4 rounded-xl field-note border border-teal-200 dark:border-teal-900"><p class="text-[9px] uppercase tracking-widest font-black text-teal-800 dark:text-teal-300">Tu desafío de pensamiento</p><p class="mt-2 text-sm font-bold leading-relaxed text-slate-900 dark:text-white">${promptData.prompt}</p></div>

                    <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-4">
                        <fieldset><legend class="text-[10px] uppercase tracking-wider font-black text-slate-500 dark:text-slate-400 mb-2">Modalidad de trabajo</legend><div class="grid grid-cols-2 gap-2">${modeOptions.map(([value, label]) => `<label class="evidence-level cursor-pointer"><input class="sr-only" type="radio" name="evidence-mode" value="${value}" onchange="updateEvidenceMode()" ${mode === value ? 'checked' : ''}><span class="block p-2.5 text-center text-[11px] font-black rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">${label}</span></label>`).join('')}</div></fieldset>
                        <fieldset><legend class="text-[10px] uppercase tracking-wider font-black text-slate-500 dark:text-slate-400 mb-2">Autoevaluación · ${promptData.criterion}</legend><div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5">${levelOptions.map(([value, label]) => `<label class="evidence-level cursor-pointer"><input class="sr-only" type="radio" name="evidence-level" value="${value}" ${level === value ? 'checked' : ''}><span class="flex h-full items-center justify-center p-2 text-center text-[9px] leading-tight font-black rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">${label}</span></label>`).join('')}</div></fieldset>
                    </div>

                    <div id="team-facilitation" class="hidden p-4 rounded-xl bg-slate-900 text-white border border-slate-700">
                        <div class="flex items-center justify-between gap-3"><p class="text-[10px] uppercase tracking-widest font-black text-amber-300">Ronda de diálogo · 3 minutos</p><i class="fa-solid fa-people-group text-teal-300"></i></div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-[10px] leading-relaxed">
                            <p><strong class="text-teal-300">01 · Escuchar</strong><br>Una persona lee el caso sin juzgar las respuestas.</p>
                            <p><strong class="text-teal-300">02 · Contrastar</strong><br>Cada quien aporta una razón o una pregunta; busquen una diferencia útil.</p>
                            <p><strong class="text-teal-300">03 · Sintetizar</strong><br>Registren una conclusión común, sin nombres ni datos personales.</p>
                        </div>
                    </div>

                    <div class="evidence-paper rounded-xl border border-slate-300 dark:border-slate-700 p-4 sm:p-5">
                        <label for="station-evidence-text" class="block text-[10px] uppercase tracking-wider font-black text-slate-600 dark:text-slate-300 mb-2">Huella de aprendizaje <span class="normal-case tracking-normal font-bold text-slate-500">· máximo 600 caracteres</span></label>
                        <textarea id="station-evidence-text" maxlength="600" rows="4" oninput="updateEvidenceCounter()${stationId === 6 ? '; updateCreatorPreview()' : ''}" placeholder="${promptData.placeholder}" class="w-full resize-y min-h-28 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 p-3 text-sm leading-relaxed text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500">${escapeHTML(reflection)}</textarea>
                        <div class="mt-2 flex justify-between gap-3"><p class="text-[10px] text-slate-500 dark:text-slate-400">Usa un caso ficticio si prefieres no hablar de tu experiencia.</p><span id="evidence-character-count" class="shrink-0 text-[10px] font-bold text-slate-500">${reflection.length} / 600</span></div>
                    </div>

                    ${creatorFields}
                    <p id="evidence-validation-message" role="alert" class="hidden text-xs font-bold text-rose-700 dark:text-rose-300"></p>
                    <div class="flex flex-col sm:flex-row gap-2 pt-1">
                        <button onclick="saveStationEvidence(${stationId})" class="flex-1 px-4 py-3.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-black flex items-center justify-center gap-2"><i class="fa-solid fa-floppy-disk"></i> Guardar evidencia y cerrar</button>
                        <button onclick="completeStation(${stationId})" class="px-4 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black">Continuar sin guardar evidencia</button>
                    </div>
                    <p class="text-[10px] text-center text-slate-500 dark:text-slate-400">${appState.localSaveEnabled ? 'El progreso está guardado en este dispositivo.' : 'Esta nota solo permanece abierta en esta pestaña. Activa el guardado local desde Bitácora para conservarla.'}</p>
                </div>
            `;
        }

        function openStationEvidenceForm(stationId) {
            if (!stationEvidencePrompts[stationId]) return;
            appState.currentStationId = stationId;
            const modal = document.getElementById('station-modal');
            const content = document.getElementById('modal-content');
            if (content) content.innerHTML = renderStationEvidenceHTML(stationId);
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
            updateCreatorPreview();
            updateEvidenceMode();
        }

        function updateEvidenceMode() {
            const mode = document.querySelector('input[name="evidence-mode"]:checked')?.value;
            document.getElementById('team-facilitation')?.classList.toggle('hidden', mode !== 'team');
        }

        function updateEvidenceCounter() {
            const input = document.getElementById('station-evidence-text');
            const counter = document.getElementById('evidence-character-count');
            if (input && counter) counter.textContent = `${input.value.length} / 600`;
        }

        function updateCreatorPreview() {
            const text = document.getElementById('station-evidence-text');
            const format = document.getElementById('evidence-format');
            const audience = document.getElementById('evidence-audience');
            const previewText = document.getElementById('creator-preview-message');
            const previewFormat = document.getElementById('creator-preview-format');
            const previewAudience = document.getElementById('creator-preview-audience');
            if (previewText) previewText.textContent = text?.value.trim() || 'Tu idea aparecerá aquí mientras la construyes.';
            if (previewFormat) previewFormat.textContent = format?.value || 'Carrusel · 3 láminas';
            if (previewAudience) previewAudience.textContent = audience?.value.trim() ? `Para ${audience.value.trim()}` : 'Una idea consciente empieza con una audiencia en mente.';
        }

        function wrapArtworkText(text, maxCharacters = 38, maxLines = 18) {
            const words = text.trim().split(/\s+/).filter(Boolean);
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                if (word.length > maxCharacters) {
                    if (currentLine) lines.push(currentLine);
                    currentLine = '';
                    for (let index = 0; index < word.length; index += maxCharacters) {
                        lines.push(word.slice(index, index + maxCharacters));
                    }
                    return;
                }

                const candidate = currentLine ? `${currentLine} ${word}` : word;
                if (candidate.length > maxCharacters) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = candidate;
                }
            });

            if (currentLine) lines.push(currentLine);
            if (lines.length > maxLines) {
                lines.length = maxLines;
                lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, maxCharacters - 1)}…`;
            }
            return lines;
        }

        function downloadCreatorArtwork() {
            const textInput = document.getElementById('station-evidence-text');
            const validation = document.getElementById('evidence-validation-message');
            const message = textInput?.value.trim();
            if (!message) {
                if (validation) {
                    validation.textContent = 'Escribe el mensaje principal antes de descargar la pieza.';
                    validation.classList.remove('hidden');
                }
                textInput?.focus();
                return;
            }

            const format = document.getElementById('evidence-format')?.value || 'Publicación simulada';
            const audience = document.getElementById('evidence-audience')?.value.trim() || 'Una conversación para abrir';
            const textLines = wrapArtworkText(message).map((line, index) =>
                `<tspan x="112" dy="${index === 0 ? 0 : 52}">${escapeXML(line)}</tspan>`
            ).join('');
            const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" role="img" aria-labelledby="art-title art-description">
    <title id="art-title">Una mirada consciente · Mi vida, mi feed</title>
    <desc id="art-description">Pieza educativa creada para ampliar la conversación sobre el éxito. No está publicada en redes.</desc>
    <rect width="1080" height="1920" fill="#10231f"/>
    <path d="M0 0h1080v18H0zM0 1902h1080v18H0z" fill="#5eead4"/>
    <path d="M812 0h268v520H940z" fill="#183a32"/>
    <path d="M0 1450h1080v452H0z" fill="#f1eddf"/>
    <path d="M78 92h8v92h-8z" fill="#f4c95d"/>
    <text x="112" y="126" fill="#d1fae5" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="3">MI VIDA, MI FEED</text>
    <text x="112" y="246" fill="#f4c95d" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4">CREACIÓN CONSCIENTE · ${escapeXML(format.toUpperCase())}</text>
    <text x="104" y="394" fill="#f8fafc" font-family="Georgia, serif" font-size="78" font-weight="700">El éxito tiene</text>
    <text x="104" y="488" fill="#5eead4" font-family="Georgia, serif" font-size="78" font-weight="700">más de una forma.</text>
    <path d="M104 548h872" stroke="#3a5b50" stroke-width="2"/>
    <text x="112" y="620" fill="#b7c9c1" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">UNA IDEA PARA PENSAR</text>
    <text x="112" y="704" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="600" line-height="1.25">${textLines}</text>
    <path d="M104 1450h872" stroke="#b5b1a4" stroke-width="2"/>
    <text x="112" y="1542" fill="#31584d" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">PARA CONVERSAR CON</text>
    <text x="112" y="1610" fill="#10231f" font-family="Arial, sans-serif" font-size="32" font-weight="700">${escapeXML(audience)}</text>
    <text x="112" y="1748" fill="#31584d" font-family="Arial, sans-serif" font-size="20" font-weight="600">I.E. Francisco José de Caldas · Buenaventura</text>
    <text x="112" y="1810" fill="#60766c" font-family="Arial, sans-serif" font-size="16">Borrador educativo · No publicado en redes sociales</text>
</svg>`;
            const artworkUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
            const downloadLink = document.createElement('a');
            downloadLink.href = artworkUrl;
            downloadLink.download = 'mi-vida-mi-feed-pieza-creativa.svg';
            downloadLink.click();
            setTimeout(() => URL.revokeObjectURL(artworkUrl), 1000);
        }

        function saveStationEvidence(stationId) {
            const text = (document.getElementById('station-evidence-text')?.value || '').trim().slice(0, 600);
            const validation = document.getElementById('evidence-validation-message');
            if (!text) {
                if (validation) {
                    validation.textContent = 'Escribe una idea breve para guardar esta evidencia. Puedes responder desde un caso ficticio.';
                    validation.classList.remove('hidden');
                }
                document.getElementById('station-evidence-text')?.focus();
                return;
            }

            const mode = document.querySelector('input[name="evidence-mode"]:checked')?.value || 'individual';
            const level = document.querySelector('input[name="evidence-level"]:checked')?.value;
            if (!level) {
                if (validation) {
                    validation.textContent = 'Marca cómo te sientes frente al criterio para completar la autoevaluación.';
                    validation.classList.remove('hidden');
                }
                document.querySelector('input[name="evidence-level"]')?.focus();
                return;
            }
            appState.stationEvidence[stationId] = {
                text,
                mode,
                level,
                format: document.getElementById('evidence-format')?.value || '',
                audience: document.getElementById('evidence-audience')?.value.trim() || '',
                updatedAt: new Date().toISOString()
            };
            persistProgress();
            completeStation(stationId);
        }

        function handleStepChoice(stationId, stepNum, isCorrect) {
            const fb = document.getElementById('st-feedback');
            if (!fb) return;
            fb.classList.remove('hidden');

            if (isCorrect) {
                playSfx('success');
                const qData = stationQuestions[stationId][stepNum - 1];

                if (stepNum < 5) {
                    fb.className = 'p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-200 text-xs font-black space-y-3 shadow-lg';
                    fb.innerHTML = `
                        <p class="text-xs font-black text-emerald-800 dark:text-emerald-300"><i class="fa-solid fa-circle-check text-base mr-1"></i> ${qData.explanation}</p>
                        <button onclick="advanceStationStep(${stationId}, ${stepNum + 1})" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-xl uppercase tracking-wider flex items-center justify-center space-x-2">
                            <span>Siguiente Juego (${stepNum + 1}/5)</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    `;
                } else {
                    fb.className = 'p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 text-xs font-black space-y-3 shadow-2xl border-2 border-amber-300';
                    fb.innerHTML = `
                        <p class="text-sm font-black uppercase text-center"><i class="fa-solid fa-trophy text-2xl block mb-1"></i> ¡FELICITACIONES! Has superado los 5 tipos de juego de esta estación.</p>
                        <button onclick="openStationEvidenceForm(${stationId})" class="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs shadow-2xl uppercase tracking-wider border border-amber-400 flex items-center justify-center space-x-2">
                            <i class="fa-solid fa-award"></i>
                            <span>Reflexionar y dejar una evidencia</span>
                        </button>
                    `;
                }
            } else {
                playSfx('click');
                fb.className = 'p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-950 dark:text-rose-200 text-xs font-black shadow-lg';
                fb.innerHTML = `
                    <p><i class="fa-solid fa-circle-xmark text-base mr-1"></i> Respuesta incorrecta. Vuelve a analizar el caso y elige la opción con mayor sustento crítico y evidencia.</p>
                `;
            }
        }

        function advanceStationStep(stationId, nextStep) {
            playSfx('click');
            appState.stationStepProgress[stationId] = nextStep;
            persistProgress();
            updateLearningDashboard();
            openStationModal(stationId);
        }

        function openStationModal(id) {
            const modal = document.getElementById('station-modal');
            const content = document.getElementById('modal-content');

            if (!appState.stationStepProgress[id]) {
                appState.stationStepProgress[id] = 1;
            }

            if (content) content.innerHTML = renderStationModalHTML(id);

            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function closeStationModal() {
            playSfx('click');
            const modal = document.getElementById('station-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        function completeStation(id) {
            playSfx('success');
            if (!appState.completedStations.includes(id)) {
                appState.completedStations.push(id);
                const check = document.getElementById(`badge-check-${id}`);
                if (check) check.classList.remove('hidden');
            }
            updateLockedStationsUI();
            persistProgress();
            updateLearningDashboard();
            closeStationModal();
            openPassportModal();
        }

        function escapeHTML(value) {
            return String(value).replace(/[&<>"']/g, character => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[character]);
        }

        function updateLearningDashboard() {
            const completedCount = appState.completedStations.length;
            const evidenceCount = Object.values(appState.stationEvidence).filter(entry => entry?.text?.trim()).length;
            const percentage = Math.round((completedCount / 6) * 100);
            const progressCount = document.getElementById('learning-progress-count');
            const evidenceCountLabel = document.getElementById('learning-evidence-count');
            const percentLabel = document.getElementById('learning-progress-percent');
            const progressFill = document.getElementById('learning-progress-fill');
            if (progressCount) progressCount.textContent = `${completedCount} de 6`;
            if (evidenceCountLabel) evidenceCountLabel.textContent = `${evidenceCount} registradas`;
            if (percentLabel) percentLabel.textContent = `${percentage}%`;
            if (progressFill) progressFill.style.width = `${percentage}%`;

            const journalCompleted = document.getElementById('journal-completed-count');
            const journalEvidence = document.getElementById('journal-evidence-count');
            const journalReflection = document.getElementById('journal-reflection-count');
            const journalStorage = document.getElementById('journal-storage-status');
            const storageButton = document.getElementById('journal-storage-toggle');
            if (journalCompleted) journalCompleted.textContent = `${completedCount} / 6`;
            if (journalEvidence) journalEvidence.textContent = `${evidenceCount} / 6`;
            if (journalReflection) journalReflection.textContent = `${Object.values(appState.stationEvidence).filter(entry => entry?.level).length} / 6`;
            if (journalStorage) journalStorage.textContent = appState.localSaveEnabled ? 'Guardado local activo' : 'Solo en esta pestaña';
            if (storageButton) storageButton.textContent = appState.localSaveEnabled ? 'Desactivar y borrar copia local' : 'Activar guardado local';
        }

        function renderLearningJournal() {
            const list = document.getElementById('journal-station-list');
            if (!list) return;
            const levelLabels = { exploring: 'Lo estoy explorando', practicing: 'Lo practico con apoyo', confident: 'Puedo explicarlo' };
            list.innerHTML = Object.keys(appState.badges).map(id => {
                const stationId = Number(id);
                const badge = appState.badges[id];
                const evidence = appState.stationEvidence[stationId];
                const completed = appState.completedStations.includes(stationId);
                const promptData = stationEvidencePrompts[stationId];
                const actionLabel = completed || evidence ? 'Revisar evidencia' : 'Abrir estación';
                const evidenceBlock = evidence?.text ? `
                    <details class="mt-3 text-xs">
                        <summary class="cursor-pointer font-black text-teal-800 dark:text-teal-300">Leer nota · ${evidence.text.length} caracteres</summary>
                        <p class="mt-2 whitespace-pre-wrap rounded-lg evidence-paper border border-slate-200 dark:border-slate-700 p-3 text-slate-800 dark:text-slate-200">${escapeHTML(evidence.text)}</p>
                        <p class="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">${escapeHTML(evidence.mode === 'team' ? 'Trabajo en equipo' : 'Trabajo individual')} · ${escapeHTML(levelLabels[evidence.level] || 'Autoevaluación pendiente')}${evidence.format ? ` · ${escapeHTML(evidence.format)}` : ''}</p>
                    </details>` : '<p class="mt-2 text-[10px] text-slate-500 dark:text-slate-400">Aún no hay una evidencia escrita. Puedes usar un caso ficticio.</p>';
                return `
                    <article class="py-4 sm:py-5 grid grid-cols-[2.25rem_1fr] sm:grid-cols-[2.25rem_1fr_auto] gap-3 sm:gap-4 items-start">
                        <div class="w-9 h-9 rounded-lg ${completed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'} flex items-center justify-center text-xs font-black">0${stationId}</div>
                        <div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h5 class="text-sm font-black">${escapeHTML(badge.title)}</h5><span class="text-[9px] uppercase tracking-wider font-black ${completed ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}">${completed ? 'Reto completado' : 'Por explorar'}</span></div><p class="mt-1 text-[11px] text-slate-600 dark:text-slate-400">${escapeHTML(promptData.criterion)}</p>${evidenceBlock}</div>
                        <button onclick="openJournalStation(${stationId})" class="col-start-2 sm:col-start-auto justify-self-start sm:justify-self-end mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-[10px] font-black text-slate-700 dark:text-slate-200">${actionLabel}</button>
                    </article>`;
            }).join('');
            updateLearningDashboard();
        }

        function openLearningJournal() {
            renderLearningJournal();
            const modal = document.getElementById('learning-journal-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function closeLearningJournal() {
            const modal = document.getElementById('learning-journal-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        function openJournalStation(stationId) {
            closeLearningJournal();
            if (appState.completedStations.includes(stationId) || appState.stationEvidence[stationId]) {
                openStationEvidenceForm(stationId);
            } else {
                selectStation(stationId);
            }
        }

        function persistProgress() {
            if (!appState.localSaveEnabled) return false;
            const payload = {
                version: 1,
                stationStepProgress: appState.stationStepProgress,
                completedStations: appState.completedStations,
                stationEvidence: appState.stationEvidence
            };
            try {
                localStorage.setItem(progressStorageKey, JSON.stringify(payload));
                const message = document.getElementById('journal-storage-message');
                if (message) message.classList.add('hidden');
                return true;
            } catch (error) {
                appState.localSaveEnabled = false;
                const message = document.getElementById('journal-storage-message');
                if (message) {
                    message.textContent = 'El navegador no permitió guardar estos datos. Puedes exportar la bitácora como archivo.';
                    message.classList.remove('hidden');
                }
                updateLearningDashboard();
                return false;
            }
        }

        function restoreProgressFromDevice() {
            try {
                const serialized = localStorage.getItem(progressStorageKey);
                if (!serialized) return;
                const saved = JSON.parse(serialized);
                if (saved.version !== 1) return;
                const validIds = Object.keys(appState.badges).map(Number);
                appState.completedStations = Array.isArray(saved.completedStations)
                    ? [...new Set(saved.completedStations.map(Number).filter(id => validIds.includes(id)))]
                    : [];
                if (saved.stationStepProgress && typeof saved.stationStepProgress === 'object') {
                    validIds.forEach(id => {
                        const step = Number(saved.stationStepProgress[id]);
                        appState.stationStepProgress[id] = Number.isInteger(step) ? Math.min(5, Math.max(1, step)) : 1;
                    });
                }
                if (saved.stationEvidence && typeof saved.stationEvidence === 'object') {
                    appState.stationEvidence = Object.fromEntries(Object.entries(saved.stationEvidence)
                        .filter(([id, entry]) => validIds.includes(Number(id)) && entry && typeof entry.text === 'string')
                        .map(([id, entry]) => [Number(id), {
                            text: entry.text.slice(0, 600),
                            mode: entry.mode === 'team' ? 'team' : 'individual',
                            level: ['exploring', 'practicing', 'confident'].includes(entry.level) ? entry.level : 'exploring',
                            format: typeof entry.format === 'string' ? entry.format.slice(0, 80) : '',
                            audience: typeof entry.audience === 'string' ? entry.audience.slice(0, 80) : '',
                            updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : ''
                        }]));
                }
                appState.localSaveEnabled = true;
            } catch (error) {
                appState.localSaveEnabled = false;
            }
        }

        function toggleLocalProgressStorage() {
            if (appState.localSaveEnabled) {
                if (!confirm('¿Desactivar el guardado y borrar la copia local de la bitácora?')) return;
                try {
                    localStorage.removeItem(progressStorageKey);
                    appState.localSaveEnabled = false;
                    const message = document.getElementById('journal-storage-message');
                    if (message) message.classList.add('hidden');
                } catch (error) {
                    const message = document.getElementById('journal-storage-message');
                    if (message) {
                        message.textContent = 'No fue posible borrar la copia local desde este navegador.';
                        message.classList.remove('hidden');
                    }
                }
            } else {
                appState.localSaveEnabled = true;
                persistProgress();
            }
            updateLearningDashboard();
        }

        function clearLearningProgress() {
            if (!confirm('Se borrarán las insignias, el avance y las evidencias de este dispositivo. Esta acción no se puede deshacer. ¿Continuar?')) return;
            try {
                localStorage.removeItem(progressStorageKey);
            } catch (error) {
                const message = document.getElementById('journal-storage-message');
                if (message) {
                    message.textContent = 'No fue posible borrar la copia del navegador. Revisa la configuración de almacenamiento del sitio.';
                    message.classList.remove('hidden');
                }
            }
            appState.stationStepProgress = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 };
            appState.completedStations = [];
            appState.stationEvidence = {};
            appState.localSaveEnabled = false;
            Object.keys(appState.badges).forEach(id => document.getElementById(`badge-check-${id}`)?.classList.add('hidden'));
            updateLockedStationsUI();
            renderLearningJournal();
        }

        function downloadLearningJournal() {
            const levelLabels = { exploring: 'Lo estoy explorando', practicing: 'Lo practico con apoyo', confident: 'Puedo explicarlo' };
            const lines = [
                '# Bitácora de campo · Mi vida, mi feed',
                `Fecha de exportación: ${new Date().toLocaleDateString('es-CO')}`,
                'Registro local de aprendizaje. No incluye nombre, grado ni diagnóstico.',
                ''
            ];
            Object.keys(appState.badges).forEach(id => {
                const stationId = Number(id);
                const evidence = appState.stationEvidence[stationId];
                lines.push(`## Estación ${stationId}: ${appState.badges[id].title}`);
                lines.push(`Estado: ${appState.completedStations.includes(stationId) ? 'reto completado' : 'en exploración'}`);
                if (evidence) {
                    lines.push(`Modalidad: ${evidence.mode === 'team' ? 'equipo' : 'individual'}`);
                    lines.push(`Autoevaluación: ${levelLabels[evidence.level] || 'sin registrar'}`);
                    if (evidence.format) lines.push(`Formato creativo: ${evidence.format}`);
                    if (evidence.audience) lines.push(`Audiencia: ${evidence.audience}`);
                    lines.push('', evidence.text, '');
                } else {
                    lines.push('Evidencia escrita: pendiente', '');
                }
            });
            const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'bitacora-mi-vida-mi-feed.md';
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        // Diagnostic & Guidance Modals
        function openDiagnosticModal() {
            playSfx('click');
            const modal = document.getElementById('diagnostic-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function closeDiagnosticModal() {
            playSfx('click');
            const modal = document.getElementById('diagnostic-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        function saveDiagnostic() {
            playSfx('success');
            appState.diagnosticData = {
                q1: document.getElementById('diag-q1')?.value,
                q2: document.getElementById('diag-q2')?.value,
                q3: document.getElementById('diag-q3')?.value
            };
            closeDiagnosticModal();
            startGameExperience();
        }

        function openGuideModal() {
            playSfx('click');
            const modal = document.getElementById('guide-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function closeGuideModal() {
            playSfx('click');
            const modal = document.getElementById('guide-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        function openPassportModal() {
            playSfx('click');
            const modal = document.getElementById('passport-modal');
            const grid = document.getElementById('passport-badges-grid');
            const certBanner = document.getElementById('final-cert-banner');

            if (grid) {
                grid.innerHTML = Object.keys(appState.badges).map(id => {
                    const b = appState.badges[id];
                    const isEarned = appState.completedStations.includes(parseInt(id));
                    return `
                        <div class="p-3 rounded-2xl border-2 ${isEarned ? 'border-amber-400 bg-amber-400/25 dark:bg-amber-400/20' : 'border-slate-300 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 opacity-60'} text-center flex flex-col items-center shadow-md">
                            <div class="w-12 h-12 rounded-2xl ${b.color} flex flex-col items-center justify-center font-black mb-1.5 shadow-md">
                                <i class="fa-solid ${b.icon} text-lg"></i>
                                <i class="fa-solid fa-book-open text-[10px] opacity-90 -mt-0.5"></i>
                            </div>
                            <span class="text-xs font-black text-slate-900 dark:text-white leading-tight">${b.title}</span>
                            <span class="text-[9px] ${isEarned ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-slate-400 font-bold'} mt-1">
                                ${isEarned ? '✓ Demostrado' : 'Pendiente'}
                            </span>
                        </div>
                    `;
                }).join('');
            }

            if (certBanner) {
                if (appState.completedStations.length === 6) {
                    certBanner.classList.remove('hidden');
                } else {
                    certBanner.classList.add('hidden');
                }
            }

            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        }

        function closePassportModal() {
            playSfx('click');
            const modal = document.getElementById('passport-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        // REAL PDF GENERATION FUNCTION USING HTML2PDF
        function downloadPDFCertificate() {
            playSfx('success');
            
            // Populate Certificate Template Data
            const certName = document.getElementById('pdf-student-name');
            const certGrade = document.getElementById('pdf-student-grade');
            const certBadges = document.getElementById('pdf-badges-list');

            if (certName) certName.textContent = appState.studentName.toUpperCase();
            if (certGrade) certGrade.textContent = `Estudiante de ${appState.studentGrade}`;

            if (certBadges) {
                certBadges.innerHTML = Object.keys(appState.badges).map(id => {
                    const b = appState.badges[id];
                    return `
                        <div class="px-2 py-1 rounded-lg bg-amber-100 border border-amber-300 flex items-center space-x-1">
                            <i class="fa-solid ${b.icon} text-amber-700"></i>
                            <i class="fa-solid fa-book-open text-[8px] text-amber-900"></i>
                            <span>${b.title}</span>
                        </div>
                    `;
                }).join('');
            }

            const certElement = document.getElementById('pdf-cert-template');
            
            // Temporarily move into view for snapshot
            certElement.style.position = 'static';
            certElement.style.left = '0';
            certElement.style.top = '0';

            const opt = {
                margin:       0.2,
                filename:     `Reconocimiento_MiVidaMiFeed_${appState.studentName.replace(/\s+/g, '_')}_Caldas.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            html2pdf().set(opt).from(certElement).save().then(() => {
                // Restore hidden absolute positioning
                certElement.style.position = 'absolute';
                certElement.style.left = '-9999px';
                certElement.style.top = '-9999px';
            });
        }

        // Keyboard listener
        window.addEventListener('keydown', (e) => {
            if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
            if (document.getElementById('learning-journal-modal')?.classList.contains('hidden') === false) return;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') moveAvatarDirection('up');
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') moveAvatarDirection('down');
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveAvatarDirection('left');
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveAvatarDirection('right');
            if (e.key === 'Enter') {
                if (appState.currentStationId) {
                    openStationModal(appState.currentStationId);
                }
            }
        });

        // Initialize avatars on page load
        window.onload = function() {
            restoreProgressFromDevice();
            refreshAvatars();
            updateLockedStationsUI();
            updateLearningDashboard();
        };
