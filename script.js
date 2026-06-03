const siteConfig = {
  fontSize: {
    default: 16,
    min: 14,
    max: 20,
    step: 2
  },
  carouselDelay: 5000,
  carouselTransitionDuration: 460
};

const carouselItems = [
  {
    src: './img/campo.png', 
    alt: 'Campo de cevada em Guarapuava',
    title: 'Campo de cevada',
    description: 'O início da jornada acontece no campo, onde o cultivo da cevada depende de planejamento, clima favorável e cuidado com os recursos naturais.'
  },
  {
    src: './img/malte.png',
    alt: 'Malte em processo de beneficiamento',
    title: 'Transformação em malte',
    description: 'Após a colheita, a cevada passa por etapas de beneficiamento e transformação, unindo produção agrícola, tecnologia e indústria.'
  },
  {
    src: './img/cidade.png',
    alt: 'Cidade conectada à cadeia produtiva do malte',
    title: 'Campo e cidade conectados',
    description: 'O produto final chega à cidade e mostra como o agro movimenta a economia, abastece o cotidiano e depende de um futuro sustentável.'
  }
];

const facts = [
  'A cevada é um dos grãos cultivados há mais tempo pela humanidade e segue tendo grande importância econômica e alimentar.',
  'O malte não está presente apenas em bebidas: ele também pode ser utilizado em diferentes alimentos.',
  'A força do agro também depende do cuidado com o solo, a água e os demais recursos naturais.',
  'Produção e meio ambiente precisam caminhar juntos para garantir um futuro realmente sustentável.'
];

const quizQuestionNames = ['q1', 'q2', 'q3', 'q4', 'q5'];

const quizFeedbacks = {
  5: 'Parabéns! Você acertou tudo e compreendeu muito bem a relação entre cevada, malte, campo, cidade e sustentabilidade.',
  4: 'Excelente! Você acertou 4 de 5 perguntas e demonstrou ótima compreensão do tema.',
  3: 'Muito bom! Você acertou 3 de 5 perguntas e já domina boa parte do conteúdo.',
  2: 'Você acertou 2 de 5 perguntas. Vale revisar o conteúdo e tentar novamente.',
  1: 'Você acertou 1 de 5 perguntas. Explore o site novamente e tente mais uma vez.',
  0: 'Você ainda não acertou nenhuma. Explore o site novamente e faça uma nova tentativa.'
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
let currentFontSize = siteConfig.fontSize.default;
let currentCarouselIndex = 0;
let carouselTimer = null;
let currentFactIndex = 0;
let carouselTransitionTimer = null;
let isCarouselTransitioning = false;
function applyFontSize() {
  document.documentElement.style.fontSize = `${currentFontSize}px`;
  sendAccessibilityStateToHq();
}

function changeFontSize(direction) {
  const { min, max, step } = siteConfig.fontSize;
  const nextSize = currentFontSize + direction * step;

  currentFontSize = Math.min(max, Math.max(min, nextSize));
  applyFontSize();
}

function toggleContrast() {
  document.body.classList.toggle('high-contrast');
  sendAccessibilityStateToHq();
}

function getAccessibilityState() {
  return {
    type: 'accessibility-state',
    fontSize: currentFontSize,
    highContrast: document.body.classList.contains('high-contrast')
  };
}

function sendAccessibilityStateToHq() {
  const hqFrame = $('#hq iframe');
  if (!hqFrame || !hqFrame.contentWindow) return;
  hqFrame.contentWindow.postMessage(getAccessibilityState(), '*');
}

/* MENUS (FECHAMENTO) */

function closeMobileMenu() {
  const menuButton = $('#menu-toggle');
  const menu = $('#nav-links');
  if (!menuButton || !menu) return;

  menu.classList.remove('show');
  menuButton.setAttribute('aria-expanded', 'false');
}

function closeExploreMenu() {
  const navMore = $('.nav-more');
  const navMoreButton = $('#nav-more-btn');
  if (!navMore || !navMoreButton) return;

  navMore.classList.remove('open');
  navMoreButton.setAttribute('aria-expanded', 'false');
}

function closeAccessibilityMenu() {
  const button = $('#accessibility-btn');
  const menu = $('#accessibility-menu');
  if (!button || !menu) return;

  menu.classList.add('hidden');
  button.setAttribute('aria-expanded', 'false');
}

/* CONFIGURAÇÃO DE INTERAÇÕES E MENUS */

function setupMobileMenu() {
  const menuButton = $('#menu-toggle');
  const menu = $('#nav-links');
  if (!menuButton || !menu) return;

  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  $$('a', menu).forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMobileMenu();
    }
  });
}

