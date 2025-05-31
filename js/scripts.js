// --- Teste de Inglês ---
const testContainer = document.getElementById('test-container');
const testStartScreen = document.getElementById('test-start-screen');
const testQuestionScreen = document.getElementById('test-question-screen');
const testResultScreen = document.getElementById('test-result-screen');

const startTestButton = document.getElementById('start-test-button');
const startTestHeroButton = document.getElementById('start-test-hero-button');

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

const questions = [
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
];

let currentQuestionIndex = 0;
let userScore = 0;
let selectedOption = null;

function startTest() {
    currentQuestionIndex = 0;
    userScore = 0;
    selectedOption = null;
    if (testStartScreen) testStartScreen.classList.add('hidden');
    if (testResultScreen) testResultScreen.classList.add('hidden');
    if (testQuestionScreen) testQuestionScreen.classList.remove('hidden');
    if (nextQuestionButton) nextQuestionButton.disabled = true;
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length || !testQuestionScreen) return; // Proteção
    const currentQuestion = questions[currentQuestionIndex];
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
    if (totalQuestionsEl) totalQuestionsEl.textContent = questions.length;
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
    if (selectedOption === questions[currentQuestionIndex].answer) {
        userScore++;
    }
    currentQuestionIndex++;
    selectedOption = null;
    if (nextQuestionButton) nextQuestionButton.disabled = true;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function updateProgressBar() {
    if (!progressBarEl) return;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBarEl.style.width = `${progress}%`;
}

function showResults() {
    if (testQuestionScreen) testQuestionScreen.classList.add('hidden');
    if (testResultScreen) testResultScreen.classList.remove('hidden');

    if (scoreEl) scoreEl.textContent = userScore;
    if (totalQuestionsResultEl) totalQuestionsResultEl.textContent = questions.length;

    let level = "";
    let description = "";

    if (userScore <= 3) {
        level = "Iniciante (A1)";
        description = "Você está começando sua jornada no inglês! Continue praticando os fundamentos para construir uma base sólida. Nossos cursos para iniciantes são perfeitos para você.";
    } else if (userScore <= 6) {
        level = "Básico (A2)";
        description = "Você já tem um bom conhecimento básico! Consegue se comunicar em situações simples. Explore nossos cursos de nível básico para expandir seu vocabulário e gramática.";
    } else if (userScore <= 8) {
        level = "Intermediário (B1)";
        description = "Muito bem! Seu inglês é intermediário. Você consegue entender e se fazer entender na maioria das situações do dia a dia. Nossos cursos intermediários te ajudarão a ganhar mais fluência e confiança.";
    } else {
        level = "Avançado (B2/C1)";
        description = "Excelente! Seu nível de inglês é avançado. Você tem um ótimo domínio do idioma. Considere nossos cursos avançados para refinar ainda mais suas habilidades ou se preparar para certificações.";
    }
    if (levelMessageEl) levelMessageEl.textContent = `Seu nível estimado: ${level}`;
    if (levelDescriptionEl) levelDescriptionEl.textContent = description;
}

if (startTestButton) {
    startTestButton.addEventListener('click', startTest);
}
if (startTestHeroButton) {
    startTestHeroButton.addEventListener('click', (e) => {
        e.preventDefault();
        const testSection = document.getElementById('english-test-section');
        if (testSection) {
            testSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
if (nextQuestionButton) {
    nextQuestionButton.addEventListener('click', handleNextQuestion);
}
if (restartTestButton) {
    restartTestButton.addEventListener('click', startTest);
}

// --- Fim do Teste de Inglês ---

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    const navLinks = mobileMenu.querySelectorAll('a');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        formFeedback.textContent = 'Enviando sua mensagem...';
        formFeedback.className = 'mt-6 text-center text-purple-600';

        setTimeout(() => {
            formFeedback.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            formFeedback.className = 'mt-6 text-center text-green-600';
            contactForm.reset();
        }, 2000);

        setTimeout(() => {
            formFeedback.textContent = '';
        }, 7000);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error("Error scrolling to anchor:", error);
            // Fallback or alternative behavior if querySelector fails (e.g., invalid ID)
            // window.location.hash = targetId; // Simple hash jump as fallback
        }
    });
});