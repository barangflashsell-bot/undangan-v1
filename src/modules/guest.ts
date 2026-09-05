export function getGuestName(): string {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to') || params.get('u') || params.get('nama') || 'Tamu Undangan';
  return sanitizeHtml(guest.trim());
}

export function sanitizeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
