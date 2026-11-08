import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';

const schema = z
  .object({
    name: z.string().trim().min(1, 'Enter your full name.'),
    email: z.email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
type Values = z.infer<typeof schema>;

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const submit = () =>
    setMessage('Demo only — account creation is not connected.');
  const field = (
    id: string,
    label: string,
    error: string | undefined,
    input: ReactNode,
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {input}
      {error && (
        <p id={`${id}-error`} className="form-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
  return (
    <section className="page login-page">
      <div className="login-panel">
        <p className="eyebrow">MARIGOLD</p>
        <h1>Create an account</h1>
        <p>Join the MARIGOLD collection.</p>
        <form noValidate onSubmit={(event) => void handleSubmit(submit)(event)}>
          {field(
            'signup-name',
            'Full name',
            errors.name?.message,
            <Input
              id="signup-name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
              {...register('name')}
            />,
          )}
          {field(
            'signup-email',
            'Email address',
            errors.email?.message,
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
              {...register('email')}
            />,
          )}
          {field(
            'signup-password',
            'Password',
            errors.password?.message,
            <div className="password-field">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'signup-password-error' : undefined
                }
                {...register('password')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>,
          )}
          {field(
            'signup-confirm-password',
            'Confirm password',
            errors.confirmPassword?.message,
            <Input
              id="signup-confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? 'signup-confirm-password-error'
                  : undefined
              }
              {...register('confirmPassword')}
            />,
          )}
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
          <Button className="button" type="submit" disabled={isSubmitting}>
            Sign up <span>→</span>
          </Button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
