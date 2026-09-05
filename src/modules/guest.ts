import { showToast, copyToClipboard } from './rsvp';

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

export function generateGuestLink(guestName: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('to', guestName.trim());
  return url.toString();
}

export function setupGuestEditor(getCoupleNames: () => string) {
  const btnEdit = document.getElementById('btn-edit-guest');
  const guestNameEl = document.getElementById('guest-name-cover');
  const modal = document.getElementById('guest-edit-modal');
  const closeModal = document.getElementById('guest-edit-close');
  const inputName = document.getElementById('input-guest-name') as HTMLInputElement | null;
  const btnApply = document.getElementById('btn-apply-guest');
  const btnCopyLink = document.getElementById('btn-copy-guest-link');
  const btnWa = document.getElementById('btn-share-wa');

  function openModal() {
    if (!modal || !inputName) return;
    const currentName = guestNameEl?.textContent?.trim() || 'Tamu Undangan';
    inputName.value = currentName === 'Tamu Undangan' ? '' : currentName;
    modal.classList.add('active');
    inputName.focus();
  }

  function hideModal() {
    modal?.classList.remove('active');
  }

  btnEdit?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  guestNameEl?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  closeModal?.addEventListener('click', hideModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  // Terapkan nama tamu ke cover
  btnApply?.addEventListener('click', () => {
    const newName = inputName?.value.trim() || 'Tamu Undangan';
    if (guestNameEl) {
      guestNameEl.textContent = newName;
    }

    // Update URL parameter without reload
    const newUrl = new URL(window.location.href);
    if (newName && newName !== 'Tamu Undangan') {
      newUrl.searchParams.set('to', newName);
    } else {
      newUrl.searchParams.delete('to');
    }
    window.history.replaceState({}, '', newUrl.toString());

    hideModal();
    showToast(`Nama tamu diubah menjadi: "${newName}"`, 'success');
  });

  // Salin Link Khusus Tamu
  btnCopyLink?.addEventListener('click', () => {
    const newName = inputName?.value.trim() || guestNameEl?.textContent?.trim() || 'Tamu Undangan';
    const link = generateGuestLink(newName);
    copyToClipboard(link, `Link undangan untuk "${newName}"`);
  });

  // Kirim Pesan Undangan via WhatsApp
  btnWa?.addEventListener('click', () => {
    const newName = inputName?.value.trim() || guestNameEl?.textContent?.trim() || 'Tamu Undangan';
    const link = generateGuestLink(newName);
    const couple = getCoupleNames();

    const text = `Kepada Yth.\nBapak/Ibu/Saudara/i *${newName}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n*The Wedding of ${couple}*\n\nBuka tautan undangan digital kami di bawah ini:\n${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.\n\nTerima kasih.\nKami yang berbahagia,\n*${couple}*`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  });
}
