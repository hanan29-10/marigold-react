interface CheckoutData {
  name: string;
  email: string;
  address: string;
  city: string;
}

type CheckoutValidationResult =
  { valid: true; data: CheckoutData } | { valid: false; message: string };
const requiredFields: readonly (keyof CheckoutData)[] = [
  'name',
  'email',
  'address',
  'city',
];
export function validateCheckout(
  form: HTMLFormElement,
): CheckoutValidationResult {
  const formData = new FormData(form);
  const getField = (field: keyof CheckoutData) => {
    const value = formData.get(field);
    return typeof value === 'string' ? value : '';
  };
  const data: CheckoutData = {
    name: getField('name'),
    email: getField('email'),
    address: getField('address'),
    city: getField('city'),
  };
  const missing = requiredFields.filter((field) => !data[field].trim());
  if (missing.length)
    return { valid: false, message: 'Please complete all required fields.' };
  if (!/^\S+@\S+\.\S+$/.test(data.email))
    return { valid: false, message: 'Enter a valid email address.' };
  return { valid: true, data };
}
