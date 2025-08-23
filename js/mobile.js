// ============================================================================================
// SCRIPT PARA FUNCIONALIDADES GERAIS DA INTERFACE
// - Menu mobile
// - Ano dinâmico no rodapé
// - Simulação de envio de formulário de contato
// - Scroll suave para âncoras
// ============================================================================================

// --- Lógica do Menu Mobile ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Verifica se os elementos do menu mobile existem na página
if (mobileMenuButton && mobileMenu) {
    const navLinks = mobileMenu.querySelectorAll('a'); // Pega todos os links dentro do menu

    // Adiciona um evento de clique ao botão do menu (ícone de hambúrguer/X)
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden'); // Alterna a classe 'hidden' para mostrar/esconder o menu
        const icon = mobileMenuButton.querySelector('i'); // Pega o ícone dentro do botão

        // Troca o ícone entre hambúrguer (bars) e X (times)
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

    // Adiciona um evento de clique a cada link do menu mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => { // Quando um link é clicado...
            // ...fecha o menu se ele estiver aberto
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                // E garante que o ícone volte a ser o de hambúrguer
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
}

// --- Atualização Dinâmica do Ano no Rodapé ---
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    // Define o texto do elemento para o ano atual
    currentYearEl.textContent = new Date().getFullYear();
}

// --- Simulação de Envio do Formulário de Contato ---
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio real do formulário

        // Exibe mensagem de "enviando"
        formFeedback.textContent = 'Enviando sua mensagem...';
        formFeedback.className = 'mt-6 text-center text-purple-600';

        // Simula um tempo de espera de 2 segundos para o envio
        setTimeout(() => {
            // Exibe mensagem de sucesso
            formFeedback.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            formFeedback.className = 'mt-6 text-center text-green-600';
            if (contactForm) contactForm.reset(); // Limpa o formulário
        }, 2000);

        // Limpa a mensagem de feedback após 7 segundos
        setTimeout(() => {
            if (formFeedback) formFeedback.textContent = '';
        }, 7000);
    });
}

// --- Scroll Suave para Âncoras ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Impede o comportamento padrão do link de âncora
        const targetId = this.getAttribute('href');

        // Lógica especial para links que iniciam o teste de nivelamento
        if (this.classList.contains('init-test-link') || this.id === 'start-level-test-hero-button') {
            const testSelectionSection = document.getElementById('language-tests-selection');
            if (testSelectionSection) {
                testSelectionSection.scrollIntoView({ behavior: 'smooth' });
                // Se for um link de um card de idioma, inicia o teste correspondente
                if (this.classList.contains('init-test-link')) {
                    const langKey = this.dataset.langTest;
                    const matchingButton = document.querySelector(`.language-test-button[data-lang="${langKey}"]`);
                    const langName = matchingButton ? matchingButton.dataset.langName : (langKey.charAt(0).toUpperCase() + langKey.slice(1));
                    // A função initTest é definida em testes.js
                    initTest(langKey, langName);
                }
            }
            return; // Interrompe a execução para não fazer o scroll padrão abaixo
        }

        // Lógica para todos os outros links de âncora
        try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                // Calcula o deslocamento do cabeçalho para que o título da seção não fique escondido atrás dele
                const headerOffset = header ? header.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Realiza o scroll suave para a posição calculada
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error("Erro ao fazer scroll para âncora:", error);
        }
    });
});
