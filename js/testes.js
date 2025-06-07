// --- Testes de Nivelamento ---
const testAreaSection = document.getElementById('test-area');
const testQuestionScreen = document.getElementById('test-question-screen');
const testResultScreen = document.getElementById('test-result-screen');

const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('options-container');
const nextQuestionButton = document.getElementById('next-question-button');
const restartTestButton = document.getElementById('restart-test-button');

const currentQuestionNumberEl = document.getElementById('current-question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const progressBarEl = document.getElementById('progress-bar');

const scoreEl = document.getElementById('score');
const totalQuestionsResultEl = document.getElementById('total-questions-result');
const levelMessageEl = document.getElementById('level-message');
const levelDescriptionEl = document.getElementById('level-description');
const resultLanguageNameEl = document.getElementById('result-language-name');

const testTitleEl = document.getElementById('test-title');
const testSubtitleEl = document.getElementById('test-subtitle');

const languageTestButtons = document.querySelectorAll('.language-test-button');
const startLevelTestHeroButton = document.getElementById('start-level-test-hero-button');
const initTestLinks = document.querySelectorAll('.init-test-link');


// Banco de Perguntas
const allQuestions = {
    english: [
        { question: "I _____ a student.", options: ["is", "am", "are", "be"], answer: "am" },
        { question: "What is the plural of 'child'?", options: ["childs", "childrens", "children", "childes"], answer: "children" },
        { question: "She _____ to the park yesterday.", options: ["go", "goes", "went", "gone"], answer: "went" },
        { question: "This is _____ apple.", options: ["a", "an", "the", "some"], answer: "an" },
        { question: "They _____ watching TV now.", options: ["is", "am", "are", "be"], answer: "are" },
        { question: "My favorite color is _____, like the sky.", options: ["red", "green", "blue", "yellow"], answer: "blue" },
        { question: "How _____ brothers do you have?", options: ["much", "many", "more", "lot"], answer: "many" },
        { question: "He _____ play football very well.", options: ["can", "is", "has", "do"], answer: "can" },
        { question: "The book is _____ the table.", options: ["in", "at", "on", "under"], answer: "on" },
        { question: "What time _____ it?", options: ["is", "are", "do", "does"], answer: "is" }
    ],
    spanish: [
        { question: "Yo _____ estudiante.", options: ["soy", "eres", "es", "somos"], answer: "soy" },
        { question: "¿Cómo te _____?", options: ["llamo", "llamas", "llama", "llaman"], answer: "llamas" },
        { question: "Nosotros _____ (vivir) en una casa grande.", options: ["vivo", "vives", "vive", "vivimos"], answer: "vivimos" },
        { question: "_____ las dos de la tarde.", options: ["Es", "Son", "Está", "Están"], answer: "Son" },
        { question: "El gato _____ (dormir) en el sofá.", options: ["duerme", "duermes", "duerme", "duermen"], answer: "duerme" }, // Corrigido para 'duerme'
        { question: "¿Cuántos años _____ (tener, tú)?", options: ["tengo", "tienes", "tiene", "tenemos"], answer: "tienes" },
        { question: "Me _____ (gustar) la música clásica.", options: ["gusta", "gustan", "gusto", "gustas"], answer: "gusta" },
        { question: "Ellos _____ (ir) al cine mañana.", options: ["voy", "vas", "va", "van"], answer: "van" },
        { question: "La mesa es de _____ (madera).", options: ["madera", "madero", "madre", "madras"], answer: "madera" },
        { question: "No _____ (haber) nadie en la calle.", options: ["hay", "ha", "han", "haya"], answer: "hay" }
    ],
    italian: [
        { question: "Io _____ uno studente.", options: ["sono", "sei", "è", "siamo"], answer: "sono" },
        { question: "Come ti _____?", options: ["chiamo", "chiami", "chiama", "chiamano"], answer: "chiami" },
        { question: "Lui _____ (parlare) molto bene l'italiano.", options: ["parlo", "parli", "parla", "parlano"], answer: "parla" },
        { question: "Noi _____ (andare) al mare domani.", options: ["vado", "vai", "va", "andiamo"], answer: "andiamo" },
        { question: "Questi sono i _____ (libro) di Marco.", options: ["libri", "libro", "libra", "libre"], answer: "libri" },
        { question: "Mi _____ (piacere) la pizza.", options: ["piace", "piacciono", "piaccio", "piaci"], answer: "piace" },
        { question: "Che ore _____?", options: ["è", "sono", "fa", "stanno"], answer: "sono" },
        { question: "Dove _____ (abitare, tu)?", options: ["abito", "abiti", "abita", "abitiamo"], answer: "abiti" },
        { question: "Lei _____ (essere) molto simpatica.", options: ["sono", "sei", "è", "siamo"], answer: "è" },
        { question: "Noi _____ (bere) sempre acqua minerale.", options: ["bevo", "bevi", "beve", "beviamo"], answer: "beviamo" }
    ],
    libras: [
        { question: "Qual é o significado da sigla LIBRAS?", options: ["Língua Brasileira de Sinais", "Linguagem Brasileira para Surdos", "Sinais Brasileiros Linguísticos", "Lógica Brasileira de Sinais"], answer: "Língua Brasileira de Sinais" },
        { question: "A datilologia em Libras é usada principalmente para:", options: ["Nomes próprios e palavras sem sinal específico", "Verbos de ação", "Expressar emoções", "Todos os substantivos"], answer: "Nomes próprios e palavras sem sinal específico" },
        { question: "Qual destes NÃO é um dos 5 parâmetros da Libras?", options: ["Configuração de Mão", "Ponto de Articulação", "Entonação da Voz", "Movimento"], answer: "Entonação da Voz" },
        { question: "A Lei nº 10.436/2002 reconhece a Libras como:", options: ["Língua oficial do Brasil", "Meio legal de comunicação e expressão", "Dialeto regional", "Sistema de escrita"], answer: "Meio legal de comunicação e expressão" },
        { question: "O profissional que atua na tradução/interpretação entre Libras e Português é chamado de:", options: ["Professor de Libras", "Tradutor e Intérprete de Libras", "Guia-Intérprete", "Mediador Surdo"], answer: "Tradutor e Intérprete de Libras" },
        { question: "A expressão facial e corporal em Libras é fundamental para:", options: ["Apenas para dar ênfase", "Transmitir informações gramaticais e afetivas", "Substituir os sinais manuais", "Indicar o nível de formalidade"], answer: "Transmitir informações gramaticais e afetivas" },
        { question: "A ordem básica de uma frase em Libras costuma ser:", options: ["Sujeito-Verbo-Objeto (SVO)", "Objeto-Sujeito-Verbo (OSV)", "Verbo-Sujeito-Objeto (VSO)", "Libras não possui uma ordem rígida"], answer: "Objeto-Sujeito-Verbo (OSV)" },
        { question: "O que significa 'Comunidade Surda'?", options: ["Apenas pessoas que não ouvem nada", "Um grupo de pessoas que compartilham a Libras e uma identidade cultural surda", "Pessoas que usam aparelho auditivo", "Qualquer pessoa com deficiência auditiva"], answer: "Um grupo de pessoas que compartilham a Libras e uma identidade cultural surda" },
        { question: "Qual o sinal em Libras para 'casa' geralmente envolve qual configuração de mão?", options: ["Mão em 'C'", "Mãos em 'A' unidas pelo topo", "Mão em 'S'", "Mão em '5' aberta"], answer: "Mãos em 'A' unidas pelo topo" },
        { question: "A cultura surda valoriza muito:", options: ["A comunicação oral", "A experiência visual e a Libras", "A música alta", "O isolamento social"], answer: "A experiência visual e a Libras" }
    ]
};

let currentLanguageQuestions = [];
let currentLanguageKey = "";
let currentLanguageName = "";
let currentQuestionIndex = 0;
let userScore = 0;
let selectedOption = null;

function initTest(languageKey, languageName) {
    currentLanguageKey = languageKey;
    currentLanguageName = languageName;
    currentLanguageQuestions = allQuestions[languageKey] || [];

    if (currentLanguageQuestions.length === 0) {
        // Idealmente, mostrar uma mensagem ao usuário
        console.error("Nenhuma pergunta encontrada para o idioma:", languageKey);
        return;
    }

    currentQuestionIndex = 0;
    userScore = 0;
    selectedOption = null;

    if (testTitleEl) testTitleEl.textContent = `Descubra seu Nível de ${currentLanguageName}`;
    if (testSubtitleEl) testSubtitleEl.textContent = `Responda algumas perguntas sobre ${currentLanguageName} e tenha uma ideia do seu conhecimento.`;

    document.getElementById('language-tests-selection').classList.add('hidden');
    if (testAreaSection) testAreaSection.classList.remove('hidden');
    if (testResultScreen) testResultScreen.classList.add('hidden');
    if (testQuestionScreen) testQuestionScreen.classList.remove('hidden');
    if (nextQuestionButton) nextQuestionButton.disabled = true;

    displayQuestion();
    if (testAreaSection) testAreaSection.scrollIntoView({ behavior: 'smooth' });
}

function displayQuestion() {
    if (currentQuestionIndex >= currentLanguageQuestions.length || !testQuestionScreen) return;
    const currentQuestion = currentLanguageQuestions[currentQuestionIndex];
    if (questionTextEl) questionTextEl.textContent = currentQuestion.question;
    if (optionsContainerEl) optionsContainerEl.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('w-full', 'p-3', 'border', 'border-slate-300', 'rounded-lg', 'text-left', 'question-option', 'hover:bg-purple-100', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-400');
        button.onclick = () => selectOption(button, option);
        if (optionsContainerEl) optionsContainerEl.appendChild(button);
    });

    if (currentQuestionNumberEl) currentQuestionNumberEl.textContent = currentQuestionIndex + 1;
    if (totalQuestionsEl) totalQuestionsEl.textContent = currentLanguageQuestions.length;
    updateProgressBar();
}

