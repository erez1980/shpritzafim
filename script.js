(function(){
  const btn = document.getElementById('sprayBtn');
  const pagesLink = document.getElementById('pagesLink');
  if(pagesLink){ pagesLink.textContent = 'GitHub Pages — מוכן לשפריץ'; }

  function spray(x, y){
    const droplets = 24 + Math.floor(Math.random()*10);
    for(let i=0;i<droplets;i++){
      const el = document.createElement('div');
      el.className = 'droplet';
      const angle = Math.random()*Math.PI; // half fan
      const speed = 80 + Math.random()*140;
      const dx = Math.cos(angle)*speed;
      const dy = Math.sin(angle)*speed - (40+Math.random()*40);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--dx', dx+'px');
      el.style.setProperty('--dy', dy+'px');
      el.style.animation = `pop ${0.9+Math.random()*0.3}s ease-out forwards`;
      document.body.appendChild(el);
      setTimeout(()=> el.remove(), 1200);
    }
  }

  function targetPoint(){
    const rect = btn.getBoundingClientRect();
    return {x: rect.left + rect.width/2, y: rect.bottom};
  }

  btn?.addEventListener('click', () => {
    const {x,y} = targetPoint();
    spray(x, y);
  });

  // Easter egg: spray on keypress 'S'
  document.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase() === 's'){
      const {x,y} = targetPoint();
      spray(x, y);
    }
  });
})();

