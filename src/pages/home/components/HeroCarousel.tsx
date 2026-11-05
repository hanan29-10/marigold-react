import { useEffect, useState } from 'react';
const slides = [
  '/images/marigold-clutch.png',
  '/images/marigold-hero.png',
  '/images/marigold-shoulder.png',
];
export function HeroCarousel() {
  const [active, setActive] = useState(1);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActive((value) => (value + 1) % slides.length);
      }
    }, 5600);
    return () => window.clearInterval(timer);
  }, []);
  const progress = `${((active + 1) / slides.length) * 100}%`;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-content">
          <p className="eyebrow hero-reveal">The autumn edit / 2026</p>
          <h1 id="hero-title">
            <span>The art of</span>
            <br />
            <em>carrying well.</em>
          </h1>
          <p className="hero-description hero-reveal">
            Quietly expressive leather goods, made to move with you through
            every chapter.
          </p>
          <div className="hero-actions hero-reveal">
            <a className="button" href="#/shop">
              Explore the collection <span>→</span>
            </a>
            <a className="button button-secondary" href="#/shop">
              New in <span>→</span>
            </a>
          </div>
        </div>
        <div className="hero-controls hero-reveal">
          <div className="hero-progress">
            <span>{String(active + 1).padStart(2, '0')} / 03</span>
            <i>
              <b style={{ width: progress }} />
            </i>
          </div>
          <div className="hero-arrows">
            <button
              onClick={() =>
                setActive(
                  (value) => (value + slides.length - 1) % slides.length,
                )
              }
              aria-label="Previous hero slide"
            >
              ←
            </button>
            <button
              onClick={() => setActive((value) => (value + 1) % slides.length)}
              aria-label="Next hero slide"
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-grain" />
        {slides.map((src, index) => (
          <img
            key={src}
            className={`hero-slide ${index === active ? 'active' : ''}`}
            src={src}
            alt="MARIGOLD leather bag"
            fetchPriority={index === 1 ? 'high' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
