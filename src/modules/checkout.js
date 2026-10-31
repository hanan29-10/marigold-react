export function validateCheckout(form) {
  const data = Object.fromEntries(new FormData(form));
  const missing = ['name', 'email', 'address', 'city'].filter(
    (field) => !String(data[field] || '').trim(),
  );
  if (missing.length)
    return { valid: false, message: 'Please complete all required fields.' };
  if (!/^\S+@\S+\.\S+$/.test(data.email))
    return { valid: false, message: 'Enter a valid email address.' };
  return { valid: true, data };
}