function selectOption(buttonEl, option) {
    if (!optionsContainerEl) return;
    const allOptions = optionsContainerEl.querySelectorAll('.question-option');
    allOptions.forEach(btn => btn.classList.remove('selected'));
    buttonEl.classList.add('selected');
    selectedOption = option;
    if (nextQuestionButton) nextQuestionButton.disabled = false;
}

function handleNextQuestion() {
    if (selectedOption === currentLanguageQuestions[currentQuestionIndex].answer) {
        userScore++;
    }
    currentQuestionIndex++;
    selectedOption = null;
    if (nextQuestionButton) nextQuestionButton.disabled = true;

    if (currentQuestionIndex < currentLanguageQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function updateProgressBar() {
    if (!progressBarEl || currentLanguageQuestions.length === 0) return;
    const progress = ((currentQuestionIndex + 1) / currentLanguageQuestions.length) * 100;
    progressBarEl.style.width = `${progress}%`;
}

function showResults() {
    if (testQuestionScreen) testQuestionScreen.classList.add('hidden');
    if (testResultScreen) testResultScreen.classList.remove('hidden');

    if (scoreEl) scoreEl.textContent = userScore;
    if (totalQuestionsResultEl) totalQuestionsResultEl.textContent = currentLanguageQuestions.length;
    if (resultLanguageNameEl) resultLanguageNameEl.textContent = currentLanguageName;

    let level = "";
    let description = "";
    const percentage = currentLanguageQuestions.length > 0 ? (userScore / currentLanguageQuestions.length) * 100 : 0;

    if (percentage <= 30) {
        level = "Iniciante (A1)";
        description = `Você está começando sua jornada em ${currentLanguageName}! Continue praticando os fundamentos para construir uma base sólida. Nossos cursos para iniciantes são perfeitos para você.`;
    } else if (percentage <= 60) {
        level = "Básico (A2)";
        description = `Você já tem um bom conhecimento básico de ${currentLanguageName}! Consegue se comunicar em situações simples. Explore nossos cursos de nível básico para expandir seu vocabulário e gramática.`;
    } else if (percentage <= 80) {
        level = "Intermediário (B1)";
        description = `Muito bem! Seu ${currentLanguageName} é intermediário. Você consegue entender e se fazer entender na maioria das situações do dia a dia. Nossos cursos intermediários te ajudarão a ganhar mais fluência e confiança.`;
    } else {
        level = "Avançado (B2/C1)";
        description = `Excelente! Seu nível de ${currentLanguageName} é avançado. Você tem um ótimo domínio do idioma. Considere nossos cursos avançados para refinar ainda mais suas habilidades ou se preparar para certificações.`;
    }
    if (levelMessageEl) levelMessageEl.textContent = `Seu nível estimado: ${level}`;
    if (levelDescriptionEl) levelDescriptionEl.textContent = description;
}

// Adiciona o event listener para o botão "Próxima Pergunta"
if (nextQuestionButton) {
    nextQuestionButton.addEventListener('click', handleNextQuestion);
}


languageTestButtons.forEach(button => {
    button.addEventListener('click', () => {
        const langKey = button.dataset.lang;
        const langName = button.dataset.langName;
        initTest(langKey, langName);
    });
});

initTestLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const langKey = link.dataset.langTest;
        const matchingButton = document.querySelector(`.language-test-button[data-lang="${langKey}"]`);
        const langName = matchingButton ? matchingButton.dataset.langName : (langKey.charAt(0).toUpperCase() + langKey.slice(1));
        initTest(langKey, langName);
    });
});

if (startLevelTestHeroButton) {
    startLevelTestHeroButton.addEventListener('click', (e) => {
        e.preventDefault();
        const testSelectionSection = document.getElementById('language-tests-selection');
        if (testSelectionSection) {
            testSelectionSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (restartTestButton) {
    restartTestButton.addEventListener('click', () => {
        const testSelectionSection = document.getElementById('language-tests-selection');
        if (testAreaSection) testAreaSection.classList.add('hidden');
        if (testSelectionSection) {
            testSelectionSection.classList.remove('hidden');
            testSelectionSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// --- Fim dos Testes de Nivelamento ---
