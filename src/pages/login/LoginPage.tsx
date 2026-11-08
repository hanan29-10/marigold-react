import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = () =>
    setMessage('Demo only — authentication is not connected.');

  return (
    <section className="page login-page">
      <div className="login-panel">
        <p className="eyebrow">MARIGOLD</p>
        <h1>Welcome back</h1>
        <p>Sign in to your account</p>
        <form noValidate onSubmit={(event) => void handleSubmit(submit)(event)}>
          <div>
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="form-message" role="alert">
              {errors.email.message}
            </p>
          )}
          <div>
            <Label htmlFor="login-password">Password</Label>
            <div className="password-field">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'login-password-error' : undefined
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
            </div>
          </div>
          {errors.password && (
            <p id="login-password-error" className="form-message" role="alert">
              {errors.password.message}
            </p>
          )}
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
          <Button className="button" type="submit" disabled={isSubmitting}>
            Sign in <span>→</span>
          </Button>
        </form>
        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </section>
  );
}
