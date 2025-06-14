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
const testContainer = document.getElementById('test-container');


const languageTestButtons = document.querySelectorAll('.language-test-button');
const startLevelTestHeroButton = document.getElementById('start-level-test-hero-button');
const initTestLinks = document.querySelectorAll('.init-test-link');


// ============================================================================================
// INTEGRAÇÃO COM A API DO GEMINI
// ============================================================================================

// IMPORTANTE: Insira sua chave da API do Google AI Studio aqui.
// Você pode obter uma chave em https://aistudio.google.com/
const GEMINI_API_KEY = "AIzaSyC_0EqDawLp4pethK8J6px3AfS6KA8nmKE"; // <--- INSIRA SUA CHAVE DA API AQUI

const hardcodedQuestions = {
    // Mantemos as perguntas de Libras, pois exigem conhecimento visual específico
    // que a IA pode não gerar adequadamente para este formato de teste.
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


/**
 * Gera o prompt para a API do Gemini para criar perguntas de nivelamento.
 * @param {string} languageName - O nome do idioma (ex: "Inglês").
 * @returns {string} O prompt formatado.
 */
function generatePrompt(languageName) {
    return `Gere exatamente 10 perguntas de múltipla escolha para um teste de nivelamento de ${languageName}.
As perguntas devem abranger progressivamente os níveis de A1 a C1 do Quadro Europeu Comum de Referência para Línguas (CEFR), começando com 2 perguntas A1, 2 A2, 3 B1, 2 B2 e 1 C1.
As perguntas devem ser inteiramente no idioma ${languageName}, incluindo as opções.
A resposta correta ("answer") deve corresponder exatamente a uma das strings no array "options".

Forneça a resposta APENAS no formato JSON, como um array de objetos, sem nenhum texto ou formatação adicional antes ou depois do JSON.

Exemplo de formato de saída:
[
    {
    "question": "Pergunta no idioma ${languageName}",
    "options": ["opção 1", "opção 2", "opção 3", "opção 4"],
    "answer": "opção 2"
    },
]`;
}

/**
 * Busca as perguntas de nivelamento usando a API do Gemini.
 * @param {string} languageName - O nome do idioma para gerar as perguntas.
 * @returns {Promise<Array<Object>>} Uma promessa que resolve com o array de perguntas.
 */
async function fetchQuestionsFromGemini(languageName) {
    const prompt = generatePrompt(languageName);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    showLoadingState(`Gerando perguntas de ${languageName} com a IA...`);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Erro na API do Gemini:", errorBody);
            throw new Error(`A API retornou um erro: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
            throw new Error("Resposta da API em formato inesperado.");
        }

        const jsonText = data.candidates[0].content.parts[0].text;

        // Limpa a resposta para garantir que é um JSON válido
        const cleanedJsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

        const questions = JSON.parse(cleanedJsonText);

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("A API não retornou um array de perguntas válido.");
        }

        return questions;

    } catch (error) {
        console.error("Falha ao buscar ou processar perguntas da API:", error);
        showErrorState(`Não foi possível gerar as perguntas de ${languageName}. Por favor, verifique a chave da API e a conexão com a internet. Detalhes: ${error.message}`);
        return null; // Retorna nulo para indicar falha
    }
}


// ============================================================================================
// LÓGICA DO TESTE
// ============================================================================================

let currentLanguageQuestions = [];
let currentLanguageKey = "";
let currentLanguageName = "";
let currentQuestionIndex = 0;
let userScore = 0;
let selectedOption = null;

/**
 * Inicia o teste para o idioma selecionado.
 * @param {string} languageKey - A chave do idioma (ex: "english").
 * @param {string} languageName - O nome do idioma (ex: "Inglês").
 */
async function initTest(languageKey, languageName) {
    currentLanguageKey = languageKey;
    currentLanguageName = languageName;

    document.getElementById('language-tests-selection').classList.add('hidden');
    if (testAreaSection) testAreaSection.classList.remove('hidden');

    let questions = null;

    if (languageKey === 'libras') {
        questions = hardcodedQuestions.libras;
    } else {
        if (!GEMINI_API_KEY) {
            showErrorState("A chave da API do Gemini não foi configurada. Por favor, adicione a chave no arquivo js/testes.js.");
            return;
        }
        questions = await fetchQuestionsFromGemini(languageName);
    }

    if (!questions) {
        // A mensagem de erro já foi exibida pelas funções anteriores
        return;
    }

    currentLanguageQuestions = questions;
    currentQuestionIndex = 0;
    userScore = 0;
    selectedOption = null;

    if (testTitleEl) testTitleEl.textContent = `Descubra seu Nível de ${currentLanguageName}`;
    if (testSubtitleEl) testSubtitleEl.textContent = `Responda às perguntas e tenha uma ideia do seu conhecimento.`;

    hideLoadingAndErrorStates();
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
    const progress = ((currentQuestionIndex) / currentLanguageQuestions.length) * 100;
    progressBarEl.style.width = `${progress}%`;

    // Inicia a barra de progresso assim que a primeira questão é exibida
    if (currentQuestionIndex === 0) {
        setTimeout(() => {
            const progressFirst = ((currentQuestionIndex + 1) / currentLanguageQuestions.length) * 100;
            progressBarEl.style.width = `${progressFirst}%`;
        }, 100);
    } else {
        const progressNext = ((currentQuestionIndex + 1) / currentLanguageQuestions.length) * 100;
        progressBarEl.style.width = `${progressNext}%`;
    }
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

    if (percentage <= 20) {
        level = "Iniciante (A1)";
        description = `Você está começando sua jornada em ${currentLanguageName}! Continue praticando os fundamentos para construir uma base sólida. Nossos cursos para iniciantes são perfeitos para você.`;
    } else if (percentage <= 40) {
        level = "Básico (A2)";
        description = `Você já tem um bom conhecimento básico de ${currentLanguageName}! Consegue se comunicar em situações simples. Explore nossos cursos de nível básico para expandir seu vocabulário e gramática.`;
    } else if (percentage <= 70) {
        level = "Intermediário (B1/B2)";
        description = `Muito bem! Seu ${currentLanguageName} é intermediário. Você consegue entender e se fazer entender na maioria das situações do dia a dia. Nossos cursos intermediários te ajudarão a ganhar mais fluência e confiança.`;
    } else {
        level = "Avançado (C1/C2)";
        description = `Excelente! Seu nível de ${currentLanguageName} é avançado. Você tem um ótimo domínio do idioma. Considere nossos cursos avançados para refinar ainda mais suas habilidades ou se preparar para certificações.`;
    }
    if (levelMessageEl) levelMessageEl.textContent = `Seu nível estimado: ${level}`;
    if (levelDescriptionEl) levelDescriptionEl.textContent = description;
}

// ============================================================================================
// FUNÇÕES DE UI E EVENTOS
// ============================================================================================

function showLoadingState(message) {
    if (testContainer) {
        testContainer.innerHTML = `<div class="text-center p-8">
            <i class="fas fa-spinner fa-spin text-4xl text-knn-purple mb-4"></i>
            <p class="text-slate-600">${message}</p>
        </div>`;
    }
}

function showErrorState(message) {
    if (testContainer) {
        testContainer.innerHTML = `<div class="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-red-700 font-semibold">Ocorreu um Erro</p>
            <p class="text-red-600 mt-2">${message}</p>
            <button id="back-to-selection-button" class="mt-6 cta-button-purple text-white font-bold py-2 px-6 rounded-lg">Voltar</button>
        </div>`;
        document.getElementById('back-to-selection-button').addEventListener('click', returnToSelection);
    }
}

function hideLoadingAndErrorStates() {
    if (testContainer) {
        // Recria a estrutura original do container de teste
        testContainer.innerHTML = `
            <div id="test-question-screen" class="hidden">
                <div class="mb-4">
                    <p class="text-sm text-knn-purple font-semibold">Pergunta <span id="current-question-number"></span> de <span id="total-questions"></span></p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div id="progress-bar" class="bg-knn-orange h-2.5 rounded-full progress-bar-fill" style="width: 0%"></div>
                    </div>
                </div>
                <h3 id="question-text" class="text-xl md:text-2xl font-semibold text-slate-800 mb-6"></h3>
                <div id="options-container" class="space-y-3"></div>
                <button id="next-question-button" class="mt-8 w-full cta-button-orange text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50" disabled>
                    Próxima Pergunta
                </button>
            </div>
            <div id="test-result-screen" class="hidden text-center">
                <h3 class="text-2xl md:text-3xl font-bold text-knn-purple mb-4">Resultado do Teste de <span id="result-language-name"></span></h3>
                <p class="text-slate-700 text-lg mb-2">Você acertou <span id="score" class="font-bold"></span> de <span id="total-questions-result" class="font-bold"></span> perguntas.</p>
                <p id="level-message" class="text-xl font-semibold text-slate-800 mb-6"></p>
                <div id="level-description" class="text-slate-600 mb-8"></div>
                <button id="restart-test-button" class="w-full cta-button-purple text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition duration-300">
                    Fazer Outro Teste
                </button>
                <a href="#contato" class="mt-4 inline-block w-full bg-transparent border-2 border-knn-orange text-knn-orange font-bold py-3 px-8 rounded-lg text-lg hover:bg-knn-orange hover:text-white transition duration-300">
                    Fale Conosco sobre seu Nível
                </a>
            </div>
        `;
        // Reatribui as variáveis globais aos novos elementos
        Object.assign(window, {
            testQuestionScreen: document.getElementById('test-question-screen'),
            testResultScreen: document.getElementById('test-result-screen'),
            questionTextEl: document.getElementById('question-text'),
            optionsContainerEl: document.getElementById('options-container'),
            nextQuestionButton: document.getElementById('next-question-button'),
            restartTestButton: document.getElementById('restart-test-button'),
            currentQuestionNumberEl: document.getElementById('current-question-number'),
            totalQuestionsEl: document.getElementById('total-questions'),
            progressBarEl: document.getElementById('progress-bar'),
            scoreEl: document.getElementById('score'),
            totalQuestionsResultEl: document.getElementById('total-questions-result'),
            levelMessageEl: document.getElementById('level-message'),
            levelDescriptionEl: document.getElementById('level-description'),
            resultLanguageNameEl: document.getElementById('result-language-name')
        });

        // Reatribui os event listeners
        if (nextQuestionButton) nextQuestionButton.addEventListener('click', handleNextQuestion);
        if (restartTestButton) restartTestButton.addEventListener('click', returnToSelection);
    }
}

function returnToSelection() {
    hideLoadingAndErrorStates(); // Restaura a estrutura do container
    const testSelectionSection = document.getElementById('language-tests-selection');
    if (testAreaSection) testAreaSection.classList.add('hidden');
    if (testSelectionSection) {
        testSelectionSection.classList.remove('hidden');
        testSelectionSection.scrollIntoView({ behavior: 'smooth' });
    }
}


// Adiciona os event listeners aos botões e links
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

// O event listener para o botão de reiniciar agora chama returnToSelection
if (document.getElementById('restart-test-button')) {
    document.getElementById('restart-test-button').addEventListener('click', returnToSelection);
} else if (restartTestButton) {
    restartTestButton.addEventListener('click', returnToSelection);
}


// --- Fim dos Testes de Nivelamento ---
