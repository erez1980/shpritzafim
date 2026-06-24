(() => {
  const title = document.querySelector('.title');
  if (!title) return;

  let on = true;
  setInterval(() => {
    on = !on;
    title.style.opacity = on ? '1' : '.82';
  }, 1400);
})();
