const images = [
  '/images/moron-hero.png',
  '/images/moron-shoulder.png',
  '/images/moron-clutch.png',
];

export function hero() {
  const slides = images
    .map(
      (image, index) =>
        `<img class="hero-slide${index === 0 ? ' active' : ''}" src="${image}" alt="MORON leather ${['tote', 'shoulder bag', 'evening clutch'][index]}"${index === 0 ? ' fetchpriority="high"' : ''}>`,
    )
    .join('');
  const dots = images
    .map(
      (_, index) =>
        `<button type="button" aria-label="Show slide ${index + 1}" aria-pressed="${index === 0}" data-slide="${index}" class="${index === 0 ? 'active' : ''}"></button>`,
    )
    .join('');

  return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow hero-reveal">The autumn edit / 2026</p><h1 id="hero-title"><span>The art of</span><br><em>carrying well.</em></h1><p class="hero-reveal">Quietly expressive leather goods, made to move with you through every chapter.</p><a class="button hero-reveal" href="#/shop">Explore the collection <span>→</span></a><div class="hero-dots hero-reveal" aria-label="Hero slides">${dots}</div></div><div class="hero-image" aria-label="MORON leather bag collection"><div class="hero-grain"></div>${slides}</div></section>`;
}

export function startCarousel() {
  let active = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const show = (index) => {
    active = index;
    slides.forEach((slide, position) =>
      slide.classList.toggle('active', position === index),
    );
    document.querySelectorAll('[data-slide]').forEach((dot, position) => {
      const isActive = position === index;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  };
  document
    .querySelectorAll('[data-slide]')
    .forEach((dot) =>
      dot.addEventListener('click', () => show(Number(dot.dataset.slide))),
    );
  show(0);
  const heroImage = document.querySelector('.hero-image');
  if (heroImage && window.matchMedia('(hover: hover)').matches) {
    heroImage.addEventListener('pointermove', (event) => {
      const bounds = heroImage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroImage.style.setProperty('--pointer-x', `${x * 10}px`);
      heroImage.style.setProperty('--pointer-y', `${y * 10}px`);
    });
    heroImage.addEventListener('pointerleave', () => {
      heroImage.style.setProperty('--pointer-x', '0px');
      heroImage.style.setProperty('--pointer-y', '0px');
    });
  }
  return window.setInterval(() => show((active + 1) % images.length), 5000);
}
