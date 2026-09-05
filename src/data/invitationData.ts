import type { InvitationConfig } from '../types';

export const invitationData: InvitationConfig = {
  groom: {
    fullName: 'Raden Bayu Pratama, S.T.',
    shortName: 'Bayu',
    photoUrl: '/images/groom.jpg',
    fatherName: 'Bpk. H. Bambang Sujatmo',
    motherName: 'Ibu Hj. Sri Rahayu',
    instagram: 'bayu.pratama',
    bio: 'Putra pertama dari dua bersaudara yang berprofesi sebagai Software Engineer dan penikmat seni arsitektur nusantara.'
  },
  bride: {
    fullName: 'Sarah Anindya Putri, S.Ds.',
    shortName: 'Sara',
    photoUrl: '/images/bride.jpg',
    fatherName: 'Bpk. Ir. Hendro Kusumo',
    motherName: 'Ibu Hj. Ratna Juwita',
    instagram: 'sarah.anindya',
    bio: 'Putri kedua dari tiga bersaudara yang berprofesi sebagai Interior Designer dan pecinta flora nusantara.'
  },
  // Set date to a future wedding date
  eventDate: new Date('2026-11-14T08:00:00+07:00'),
  akad: {
    title: 'Akad Nikah',
    dateStr: 'Sabtu, 14 November 2026',
    timeStr: '08:00 - 10:00 WIB',
    locationName: 'Masjid Agung Sunda Kelapa',
    locationAddress: 'Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat',
    mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Sunda+Kelapa+Jakarta',
    notes: 'Diharapkan hadir 15 menit sebelum acara dimulai dengan khidmat.'
  },
  reception: {
    title: 'Resepsi Pernikahan',
    dateStr: 'Sabtu, 14 November 2026',
    timeStr: '11:00 - 14:00 WIB',
    locationName: 'Grand Ballroom Hotel Indonesia Kempinski',
    locationAddress: 'Jl. M.H. Thamrin No.1, Menteng, Kota Jakarta Pusat',
    mapsUrl: 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
    notes: 'Dress code: Formal Modern / Batik Elegance'
  },
  loveStory: [
    {
      year: '2020',
      title: 'Pertemuan Pertama',
      description: 'Bertemu di sebuah pameran seni dan desain arsitektur di Jakarta. Secangkir kopi hangat menjadi awal perbincangan kami yang penuh kehangatan.',
      icon: 'sparkles'
    },
    {
      year: '2022',
      title: 'Menjalin Komitmen',
      description: 'Setelah saling mengenal dan berbagi mimpi, kami memutuskan untuk saling mendampingi dan melangkah bersama dalam perjalanan cinta.',
      icon: 'heart'
    },
    {
      year: '2024',
      title: 'Momen Lamaran',
      description: 'Di bawah pemandangan bukit yang tenang dan disaksikan keluarga tercinta, kami memantapkan niat suci untuk melangkah ke jenjang pernikahan.',
      icon: 'ring'
    },
    {
      year: '2026',
      title: 'Hari Bahagia',
      description: 'Dengan memohon ridho Allah SWT, kami mengikat janji suci sehidup sesurga dalam ikatan pernikahan.',
      icon: 'church'
    }
  ],
  bankAccounts: [
    {
      bankName: 'BCA',
      accountNumber: '8691823901',
      accountHolder: 'Raden Bayu Pratama'
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '1370019284721',
      accountHolder: 'Sarah Anindya Putri'
    }
  ],
  qrisImageUrl: '/images/qris.jpg',
  gallery: [
    {
      src: '/images/hero.jpg',
      caption: 'Kisah kasih di antara hijaunya rumah kaca botanika',
      category: 'Prewedding'
    },
    {
      src: '/images/gallery-1.jpg',
      caption: 'Menatap masa depan bersama di hamparan lembah emas',
      category: 'Outdoor'
    },
    {
      src: '/images/gallery-2.jpg',
      caption: 'Canda dan tawa dalam kehangatan malam',
      category: 'Intimate'
    },
    {
      src: '/images/groom.jpg',
      caption: 'Raden Bayu Pratama, S.T.',
      category: 'Groom'
    },
    {
      src: '/images/bride.jpg',
      caption: 'Sarah Anindya Putri, S.Ds.',
      category: 'Bride'
    }
  ],
  quranVerse: {
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    translation: '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”',
    surah: 'QS. Ar-Rum: 21'
  }
};
