import type { InvitationConfig, ThemePreset } from '../types';
import {
  getActiveInvitationData,
  saveCustomInvitationData,
  resetCustomInvitationData,
  defaultInvitationData,
  exportInvitationDataCode
} from '../data/invitationData';
import { showToast, copyToClipboard } from './rsvp';

const ADMIN_PIN = '1234';

/**
 * Utility to compress uploaded image files to lightweight DataURL
 * prevents exceeding LocalStorage quotas.
 */
function compressImageFile(file: File, maxDimension = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function initAdmin(onDataUpdated: (newData: InvitationConfig) => void) {
  const adminBtn = document.getElementById('admin-open-btn');
  const pinModal = document.getElementById('admin-pin-modal');
  const pinInput = document.getElementById('admin-pin-input') as HTMLInputElement | null;
  const pinSubmit = document.getElementById('admin-pin-submit');
  const pinCancel = document.getElementById('admin-pin-cancel');
  const pinError = document.getElementById('pin-error');

  const dashModal = document.getElementById('admin-dashboard-modal');
  const dashClose = document.getElementById('admin-dash-close');
  const btnSave = document.getElementById('admin-save-btn');
  const btnReset = document.getElementById('admin-reset-btn');
  const btnExportCopy = document.getElementById('admin-copy-code-btn');
  const exportCodeBox = document.getElementById('admin-export-code');

  // Working copy of data
  let currentConfig: InvitationConfig = { ...getActiveInvitationData() };
  let selectedTheme: ThemePreset = currentConfig.theme || 'emerald-gold';

  // Theme option clicks
  document.querySelectorAll('.theme-card-option').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card-option').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedTheme = (card.getAttribute('data-theme-value') as ThemePreset) || 'emerald-gold';
    });
  });

  // Image storage cache for uploaded photos
  const uploadedPhotos: {
    groom?: string;
    bride?: string;
    hero?: string;
    qris?: string;
    gallery1?: string;
    gallery2?: string;
  } = {};

  // Check URL param ?admin=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    setTimeout(() => openPinModal(), 500);
  }

  function openPinModal() {
    pinModal?.classList.add('active');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    pinError?.classList.remove('show');
  }

  function closePinModal() {
    pinModal?.classList.remove('active');
  }

  function openDashboard() {
    currentConfig = { ...getActiveInvitationData() };
    closePinModal();
    populateFormValues(currentConfig);
    dashModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDashboard() {
    dashModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind PIN actions
  adminBtn?.addEventListener('click', openPinModal);
  pinCancel?.addEventListener('click', closePinModal);
  pinSubmit?.addEventListener('click', verifyPin);
  pinInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyPin();
  });

  function verifyPin() {
    if (pinInput?.value.trim() === ADMIN_PIN) {
      openDashboard();
    } else {
      pinError?.classList.add('show');
    }
  }

  dashClose?.addEventListener('click', closeDashboard);

  // Tabs Navigation
  document.querySelectorAll('.admin-tab-btn').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      const tabTarget = tabBtn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach((c) => c.classList.remove('active'));

      tabBtn.classList.add('active');
      document.getElementById(`tab-${tabTarget}`)?.classList.add('active');

      if (tabTarget === 'export' && exportCodeBox) {
        exportCodeBox.textContent = exportInvitationDataCode(collectFormValues());
      }
    });
  });

  // Photo upload listeners helper
  function setupPhotoUploader(
    fileInputId: string,
    previewImgId: string,
    onProcessed: (dataUrl: string) => void
  ) {
    const fileInput = document.getElementById(fileInputId) as HTMLInputElement | null;
    const previewImg = document.getElementById(previewImgId) as HTMLImageElement | null;

    fileInput?.addEventListener('change', async () => {
      if (fileInput.files && fileInput.files[0]) {
        try {
          showToast('Sedang memproses foto...', 'info');
          const dataUrl = await compressImageFile(fileInput.files[0]);
          if (previewImg) previewImg.src = dataUrl;
          onProcessed(dataUrl);
          showToast('Foto berhasil dimuat!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Gagal memproses gambar', 'info');
        }
      }
    });
  }

  setupPhotoUploader('file-groom', 'preview-groom', (url) => { uploadedPhotos.groom = url; });
  setupPhotoUploader('file-bride', 'preview-bride', (url) => { uploadedPhotos.bride = url; });
  setupPhotoUploader('file-hero', 'preview-hero', (url) => { uploadedPhotos.hero = url; });
  setupPhotoUploader('file-qris', 'preview-qris', (url) => { uploadedPhotos.qris = url; });
  setupPhotoUploader('file-gallery-1', 'preview-gallery-1', (url) => { uploadedPhotos.gallery1 = url; });
  setupPhotoUploader('file-gallery-2', 'preview-gallery-2', (url) => { uploadedPhotos.gallery2 = url; });

  function populateFormValues(config: InvitationConfig) {
    // Pilihan Tema
    selectedTheme = config.theme || 'emerald-gold';
    document.querySelectorAll('.theme-card-option').forEach((card) => {
      if (card.getAttribute('data-theme-value') === selectedTheme) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Mempelai Pria
    setVal('admin-groom-name', config.groom.fullName);
    setVal('admin-groom-short', config.groom.shortName);
    setVal('admin-groom-father', config.groom.fatherName);
    setVal('admin-groom-mother', config.groom.motherName);
    setVal('admin-groom-ig', config.groom.instagram || '');
    setImg('preview-groom', config.groom.photoUrl);

    // Mempelai Wanita
    setVal('admin-bride-name', config.bride.fullName);
    setVal('admin-bride-short', config.bride.shortName);
    setVal('admin-bride-father', config.bride.fatherName);
    setVal('admin-bride-mother', config.bride.motherName);
    setVal('admin-bride-ig', config.bride.instagram || '');
    setImg('preview-bride', config.bride.photoUrl);

    // Hero Banner
    setImg('preview-hero', config.gallery[0]?.src || '/images/hero.jpg');

    // Tanggal Acara (YYYY-MM-DDTHH:mm)
    const d = new Date(config.eventDate);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localIso = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    setVal('admin-event-date', localIso);

    // Akad Nikah
    setVal('admin-akad-date', config.akad.dateStr);
    setVal('admin-akad-time', config.akad.timeStr);
    setVal('admin-akad-venue', config.akad.locationName);
    setVal('admin-akad-address', config.akad.locationAddress);
    setVal('admin-akad-maps', config.akad.mapsUrl);

    // Resepsi
    setVal('admin-reception-date', config.reception.dateStr);
    setVal('admin-reception-time', config.reception.timeStr);
    setVal('admin-reception-venue', config.reception.locationName);
    setVal('admin-reception-address', config.reception.locationAddress);
    setVal('admin-reception-maps', config.reception.mapsUrl);

    // Bank 1 & 2
    if (config.bankAccounts[0]) {
      setVal('admin-bank1-name', config.bankAccounts[0].bankName);
      setVal('admin-bank1-number', config.bankAccounts[0].accountNumber);
      setVal('admin-bank1-holder', config.bankAccounts[0].accountHolder);
    }
    if (config.bankAccounts[1]) {
      setVal('admin-bank2-name', config.bankAccounts[1].bankName);
      setVal('admin-bank2-number', config.bankAccounts[1].accountNumber);
      setVal('admin-bank2-holder', config.bankAccounts[1].accountHolder);
    }
    setImg('preview-qris', config.qrisImageUrl);

    // Galeri Prewedding
    if (config.gallery[1]) {
      setImg('preview-gallery-1', config.gallery[1].src);
      setVal('admin-gallery1-caption', config.gallery[1].caption);
    }
    if (config.gallery[2]) {
      setImg('preview-gallery-2', config.gallery[2].src);
      setVal('admin-gallery2-caption', config.gallery[2].caption);
    }
  }

  function collectFormValues(): InvitationConfig {
    const dateInput = (document.getElementById('admin-event-date') as HTMLInputElement)?.value;
    const eventDate = dateInput ? new Date(dateInput) : currentConfig.eventDate;

    const heroImg = uploadedPhotos.hero || currentConfig.gallery[0]?.src || '/images/hero.jpg';
    const groomImg = uploadedPhotos.groom || currentConfig.groom.photoUrl;
    const brideImg = uploadedPhotos.bride || currentConfig.bride.photoUrl;
    const qrisImg = uploadedPhotos.qris || currentConfig.qrisImageUrl;
    const gal1Img = uploadedPhotos.gallery1 || currentConfig.gallery[1]?.src || '/images/gallery-1.jpg';
    const gal2Img = uploadedPhotos.gallery2 || currentConfig.gallery[2]?.src || '/images/gallery-2.jpg';

    return {
      theme: selectedTheme,
      groom: {
        fullName: getVal('admin-groom-name') || currentConfig.groom.fullName,
        shortName: getVal('admin-groom-short') || currentConfig.groom.shortName,
        photoUrl: groomImg,
        fatherName: getVal('admin-groom-father') || currentConfig.groom.fatherName,
        motherName: getVal('admin-groom-mother') || currentConfig.groom.motherName,
        instagram: getVal('admin-groom-ig') || currentConfig.groom.instagram,
        bio: currentConfig.groom.bio
      },
      bride: {
        fullName: getVal('admin-bride-name') || currentConfig.bride.fullName,
        shortName: getVal('admin-bride-short') || currentConfig.bride.shortName,
        photoUrl: brideImg,
        fatherName: getVal('admin-bride-father') || currentConfig.bride.fatherName,
        motherName: getVal('admin-bride-mother') || currentConfig.bride.motherName,
        instagram: getVal('admin-bride-ig') || currentConfig.bride.instagram,
        bio: currentConfig.bride.bio
      },
      eventDate: eventDate,
      akad: {
        title: 'Akad Nikah',
        dateStr: getVal('admin-akad-date') || currentConfig.akad.dateStr,
        timeStr: getVal('admin-akad-time') || currentConfig.akad.timeStr,
        locationName: getVal('admin-akad-venue') || currentConfig.akad.locationName,
        locationAddress: getVal('admin-akad-address') || currentConfig.akad.locationAddress,
        mapsUrl: getVal('admin-akad-maps') || currentConfig.akad.mapsUrl,
        notes: currentConfig.akad.notes
      },
      reception: {
        title: 'Resepsi Pernikahan',
        dateStr: getVal('admin-reception-date') || currentConfig.reception.dateStr,
        timeStr: getVal('admin-reception-time') || currentConfig.reception.timeStr,
        locationName: getVal('admin-reception-venue') || currentConfig.reception.locationName,
        locationAddress: getVal('admin-reception-address') || currentConfig.reception.locationAddress,
        mapsUrl: getVal('admin-reception-maps') || currentConfig.reception.mapsUrl,
        notes: currentConfig.reception.notes
      },
      loveStory: currentConfig.loveStory,
      bankAccounts: [
        {
          bankName: getVal('admin-bank1-name') || 'BCA',
          accountNumber: getVal('admin-bank1-number') || '8691823901',
          accountHolder: getVal('admin-bank1-holder') || currentConfig.groom.fullName
        },
        {
          bankName: getVal('admin-bank2-name') || 'Bank Mandiri',
          accountNumber: getVal('admin-bank2-number') || '1370019284721',
          accountHolder: getVal('admin-bank2-holder') || currentConfig.bride.fullName
        }
      ],
      qrisImageUrl: qrisImg,
      gallery: [
        {
          src: heroImg,
          caption: currentConfig.gallery[0]?.caption || 'Kisah kasih kedua mempelai',
          category: 'Prewedding'
        },
        {
          src: gal1Img,
          caption: getVal('admin-gallery1-caption') || currentConfig.gallery[1]?.caption || 'Foto Prewedding 1',
          category: 'Outdoor'
        },
        {
          src: gal2Img,
          caption: getVal('admin-gallery2-caption') || currentConfig.gallery[2]?.caption || 'Foto Prewedding 2',
          category: 'Intimate'
        },
        {
          src: groomImg,
          caption: getVal('admin-groom-name') || currentConfig.groom.fullName,
          category: 'Groom'
        },
        {
          src: brideImg,
          caption: getVal('admin-bride-name') || currentConfig.bride.fullName,
          category: 'Bride'
        }
      ],
      quranVerse: currentConfig.quranVerse
    };
  }

  // Save Button
  btnSave?.addEventListener('click', () => {
    try {
      const updatedConfig = collectFormValues();
      saveCustomInvitationData(updatedConfig);
      onDataUpdated(updatedConfig);
      closeDashboard();
      showToast('Perubahan data & foto berhasil disimpan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan data ke penyimpanan lokal', 'info');
    }
  });

  // Reset Button
  btnReset?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke setelan default awal?')) {
      resetCustomInvitationData();
      onDataUpdated(defaultInvitationData);
      populateFormValues(defaultInvitationData);
      closeDashboard();
      showToast('Data undangan telah direset ke default', 'info');
    }
  });

  // Copy Code for GitHub Button
  btnExportCopy?.addEventListener('click', () => {
    const code = exportInvitationDataCode(collectFormValues());
    copyToClipboard(code, 'Kode konfigurasi TypeScript');
  });
}

function setVal(id: string, val: string) {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  if (el) el.value = val;
}

function getVal(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  return el ? el.value.trim() : '';
}

function setImg(id: string, src: string) {
  const el = document.getElementById(id) as HTMLImageElement | null;
  if (el && src) el.src = src;
}
