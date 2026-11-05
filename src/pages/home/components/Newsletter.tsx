import { useState, type FormEvent } from 'react';
export function Newsletter() {
  const [message, setMessage] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Thank you for subscribing.');
  };
  return (
    <section className="newsletter reveal">
      <p className="eyebrow">A note from MARIGOLD</p>
      <h2>Keep in touch.</h2>
      <p>Private previews, new arrivals, and stories from our studio.</p>
      <form onSubmit={submit}>
        <label className="sr-only">
          Email address
          <input type="email" required />
        </label>
        <button className="button" type="submit">
          Subscribe <span>→</span>
        </button>
      </form>
      <p className="newsletter-message" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
