const TOAST_DURATION = 2500;

export function showToast(message: string) {
  let toast = document.querySelector<HTMLParagraphElement>('.toast');

  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast?.classList.remove('show'), TOAST_DURATION);
}
