(() => {
  const reveals = Array.from(document.querySelectorAll('.glass-card, .quote-box, .timeline-list article, .final-cta, .stats article'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  reveals.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
    observer.observe(el);
  });

  const badge = document.querySelector('.badge');
  const titles = [
    'מהדורת שחר בעל הנס',
    'היכל השפריצר הלאומי',
    'מאושר על ידי ועדת הרסס',
    'Premium Windshield Energy'
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % titles.length;
    if (badge) badge.textContent = titles[i];
  }, 2200);
})();
