(function(){
  const canvas = document.getElementById('windshield');
  const ctx = canvas.getContext('2d');
  let W=0,H=0, t=0;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize); resize();

  // Windshield geometry (simple stylized Insight windshield)
  function drawGlass(){
    const w = Math.min(W*0.9, 960);
    const h = Math.min(H*0.6, 420);
    const x = (W-w)/2;
    const y = (H-h)/2;
    const r = Math.min(28, w*0.03);
    // glass
    const g = ctx.createLinearGradient(0,y,0,y+h);
    g.addColorStop(0,'#0f2036');
    g.addColorStop(1,'#0b172a');
    ctx.fillStyle = g;
    roundRect(ctx,x,y,w,h,r);
    ctx.fill();
    // subtle reflection
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#73f2ff';
    roundRect(ctx,x+10,y+10,w-20,h*0.35,r);
    ctx.fill();
    ctx.globalAlpha = 1;
    return {x,y,w,h};
  }

  function roundRect(c,x,y,w,h,r){
    c.beginPath();
    c.moveTo(x+r,y);
    c.arcTo(x+w,y,x+w,y+h,r);
    c.arcTo(x+w,y+h,x,y+h,r);
    c.arcTo(x,y+h,x,y,r);
    c.arcTo(x,y,x+w,y,r);
    c.closePath();
  }

  // Wipers
  function drawWipers(glass){
    const {x,y,w,h} = glass;
    const baseY = y + h - 18;
    const baseXL = x + w*0.42;
    const baseXR = x + w*0.58;
    const len = w*0.38;
    const sweep = Math.PI*0.75;
    const speed = 1.1; // Hz
    const phase = Math.sin(t*speed)*0.5+0.5; // 0..1
    const angleL = -Math.PI*0.55 + phase*sweep*0.5;
    const angleR = Math.PI*1.55 - phase*sweep*0.5;

    ctx.lineCap='round';
    ctx.strokeStyle='#9db3d5';
    ctx.lineWidth=5;

    // left
    ctx.beginPath();
    ctx.moveTo(baseXL, baseY);
    ctx.lineTo(baseXL + Math.cos(angleL)*len, baseY + Math.sin(angleL)*len);
    ctx.stroke();
    // right
    ctx.beginPath();
    ctx.moveTo(baseXR, baseY);
    ctx.lineTo(baseXR + Math.cos(angleR)*len, baseY + Math.sin(angleR)*len);
    ctx.stroke();

    return {nozzleL:[x+w*0.48, baseY-6], nozzleR:[x+w*0.52, baseY-6]};
  }

  // Spray particles
  const drops=[];
  function emitSpray(p, dir){
    for(let i=0;i<40;i++){
      const a = dir + (Math.random()-0.5)*0.5;
      const v = 210 + Math.random()*90;
      drops.push({
        x:p[0], y:p[1],
        vx:Math.cos(a)*v,
        vy:Math.sin(a)*v - 60*Math.random(),
        life:0.9+Math.random()*0.6,
        age:0
      });
    }
  }

  function step(dt, glass){
    for(let i=drops.length-1;i>=0;i--){
      const d=drops[i];
      d.age+=dt; if(d.age>d.life){ drops.splice(i,1); continue; }
      d.vy+= 300*dt; // gravity-ish
      d.x+=d.vx*dt; d.y+=d.vy*dt;
      // fade if outside glass
      if(d.y > glass.y+glass.h || d.y < glass.y || d.x < glass.x || d.x > glass.x+glass.w){
        d.age = d.life;
      }
    }
  }

  function render(glass){
    // spray
    for(const d of drops){
      const k = 1 - d.age/d.life;
      ctx.globalAlpha = Math.max(k,0)*0.9;
      ctx.fillStyle = '#73f2ff';
      ctx.beginPath();
      ctx.arc(d.x,d.y, 2.2, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  let acc=0, last=performance.now();
  function loop(now){
    const dt = (now-last)/1000; last=now; t+=dt; acc+=dt;
    ctx.clearRect(0,0,W,H);
    const glass = drawGlass();
    const points = drawWipers(glass);
    // periodic spray bursts
    if(Math.floor(t)%3===0 && acc>0.8){
      emitSpray(points.nozzleL, -Math.PI*0.5);
      emitSpray(points.nozzleR, -Math.PI*0.5);
      acc=0;
    }
    step(dt, glass);
    render(glass);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
