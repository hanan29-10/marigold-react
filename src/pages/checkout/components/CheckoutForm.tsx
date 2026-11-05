import { type FormEvent, useState } from 'react';
export interface CheckoutFormProps {
  onComplete: () => void;
}
export function CheckoutForm({ onComplete }: CheckoutFormProps) {
  const [message, setMessage] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      setMessage('Please complete all required details.');
      return;
    }
    onComplete();
    setMessage('Thank you — your simulated order has been placed.');
  };
  return (
    <form noValidate onSubmit={submit}>
      <label>
        Full name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Address
        <input name="address" autoComplete="street-address" required />
      </label>
      <label>
        City
        <input name="city" autoComplete="address-level2" required />
      </label>
      <p className="form-message" role="alert">
        {message}
      </p>
      {!message && (
        <button className="button" type="submit">
          Place simulated order <span>→</span>
        </button>
      )}
    </form>
  );
}
