import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';

const checkoutSchema = z.object({
  name: z.string().trim().min(1, 'Enter your full name.'),
  email: z.email('Enter a valid email address.'),
  address: z.string().trim().min(1, 'Enter your address.'),
  city: z.string().trim().min(1, 'Enter your city.'),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export interface CheckoutFormProps {
  onComplete: () => void;
}

export function CheckoutForm({ onComplete }: CheckoutFormProps) {
  const [message, setMessage] = useState('');
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', address: '', city: '' },
  });

  const submit = () => {
    onComplete();
    setMessage('Thank you — your simulated order has been placed.');
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
    >
      <div>
        <Label htmlFor="checkout-name">Full name</Label>
        <Input
          id="checkout-name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'checkout-name-error' : undefined}
          {...register('name')}
        />
      </div>
      {errors.name && (
        <p id="checkout-name-error" className="form-message" role="alert">
          {errors.name.message}
        </p>
      )}
      <div>
        <Label htmlFor="checkout-email">Email address</Label>
        <Input
          id="checkout-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'checkout-email-error' : undefined}
          {...register('email')}
        />
      </div>
      {errors.email && (
        <p id="checkout-email-error" className="form-message" role="alert">
          {errors.email.message}
        </p>
      )}
      <div>
        <Label htmlFor="checkout-address">Address</Label>
        <Input
          id="checkout-address"
          autoComplete="street-address"
          aria-invalid={Boolean(errors.address)}
          aria-describedby={
            errors.address ? 'checkout-address-error' : undefined
          }
          {...register('address')}
        />
      </div>
      {errors.address && (
        <p id="checkout-address-error" className="form-message" role="alert">
          {errors.address.message}
        </p>
      )}
      <div>
        <Label htmlFor="checkout-city">City</Label>
        <Input
          id="checkout-city"
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? 'checkout-city-error' : undefined}
          {...register('city')}
        />
      </div>
      {errors.city && (
        <p id="checkout-city-error" className="form-message" role="alert">
          {errors.city.message}
        </p>
      )}
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
      {!message && (
        <Button className="button" type="submit">
          Place simulated order <span>→</span>
        </Button>
      )}
    </form>
  );
}
