import confetti from 'canvas-confetti';
import type { RsvpItem } from '../types';

const RSVP_STORAGE_KEY = 'wedding_invitation_rsvp_wishes_v1';

const defaultWishes: RsvpItem[] = [
  {
    id: '1',
    name: 'Dimas Wicaksono',
    attendance: 'hadir',
    guestCount: 2,
    message: 'Selamat menempuh hidup baru Bayu & Sara! Semoga menjadi keluarga yang sakinah mawaddah warahmah, selalu harmonis dan diberkahi kebahagiaan seumur hidup.',
    createdAt: '1 jam yang lalu'
  },
  {
    id: '2',
    name: 'Anisa Maharani & Suami',
    attendance: 'hadir',
    guestCount: 2,
    message: 'Happy wedding Sara cantik dan Mas Bayu! Lancar sampai hari H yaa. See you on your special day! ❤️✨',
    createdAt: '3 jam yang lalu'
  },
  {
    id: '3',
    name: 'Reza Pratama',
    attendance: 'tidak_hadir',
    guestCount: 1,
    message: 'Barakallahu lakum wa baraka alaikum. Maaf belum bisa hadir langsung karena dinas luar kota, tapi doa terbaik selalu menyertai kedua mempelai.',
    createdAt: 'Kemarin'
  }
];

export function showToast(message: string, type: 'success' | 'info' = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function copyToClipboard(text: string, label: string = 'Nomor rekening') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} berhasil disalin ke clipboard!`, 'success');
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text: string, label: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label} berhasil disalin!`, 'success');
  } catch {
    showToast(`Gagal menyalin ${label}`, 'info');
  }
  document.body.removeChild(textArea);
}

export function initRsvp() {
  const form = document.getElementById('rsvp-form') as HTMLFormElement | null;
  const listEl = document.getElementById('wishes-list');
  const countEl = document.getElementById('wishes-count');

  function getStoredWishes(): RsvpItem[] {
    try {
      const data = localStorage.getItem(RSVP_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes: RsvpItem[]) {
    try {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.error(e);
    }
  }

  function renderWishes() {
    if (!listEl) return;
    const wishes = getStoredWishes();
    if (countEl) {
      countEl.textContent = `${wishes.length} Ucapan & Doa`;
    }

    listEl.innerHTML = wishes
      .map((item) => {
        const isAttending = item.attendance === 'hadir';
        const badgeClass = isAttending ? 'badge-attending' : 'badge-absent';
        const badgeText = isAttending ? '✓ Hadir' : '✕ Berhalangan';
        const initials = item.name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase() || 'U';

        return `
        <div class="wish-card">
          <div class="wish-header">
            <div class="wish-avatar">${initials}</div>
            <div class="wish-user-meta">
              <div class="wish-name">${escapeHtml(item.name)}</div>
              <div class="wish-time">${item.createdAt}</div>
            </div>
            <span class="wish-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="wish-message">${escapeHtml(item.message)}</div>
        </div>
      `;
      })
      .join('');
  }

  function escapeHtml(text: string): string {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('rsvp-name') as HTMLInputElement;
    const attendanceInput = document.getElementById('rsvp-attendance') as HTMLSelectElement;
    const countInput = document.getElementById('rsvp-guests') as HTMLSelectElement;
    const messageInput = document.getElementById('rsvp-message') as HTMLTextAreaElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    if (!nameInput.value.trim() || !messageInput.value.trim()) {
      showToast('Mohon isi nama dan doa restu Anda', 'info');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Mengirim Doa...';
    }

    const newWish: RsvpItem = {
      id: Date.now().toString(),
      name: nameInput.value.trim(),
      attendance: (attendanceInput.value as 'hadir' | 'tidak_hadir') || 'hadir',
      guestCount: parseInt(countInput.value || '1', 10),
      message: messageInput.value.trim(),
      createdAt: 'Baru saja'
    };

    setTimeout(() => {
      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Kirim Konfirmasi & Doa';
      }

      showToast('Terima kasih! Konfirmasi & doa restu Anda telah terkirim.', 'success');

      // Celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#e2b17b', '#ffffff', '#f48fb1']
      });
    }, 600);
  });

  // Bind bank copy buttons
  document.querySelectorAll('[data-copy-account]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const acc = btn.getAttribute('data-copy-account') || '';
      const bank = btn.getAttribute('data-bank') || 'Nomor Rekening';
      copyToClipboard(acc, bank);
    });
  });

  renderWishes();
}
