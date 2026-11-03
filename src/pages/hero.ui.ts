const slides = [
  {
    image: '/images/moron-clutch.png',
    alt: 'MORON taupe leather evening clutch',
  },
  { image: '/images/moron-hero.png', alt: 'MORON leather tote' },
  { image: '/images/moron-shoulder.png', alt: 'MORON leather shoulder bag' },
];

export function hero() {
  const images = slides
    .map(
      ({ image, alt }, index) =>
        `<img class="hero-slide${index === 1 ? ' active' : ''}" src="${image}" alt="${alt}"${index === 1 ? ' fetchpriority="high"' : ''}>`,
    )
    .join('');
  return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="hero-content"><p class="eyebrow hero-reveal">The autumn edit / 2026</p><h1 id="hero-title"><span>The art of</span><br><em>carrying well.</em></h1><p class="hero-description hero-reveal">Quietly expressive leather goods, made to move with you through every chapter.</p><div class="hero-actions hero-reveal"><a class="button" href="#/shop">Explore the collection <span>&rarr;</span></a><a class="button button-secondary" href="#/shop">New in <span>&rarr;</span></a></div></div><div class="hero-controls hero-reveal"><div class="hero-progress"><span data-slide-counter>02 / 03</span><i><b data-slide-progress></b></i></div><div class="hero-arrows"><button type="button" data-carousel-previous aria-label="Previous hero slide">&larr;</button><button type="button" data-carousel-next aria-label="Next hero slide">&rarr;</button></div></div></div><div class="hero-image" aria-label="MORON leather bag collection"><div class="hero-grain"></div>${images}</div></section>`;
}

export function startCarousel() {
  let active = 1;
  const heroSlides = document.querySelectorAll<HTMLElement>('.hero-slide');
  const counter = document.querySelector<HTMLElement>('[data-slide-counter]');
  const progress = document.querySelector<HTMLElement>('[data-slide-progress]');
  const show = (index: number) => {
    active = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, position) =>
      slide.classList.toggle('active', position === active),
    );
    if (counter)
      counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(heroSlides.length).padStart(2, '0')}`;
    progress?.style.setProperty(
      '--slide-progress',
      `${((active + 1) / heroSlides.length) * 100}%`,
    );
  };
  document
    .querySelector<HTMLButtonElement>('[data-carousel-previous]')
    ?.addEventListener('click', () => show(active - 1));
  document
    .querySelector<HTMLButtonElement>('[data-carousel-next]')
    ?.addEventListener('click', () => show(active + 1));
  show(active);
  return window.setInterval(() => show(active + 1), 5000);
}