function setupExploreMenu() {
  const navMore = $('.nav-more');
  const navMoreButton = $('#nav-more-btn');
  if (!navMore || !navMoreButton) return;

  navMoreButton.addEventListener('click', () => {
    const isOpen = navMore.classList.toggle('open');
    navMoreButton.setAttribute('aria-expanded', String(isOpen));
  });

  $$('a', navMore).forEach((link) => {
    link.addEventListener('click', closeExploreMenu);
  });

  document.addEventListener('click', (event) => {
    if (!navMore.contains(event.target)) {
      closeExploreMenu();
    }
  });
}

function setupAccessibilityMenu() {
  const button = $('#accessibility-btn');
  const menu = $('#accessibility-menu');
  if (!button || !menu) return;

  button.addEventListener('click', () => {
    const isHidden = menu.classList.toggle('hidden');
    button.setAttribute('aria-expanded', String(!isHidden));
  });

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      closeAccessibilityMenu();
    }
  });

  menu.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-accessibility-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.accessibilityAction;
    if (action === 'increase-font') changeFontSize(1);
    if (action === 'decrease-font') changeFontSize(-1);
    if (action === 'toggle-contrast') toggleContrast();
  });
}

function setupHqAccessibilitySync() {
  const hqFrame = $('#hq iframe');
  if (!hqFrame) return;

  hqFrame.addEventListener('load', sendAccessibilityStateToHq);
  sendAccessibilityStateToHq();
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
      closeExploreMenu();
      closeAccessibilityMenu();
    }
  });
}

function setupScrollReveal() {
  const revealElements = $$('.reveal');
  if (revealElements.length === 0) return;

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - 60) {
        element.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  window.addEventListener('load', revealOnScroll);
  revealOnScroll();
}

/* CARROSSEL */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canUseFilmCarouselTransition() {
  return !prefersReducedMotion() && window.matchMedia('(min-width: 769px)').matches;
}

function preloadCarouselImages() {
  carouselItems.forEach((item) => {
    const image = new Image();
    image.src = item.src;
  });
}

function getCarouselImage() {
  const slide = $('#carousel-slide');
  if (!slide) return null;

  let image = $('#carousel-image', slide);
  if (!image) {
    image = document.createElement('img');
    image.id = 'carousel-image';
    slide.appendChild(image);
  }
  return image;
}

function setImageSource(image, item) {
  if (!image || !item) return;
  image.src = item.src;
  image.alt = item.alt || '';
}

function setPreviewSource(image, item) {
  if (!image || !item) return;
  image.src = item.src;
}

function renderCarouselItem() {
  const item = carouselItems[currentCarouselIndex];
  const previousItem = carouselItems[(currentCarouselIndex - 1 + carouselItems.length) % carouselItems.length];
  const nextItem = carouselItems[(currentCarouselIndex + 1) % carouselItems.length];
  
  const image = getCarouselImage();
  const previewLeft = $('#carousel-preview-left');
  const previewRight = $('#carousel-preview-right');
  const title = $('#carousel-title');
  const description = $('#carousel-description');

  if (!item || !image || !title || !description) return;

  setImageSource(image, item);
  setPreviewSource(previewLeft, previousItem);
  setPreviewSource(previewRight, nextItem);
  title.textContent = item.title;
  description.textContent = item.description;

  $$('.dot').forEach((dot, index) => {
    const isActive = index === currentCarouselIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-current', String(isActive));
  });
}

function transitionToCarouselSlide(nextIndex, direction = 1) {
  const carousel = $('.carousel-wrapper');

  if (isCarouselTransitioning || nextIndex === currentCarouselIndex) return;

  clearTimeout(carouselTransitionTimer);

  if (!carousel || !canUseFilmCarouselTransition()) {
    currentCarouselIndex = nextIndex;
    renderCarouselItem();
    return;
  }

  isCarouselTransitioning = true;
  carousel.classList.add(direction > 0 ? 'is-moving-next' : 'is-moving-prev');

  carouselTransitionTimer = setTimeout(() => {
    carousel.classList.add('is-committing');
    currentCarouselIndex = nextIndex;
    renderCarouselItem();
    carousel.classList.remove('is-moving-next', 'is-moving-prev');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        carousel.classList.remove('is-committing');
        isCarouselTransitioning = false;
      });
    });
  }, siteConfig.carouselTransitionDuration);
}

