interface CheckoutData {
  name: string;
  email: string;
  address: string;
  city: string;
}

type CheckoutValidationResult =
  { valid: true; data: CheckoutData } | { valid: false; message: string };
export function validateCheckout(
  form: HTMLFormElement,
): CheckoutValidationResult {
  const formData = new FormData(form);
  const data: CheckoutData = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    address: String(formData.get('address') ?? ''),
    city: String(formData.get('city') ?? ''),
  };
  const missing = (['name', 'email', 'address', 'city'] as const).filter(
    (field) => !String(data[field] || '').trim(),
  );
  if (missing.length)
    return { valid: false, message: 'Please complete all required fields.' };
  if (!/^\S+@\S+\.\S+$/.test(String(data.email || '')))
    return { valid: false, message: 'Enter a valid email address.' };
  return { valid: true, data };
}
