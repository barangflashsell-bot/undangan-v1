import type { GalleryPhoto } from '../types';

export function initLightbox(photos: GalleryPhoto[]) {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal || !imgEl || !captionEl) return;

  let currentIndex = 0;

  function showPhoto(index: number) {
    if (index < 0) index = photos.length - 1;
    if (index >= photos.length) index = 0;
    currentIndex = index;

    imgEl!.src = photos[currentIndex].src;
    captionEl!.textContent = photos[currentIndex].caption;
    modal!.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal!.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind gallery triggers
  document.querySelectorAll('[data-gallery-index]').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-gallery-index') || '0', 10);
      showPhoto(idx);
    });
  });

  closeBtn?.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhoto(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhoto(currentIndex + 1);
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') hideModal();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
}
