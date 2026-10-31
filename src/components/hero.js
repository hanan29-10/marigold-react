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

  return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">The autumn edit / 2026</p><h1 id="hero-title">The art of<br><em>carrying well.</em></h1><p>Quietly expressive leather goods, made to move with you through every chapter.</p><a class="button" href="#/shop">Explore the collection <span>&rarr;</span></a><div class="hero-dots" aria-label="Hero slides">${dots}</div></div><div class="hero-image" aria-label="MORON leather bag collection">${slides}</div></section>`;
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
  return window.setInterval(() => show((active + 1) % images.length), 5000);
}
