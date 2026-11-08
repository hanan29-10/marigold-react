import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.email('Enter a valid email address.'),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const submit = async (): Promise<void> => {
    // A subscription endpoint has not been connected yet, so no success state
    // is shown or persisted on the client.
  };

  return (
    <section className="newsletter reveal">
      <p className="eyebrow">A note from MARIGOLD</p>
      <h2>Keep in touch.</h2>
      <p>Private previews, new arrivals, and stories from our studio.</p>
      <form
        noValidate
        onSubmit={(event) => {
          void handleSubmit(submit)(event);
        }}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
          {...register('email')}
        />
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing…' : 'Subscribe'} <span>→</span>
        </button>
      </form>
      {errors.email && (
        <p
          id="newsletter-email-error"
          className="newsletter-message"
          role="alert"
        >
          {errors.email.message}
        </p>
      )}
    </section>
  );
}
