import './style.css';
import confetti from 'canvas-confetti';
import { invitationData } from './data/invitationData';
import { getGuestName } from './modules/guest';
import { initCountdown, createGoogleCalendarUrl } from './modules/countdown';
import { audioEngine, setupAudioPlayerUI } from './modules/audioPlayer';
import { initPetals } from './modules/petals';
import { initLightbox } from './modules/lightbox';
import { initRsvp } from './modules/rsvp';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set personalized guest name
  const guestName = getGuestName();
  const guestNameEl = document.getElementById('guest-name-cover');
  if (guestNameEl) {
    guestNameEl.textContent = guestName;
  }

  // 2. Initialize live countdown timer
  initCountdown(invitationData.eventDate);

  // 3. Set Google Calendar URL
  const btnCalendar = document.getElementById('btn-calendar') as HTMLAnchorElement | null;
  if (btnCalendar) {
    btnCalendar.href = createGoogleCalendarUrl(
      'The Wedding of Bayu & Sara',
      invitationData.eventDate,
      'Pernikahan Raden Bayu Pratama, S.T. & Sarah Anindya Putri, S.Ds. di Hotel Indonesia Kempinski Jakarta.',
      invitationData.reception.locationName + ', ' + invitationData.reception.locationAddress
    );
  }

  // 4. Initialize floating falling petals effect
  initPetals('petals-canvas');

  // 5. Initialize photo gallery lightbox
  initLightbox(invitationData.gallery);

  // 6. Initialize RSVP form & live wishes
  initRsvp();

  // 7. Setup audio player UI controller
  const audioController = setupAudioPlayerUI();

  // 8. Handle "Buka Undangan" action
  const btnOpen = document.getElementById('btn-open-invitation');
  const coverScreen = document.getElementById('cover-screen');
  const musicControl = document.getElementById('music-control');

  btnOpen?.addEventListener('click', () => {
    // Start background romantic music
    audioEngine.start();
    if (audioController) {
      audioController.updateUiState(true);
    }

    // Hide cover screen with smooth transition
    coverScreen?.classList.add('opened');

    // Show floating music toggle
    musicControl?.classList.remove('hidden');

    // Celebration gold confetti shower
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f5ebd2', '#e8d3a7', '#ffffff']
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
