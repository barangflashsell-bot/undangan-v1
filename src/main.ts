import './style.css';
import confetti from 'canvas-confetti';
import type { InvitationConfig } from './types';
import { getActiveInvitationData } from './data/invitationData';
import { getGuestName, setupGuestEditor } from './modules/guest';
import { initCountdown, createGoogleCalendarUrl } from './modules/countdown';
import { audioEngine, setupAudioPlayerUI } from './modules/audioPlayer';
import { initPetals } from './modules/petals';
import { initLightbox } from './modules/lightbox';
import { initRsvp } from './modules/rsvp';
import { initAdmin } from './modules/admin';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Data
  let currentData = getActiveInvitationData();

  // 2. Set personalized guest name & editor
  const guestName = getGuestName();
  const guestNameEl = document.getElementById('guest-name-cover');
  if (guestNameEl) {
    guestNameEl.textContent = guestName;
  }
  setupGuestEditor(() => `${currentData.groom.shortName} & ${currentData.bride.shortName}`);

  // 3. Render dynamic content based on InvitationConfig
  function renderInvitationUI(data: InvitationConfig) {
    currentData = data;

    // Apply Active Theme
    const activeTheme = data.theme || 'emerald-gold';
    document.documentElement.setAttribute('data-theme', activeTheme);

    // Cover
    const coverTitle = document.getElementById('cover-title');
    if (coverTitle) {
      coverTitle.innerHTML = `${data.groom.shortName} <span>&amp;</span> ${data.bride.shortName}`;
    }
    const coverDate = document.getElementById('cover-date');
    if (coverDate) {
      coverDate.textContent = data.akad.dateStr;
    }

    // Hero Section
    const heroImg = document.getElementById('dom-hero-img') as HTMLImageElement | null;
    if (heroImg && data.gallery[0]) {
      heroImg.src = data.gallery[0].src;
    }
    const heroNames = document.getElementById('dom-hero-names');
    if (heroNames) {
      heroNames.textContent = `${data.groom.shortName} & ${data.bride.shortName}`;
    }

    // Groom
    const groomImg = document.getElementById('dom-groom-img') as HTMLImageElement | null;
    if (groomImg) groomImg.src = data.groom.photoUrl;
    setText('dom-groom-fullname', data.groom.fullName);
    setText('dom-groom-father', data.groom.fatherName);
    setText('dom-groom-mother', data.groom.motherName);
    setText('dom-groom-ig-text', `@${data.groom.instagram || 'groom'}`);
    const groomIgLink = document.getElementById('dom-groom-ig-link') as HTMLAnchorElement | null;
    if (groomIgLink) groomIgLink.href = `https://instagram.com/${data.groom.instagram || ''}`;

    // Bride
    const brideImg = document.getElementById('dom-bride-img') as HTMLImageElement | null;
    if (brideImg) brideImg.src = data.bride.photoUrl;
    setText('dom-bride-fullname', data.bride.fullName);
    setText('dom-bride-father', data.bride.fatherName);
    setText('dom-bride-mother', data.bride.motherName);
    setText('dom-bride-ig-text', `@${data.bride.instagram || 'bride'}`);
    const brideIgLink = document.getElementById('dom-bride-ig-link') as HTMLAnchorElement | null;
    if (brideIgLink) brideIgLink.href = `https://instagram.com/${data.bride.instagram || ''}`;

    // Countdown & Google Calendar
    initCountdown(new Date(data.eventDate));
    const btnCalendar = document.getElementById('btn-calendar') as HTMLAnchorElement | null;
    if (btnCalendar) {
      btnCalendar.href = createGoogleCalendarUrl(
        `The Wedding of ${data.groom.shortName} & ${data.bride.shortName}`,
        new Date(data.eventDate),
        `Pernikahan ${data.groom.fullName} & ${data.bride.fullName} di ${data.reception.locationName}.`,
        `${data.reception.locationName}, ${data.reception.locationAddress}`
      );
    }

    // Akad
    setText('dom-akad-time', data.akad.timeStr);
    setText('dom-akad-date', data.akad.dateStr);
    setText('dom-akad-venue', data.akad.locationName);
    setText('dom-akad-address', data.akad.locationAddress);
    const akadMaps = document.getElementById('dom-akad-maps') as HTMLAnchorElement | null;
    if (akadMaps) akadMaps.href = data.akad.mapsUrl;

    // Reception
    setText('dom-reception-time', data.reception.timeStr);
    setText('dom-reception-date', data.reception.dateStr);
    setText('dom-reception-venue', data.reception.locationName);
    setText('dom-reception-address', data.reception.locationAddress);
    const receptionMaps = document.getElementById('dom-reception-maps') as HTMLAnchorElement | null;
    if (receptionMaps) receptionMaps.href = data.reception.mapsUrl;

    // Bank Accounts
    if (data.bankAccounts[0]) {
      setText('dom-bank1-brand', data.bankAccounts[0].bankName);
      setText('dom-bank1-num', formatCardNumber(data.bankAccounts[0].accountNumber));
      setText('dom-bank1-holder', data.bankAccounts[0].accountHolder);
      const btn1 = document.getElementById('dom-bank1-btn');
      btn1?.setAttribute('data-copy-account', data.bankAccounts[0].accountNumber);
      btn1?.setAttribute('data-bank', data.bankAccounts[0].bankName);
    }
    if (data.bankAccounts[1]) {
      setText('dom-bank2-brand', data.bankAccounts[1].bankName);
      setText('dom-bank2-num', formatCardNumber(data.bankAccounts[1].accountNumber));
      setText('dom-bank2-holder', data.bankAccounts[1].accountHolder);
      const btn2 = document.getElementById('dom-bank2-btn');
      btn2?.setAttribute('data-copy-account', data.bankAccounts[1].accountNumber);
      btn2?.setAttribute('data-bank', data.bankAccounts[1].bankName);
    }

    // QRIS
    const qrisImg = document.getElementById('dom-qris-img') as HTMLImageElement | null;
    if (qrisImg) qrisImg.src = data.qrisImageUrl;

    // Gallery
    for (let i = 0; i < data.gallery.length; i++) {
      const imgEl = document.getElementById(`dom-gal-${i}`) as HTMLImageElement | null;
      const capEl = document.getElementById(`dom-gal-cap-${i}`);
      if (imgEl && data.gallery[i]) imgEl.src = data.gallery[i].src;
      if (capEl && data.gallery[i]) capEl.textContent = data.gallery[i].caption;
    }

    // Footer
    setText('dom-footer-couple', `${data.groom.shortName} & ${data.bride.shortName}`);

    // Re-bind Lightbox with active gallery
    initLightbox(data.gallery);
  }

  function setText(id: string, text: string) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function formatCardNumber(num: string): string {
    return num.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // 4. Initial Render
  renderInvitationUI(currentData);

  // 5. Initialize background canvas petals
  initPetals('petals-canvas');

  // 6. Initialize RSVP form & live wishes
  initRsvp();

  // 7. Initialize Admin Menu with Live UI sync callback
  initAdmin((newData) => {
    renderInvitationUI(newData);
  });

  // 8. Setup audio player UI controller
  const audioController = setupAudioPlayerUI();

  // 9. Handle "Buka Undangan" action
  const btnOpen = document.getElementById('btn-open-invitation');
  const coverScreen = document.getElementById('cover-screen');
  const musicControl = document.getElementById('music-control');

  btnOpen?.addEventListener('click', () => {
    audioEngine.start();
    if (audioController) {
      audioController.updateUiState(true);
    }

    coverScreen?.classList.add('opened');
    musicControl?.classList.remove('hidden');

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f5ebd2', '#e8d3a7', '#ffffff']
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
