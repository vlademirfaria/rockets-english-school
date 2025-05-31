// Script para menu mobile
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
        link.addEventListener('click', () => { // Adiciona evento de clique para fechar o menu
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
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
            if (contactForm) contactForm.reset();
        }, 2000);

        setTimeout(() => {
            if (formFeedback) formFeedback.textContent = '';
        }, 7000);
    });
}

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        // Não aplicar scroll suave para links que iniciam testes diretamente
        if (this.classList.contains('init-test-link') || this.id === 'start-level-test-hero-button') {
            const testSelectionSection = document.getElementById('language-tests-selection');
            if (testSelectionSection) {
                testSelectionSection.scrollIntoView({ behavior: 'smooth' });
                // Se for um link direto para um teste, também chama initTest
                if (this.classList.contains('init-test-link')) {
                    const langKey = this.dataset.langTest;
                    const matchingButton = document.querySelector(`.language-test-button[data-lang="${langKey}"]`);
                    const langName = matchingButton ? matchingButton.dataset.langName : (langKey.charAt(0).toUpperCase() + langKey.slice(1));
                    initTest(langKey, langName);
                }
            }
            return;
        }

        try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 70; // Default offset se header não for encontrado
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

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