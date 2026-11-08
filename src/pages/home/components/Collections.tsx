export function Collections() {
  const collections = [
    ['Totes', 'tote'],
    ['Shoulder Bags', 'shoulder'],
    ['Clutches', 'travel'],
  ];
  return (
    <>
      <section className="benefits reveal" aria-label="MARIGOLD benefits">
        {[
          ['Italian leather', 'Premium, responsibly sourced'],
          ['Small-batch crafted', 'Thoughtfully made in limited runs'],
          ['Complimentary delivery', 'On all orders'],
          ['Gift wrapping', 'For a more personal touch'],
        ].map(([title, text]) => (
          <article key={title}>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="category-edit">
        <p className="eyebrow">A considered wardrobe</p>
        <h2>Curated collections</h2>
        <div className="category-grid">
          {collections.map(([category, className]) => (
            <a
              key={category}
              href="/shop"
              className={`category-tile ${className}`}
              onClick={() =>
                sessionStorage.setItem('marigold-category', category)
              }
            >
              <span>
                {category} <b>→</b>
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="intro reveal">
        <p className="eyebrow">Designed to last</p>
        <h2>
          Beautiful things,
          <br />
          made <em>useful.</em>
        </h2>
        <p>
          Each MARIGOLD piece balances soft structure, considered function and
          materials selected to become more personal over time.
        </p>
      </section>
    </>
  );
}
