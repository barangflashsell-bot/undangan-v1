export function initCountdown(targetDate: Date) {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      daysEl!.innerText = '00';
      hoursEl!.innerText = '00';
      minutesEl!.innerText = '00';
      secondsEl!.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl!.innerText = days < 10 ? `0${days}` : `${days}`;
    hoursEl!.innerText = hours < 10 ? `0${hours}` : `${hours}`;
    minutesEl!.innerText = minutes < 10 ? `0${minutes}` : `${minutes}`;
    secondsEl!.innerText = seconds < 10 ? `0${seconds}` : `${seconds}`;
  }

  update();
  setInterval(update, 1000);
}

export function createGoogleCalendarUrl(
  title: string,
  startDate: Date,
  details: string,
  location: string
): string {
  // Format YYYYMMDDTHHmmssZ
  const formatDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // 5 hours duration

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: details,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
