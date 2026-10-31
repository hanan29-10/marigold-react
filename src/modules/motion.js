export function initMotion() {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -36px' },
  );

  document
    .querySelectorAll('.reveal, .section-heading, .category-tile, .campaign')
    .forEach((element) => observer.observe(element));
}

export function initSignatureCarousel() {
  const carousel = document.querySelector('[data-signature-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('.signature-track');
  const previous = carousel.querySelector('[data-carousel-previous]');
  const next = carousel.querySelector('[data-carousel-next]');
  const move = (direction) =>
    track.scrollBy({
      left: direction * track.clientWidth * 0.78,
      behavior: 'smooth',
    });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
}