function createCarouselDots() {
  const dotsContainer = $('#carousel-dots');
  if (!dotsContainer) return;

  const dots = carouselItems.map((item, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.dataset.index = String(index);
    dot.setAttribute('aria-label', `Ir para imagem ${index + 1}: ${item.title}`);
    return dot;
  });

  dotsContainer.replaceChildren(...dots);
}

function changeCarouselSlide(direction) {
  const nextIndex = (currentCarouselIndex + direction + carouselItems.length) % carouselItems.length;
  transitionToCarouselSlide(nextIndex, direction);
}

function goToCarouselSlide(index) {
  const direction = index > currentCarouselIndex ? 1 : -1;
  transitionToCarouselSlide(index, direction);
}

function stopCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = null;
}

function startCarousel() {
  if (carouselItems.length <= 1 || prefersReducedMotion()) return;

  stopCarousel();
  carouselTimer = setInterval(() => {
    changeCarouselSlide(1);
  }, siteConfig.carouselDelay);
}

function setupCarousel() {
  const carousel = $('.carousel-wrapper');
  if (!carousel || carouselItems.length === 0) return;

  preloadCarouselImages();
  createCarouselDots();

  $$('[data-carousel-direction]').forEach((button) => {
    button.addEventListener('click', () => {
      changeCarouselSlide(Number(button.dataset.carouselDirection));
      startCarousel();
    });
  });

  $$('.dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      goToCarouselSlide(Number(dot.dataset.index));
      startCarousel();
    });
  });

  carousel.addEventListener('mouseenter', stopCarousel);
  carousel.addEventListener('mouseleave', startCarousel);

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    if (event.matches) {
      stopCarousel();
    } else {
      startCarousel();
    }
  });

  renderCarouselItem();
  startCarousel();
}

/* CURIOSIDADES (Fatos Aleatórios) */

function setupFacts() {
  const factText = $('#fact-text');
  const factButton = $('#fact-btn');
  if (!factText || !factButton) return;

  factButton.addEventListener('click', () => {
    let nextIndex = currentFactIndex;

    while (nextIndex === currentFactIndex && facts.length > 1) {
      nextIndex = Math.floor(Math.random() * facts.length);
    }

    currentFactIndex = nextIndex;
    factText.textContent = facts[currentFactIndex];
  });
}

/* QUIZ */

function setupQuiz() {
  const quizForm = $('#quiz-form');
  const quizResult = $('#quiz-result');
  if (!quizForm || !quizResult) return;

  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(quizForm);
    let score = 0;
    let allAnswered = true;

    quizQuestionNames.forEach((questionName) => {
      const answer = formData.get(questionName);

      if (!answer) {
        allAnswered = false;
        return;
      }

      if (answer === 'certo') {
        score += 1;
      }
    });

    if (!allAnswered) {
      quizResult.textContent = 'Responda todas as perguntas para ver o resultado.';
      quizResult.classList.add('show');
      return;
    }

    quizResult.textContent = `Resultado: ${score}/5. ${quizFeedbacks[score]}`;
    quizResult.classList.add('show');
  });
}

/* CARDS EXPANSÍVEIS (Sanfona/Accordion) */

function setupExpandableCards() {
  $$('.card-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.expandable-card');
      const icon = $('.card-icon', toggle);
      if (!card) return;

      const isOpen = card.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      if (icon) {
        icon.textContent = isOpen ? '-' : '+';
      }
    });
  });
}
function initializeSite() {
  setupMobileMenu();
  setupExploreMenu();
  setupAccessibilityMenu();
  setupHqAccessibilitySync();
  setupKeyboardShortcuts();
  setupScrollReveal();
  setupCarousel();
  setupFacts();
  setupQuiz();
  setupExpandableCards();
}

// Dispara o script quando o HTML estiver totalmente carregado e pronto
document.addEventListener('DOMContentLoaded', initializeSite);