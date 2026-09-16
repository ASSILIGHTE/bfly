/**
 * A LITTLE SOMETHING FOR YOU ❤️
 * Mind-Blowing 3D Interactive Scrapbook & 3D Organic Free-Flight Butterfly Engine 🦋
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const pages = document.querySelectorAll('.page');
  const btnPage1 = document.getElementById('btn-page1');
  const btnPage2 = document.getElementById('btn-page2');
  const btnPage3 = document.getElementById('btn-page3');
  const btnSurprise = document.getElementById('btn-surprise');
  const surpriseToast = document.getElementById('surprise-toast');
  const btnRestart = document.getElementById('btn-restart');
  const p4Intro = document.getElementById('p4-intro');
  const p4Main = document.getElementById('p4-main');

  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const confettiContainer = document.getElementById('confetti-container');

  // Envelope Elements
  const waxSeal = document.getElementById('wax-seal');
  const envelopeWrapper = document.getElementById('envelope-wrapper');

  // 3D Flip Cards
  const flipCards = document.querySelectorAll('.flip-card');

  // Photo Modal Elements
  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const photoTriggers = document.querySelectorAll('.photo-trigger');

  let currentPage = 1;
  let audioStarted = false;
  let p4Timeout = null;

  // --------------------------------------------------------------------------
  // Interactive 3D Love Envelope Opening Handler 💌
  // --------------------------------------------------------------------------
  function openEnvelope() {
    if (envelopeWrapper && !envelopeWrapper.classList.contains('open')) {
      playPopSound();
      envelopeWrapper.classList.add('open');
      spawn3DButterflies(window.innerWidth / 2, window.innerHeight / 2, 14);
      createHeartBurst(15);
    }
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (envelopeWrapper) envelopeWrapper.addEventListener('click', openEnvelope);

  // --------------------------------------------------------------------------
  // 3D Flip Cards Click Listener 🫶
  // --------------------------------------------------------------------------
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      playPopSound();
      card.classList.toggle('flipped');
    });
  });

  // --------------------------------------------------------------------------
  // Photo Modal / Lightbox Handlers 📸
  // --------------------------------------------------------------------------
  photoTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = trigger.getAttribute('data-img');
      const captionText = trigger.getAttribute('data-caption') || 'Special Memory ❤️';

      if (imgSrc) {
        modalImg.src = imgSrc;
        modalCaption.textContent = captionText;
        photoModal.classList.remove('hidden');
        playPopSound();
      }
    });
  });

  function closeModal() {
    photoModal.classList.add('hidden');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !photoModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 3D Organic Free-Flight Butterfly Canvas Engine (360° Free Flying Physics) 🦋
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let particles = [];
  let butterflies = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // 3D Free-Flight Butterfly Class
  class Butterfly3D {
    constructor(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * canvas.width;
      this.y = y !== undefined ? y : Math.random() * canvas.height;
      this.size = Math.random() * 8 + 11;

      // 360-degree free flight angle (random organic directions!)
      this.angle = Math.random() * Math.PI * 2;
      this.speed = isBurst ? Math.random() * 3.2 + 1.5 : Math.random() * 1.3 + 0.7;

      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;

      this.wingAngle = Math.random() * Math.PI * 2;
      this.wingSpeed = Math.random() * 0.22 + 0.16; // 3D Flapping Frequency

      // Organic curved flight steering
      this.turnPhase = Math.random() * Math.PI * 2;
      this.turnSpeed = Math.random() * 0.03 + 0.01;

      this.opacity = Math.random() * 0.35 + 0.65;
      this.life = 1;
      this.isBurst = isBurst;
      this.decay = isBurst ? Math.random() * 0.02 + 0.012 : 0;
      this.colorMain = ['#b83253', '#c97a8e', '#ff758f', '#d4af37'][Math.floor(Math.random() * 4)];
      this.colorSub = ['#ffd1dc', '#fff0f3', '#f7eae5', '#ffffff'][Math.floor(Math.random() * 4)];
    }

    update() {
      this.wingAngle += this.wingSpeed;

      // Smooth 360-degree organic direction steering (curves & flutters in all directions!)
      this.turnPhase += this.turnSpeed;
      this.angle += Math.sin(this.turnPhase) * 0.045 + (Math.random() - 0.5) * 0.03;

      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;

      this.x += this.vx;
      this.y += this.vy;

      if (this.isBurst) {
        this.speed *= 0.97;
        this.life -= this.decay;
        this.opacity = Math.max(0, this.life);
      } else {
        // Seamless 360-degree screen wrap
        if (this.x < -35) this.x = canvas.width + 35;
        if (this.x > canvas.width + 35) this.x = -35;
        if (this.y < -35) this.y = canvas.height + 35;
        if (this.y > canvas.height + 35) this.y = -35;
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);

      // Rotate body to match 360-degree flight vector!
      ctx.rotate(this.angle + Math.PI / 2);

      // Calculate 3D Wing Flap scale
      const wingScaleX = Math.abs(Math.cos(this.wingAngle));

      // Draw Left Wing
      ctx.save();
      ctx.scale(wingScaleX, 1);
      ctx.fillStyle = this.colorMain;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * 1.2, -this.size * 1.4, -this.size * 1.8, 0, 0, this.size * 0.5);
      ctx.fill();

      ctx.fillStyle = this.colorSub;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * 0.8, -this.size * 0.9, -this.size * 1.2, 0, 0, this.size * 0.4);
      ctx.fill();
      ctx.restore();

      // Draw Right Wing
      ctx.save();
      ctx.scale(-wingScaleX, 1);
      ctx.fillStyle = this.colorMain;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * 1.2, -this.size * 1.4, -this.size * 1.8, 0, 0, this.size * 0.5);
      ctx.fill();

      ctx.fillStyle = this.colorSub;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * 0.8, -this.size * 0.9, -this.size * 1.2, 0, 0, this.size * 0.4);
      ctx.fill();
      ctx.restore();

      // Draw Body & Antenna
      ctx.fillStyle = '#7a1c32';
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.8, this.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antenna
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.4);
      ctx.lineTo(-4, -this.size * 0.8);
      ctx.moveTo(0, -this.size * 0.4);
      ctx.lineTo(4, -this.size * 0.8);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Native 3D Tumbling Sakura Petal Class 🌸
  class Petal3D {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 6 + 7;
      this.speedY = Math.random() * 0.8 + 0.35;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.035;
      this.opacity = Math.random() * 0.4 + 0.5;
      this.color = ['#ffb7c5', '#ffc0cb', '#f8bbd0', '#ffd1dc'][Math.floor(Math.random() * 4)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.012) * 0.7 + this.speedX;
      this.rot += this.rotSpeed;

      if (this.y > canvas.height + 25) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.scale(1, Math.sin(this.rot) * 0.5 + 0.5);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(-this.size * 0.85, -this.size * 0.45, -this.size * 0.85, this.size * 0.45, 0, this.size);
      ctx.bezierCurveTo(this.size * 0.85, this.size * 0.45, this.size * 0.85, -this.size * 0.45, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  // Native 3D Blooming Rose Flower Class 🌹
  class Flower3D {
    constructor(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * canvas.width;
      this.y = y !== undefined ? y : (isBurst ? y : canvas.height + 30);
      this.size = Math.random() * 10 + 14;
      this.speedY = isBurst ? Math.random() * 1.5 + 0.8 : Math.random() * 0.7 + 0.3;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.bloomScale = isBurst ? 0.2 : 0.6 + Math.random() * 0.4;
      this.maxBloom = Math.random() * 0.4 + 0.8;
      this.opacity = 1;
      this.isBurst = isBurst;
      this.decay = isBurst ? Math.random() * 0.012 + 0.008 : 0;
      this.petalColor1 = ['#ff758f', '#b83253', '#e63946', '#d81b60'][Math.floor(Math.random() * 4)];
      this.petalColor2 = ['#ffd1dc', '#ffb7c5', '#f8bbd0', '#ffffff'][Math.floor(Math.random() * 4)];
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.015) * 0.6 + this.speedX;
      this.rot += this.rotSpeed;

      if (this.bloomScale < this.maxBloom) {
        this.bloomScale += 0.012;
      }

      if (this.isBurst) {
        this.opacity -= this.decay;
      } else if (this.y < -40) {
        this.y = canvas.height + 40;
        this.x = Math.random() * canvas.width;
        this.bloomScale = 0.3;
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.scale(this.bloomScale, this.bloomScale);
      ctx.globalAlpha = Math.max(0, this.opacity);

      // Draw 6 Outer Petals in 3D perspective
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);
        ctx.fillStyle = this.petalColor1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size * 0.7, -this.size * 1.1, -this.size * 1.2, -this.size * 0.4, 0, -this.size * 1.3);
        ctx.bezierCurveTo(this.size * 1.2, -this.size * 0.4, this.size * 0.7, -this.size * 1.1, 0, 0);
        ctx.fill();

        // Inner Petal Highlight
        ctx.fillStyle = this.petalColor2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size * 0.4, -this.size * 0.7, -this.size * 0.7, -this.size * 0.3, 0, -this.size * 0.9);
        ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.4, -this.size * 0.7, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      // Golden Stamen Center
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Native Stardust Particle
  class StardustParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 5 + 3;
      this.speedY = Math.random() * 0.6 + 0.3;
      this.swayFreq = Math.random() * 0.02 + 0.01;
      this.swayAmp = Math.random() * 1.2 + 0.3;
      this.swayPhase = Math.random() * 6.28;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.color = ['#d4af37', '#e6c594', '#ffffff'][Math.floor(Math.random() * 3)];
    }

    update() {
      this.swayPhase += this.swayFreq;
      this.x += Math.sin(this.swayPhase) * this.swayAmp;
      this.y -= this.speedY;

      if (this.y < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize Particles (6 3D Flowers + 10 Petals + 10 Stardust + 10 Free-Flight Butterflies)
  let petals = [];
  let flowers = [];
  const flowerCount = window.innerWidth < 600 ? 4 : 6;
  const petalCount = window.innerWidth < 600 ? 6 : 10;
  const stardustCount = window.innerWidth < 600 ? 8 : 12;
  const butterflyCount = window.innerWidth < 600 ? 8 : 12;

  for (let i = 0; i < flowerCount; i++) {
    flowers.push(new Flower3D());
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal3D());
  }

  for (let i = 0; i < stardustCount; i++) {
    particles.push(new StardustParticle());
  }

  for (let i = 0; i < butterflyCount; i++) {
    butterflies.push(new Butterfly3D());
  }

  function spawn3DButterflies(x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      if (butterflies.length < 45) {
        butterflies.push(new Butterfly3D(x, y, true));
      }
    }
  }

  function spawn3DFlowers(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      if (flowers.length < 25) {
        flowers.push(new Flower3D(x, y, true));
      }
    }
  }

  // Render Loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = flowers.length - 1; i >= 0; i--) {
      const fl = flowers[i];
      fl.update();
      fl.draw();
      if (fl.isBurst && fl.opacity <= 0) flowers.splice(i, 1);
    }

    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (let i = butterflies.length - 1; i >= 0; i--) {
      const bf = butterflies[i];
      bf.update();
      bf.draw();
      if (bf.isBurst && bf.opacity <= 0) butterflies.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }

  loop();

  // --------------------------------------------------------------------------
  // Audio Player Control (Vinyl Player)
  // --------------------------------------------------------------------------
  function playAudio() {
    if (!audioStarted) {
      bgMusic.volume = 0.5;
      bgMusic.play().then(() => {
        audioStarted = true;
        musicToggle.classList.add('playing');
      }).catch(err => {
        console.log('Autoplay prevented:', err);
      });
    }
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      audioStarted = true;
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  // --------------------------------------------------------------------------
  // Fullscreen Mode Handler ⛶
  // --------------------------------------------------------------------------
  const fullscreenToggle = document.getElementById('fullscreen-toggle');
  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
      playPopSound();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log('Fullscreen error:', err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Web Audio Synth FX
  // --------------------------------------------------------------------------
  function playPopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // Confetti Layer
  // --------------------------------------------------------------------------
  function createHeartBurst(count = 20) {
    const emojis = ['❤️', '💖', '✨', '💕', '🦋', '🌸'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-heart';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const left = 10 + Math.random() * 80;
      el.style.left = `${left}vw`;
      el.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
      el.style.animationDelay = `${Math.random() * 0.2}s`;

      confettiContainer.appendChild(el);

      setTimeout(() => {
        el.remove();
      }, 3000);
    }
  }

  // --------------------------------------------------------------------------
  // Navigation & Page Manager
  // --------------------------------------------------------------------------
  function goToPage(pageNumber) {
    playPopSound();
    playAudio();

    pages.forEach((page, idx) => {
      if (idx + 1 === pageNumber) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    currentPage = pageNumber;

    if (pageNumber === 4) {
      triggerPage4Sequence();
    } else {
      document.body.classList.remove('warm-bg');
      if (p4Timeout) clearTimeout(p4Timeout);
      p4Intro.classList.remove('fade-out');
      p4Main.classList.add('hidden');
    }
  }

  function triggerPage4Sequence() {
    p4Intro.classList.remove('fade-out');
    p4Main.classList.add('hidden');

    p4Timeout = setTimeout(() => {
      p4Intro.classList.add('fade-out');
      
      setTimeout(() => {
        p4Main.classList.remove('hidden');
        document.body.classList.add('warm-bg');
        spawn3DButterflies(window.innerWidth / 2, window.innerHeight / 2, 25);
        createHeartBurst(25);
      }, 500);
    }, 2000);
  }

  // Button Listeners
  btnPage1.addEventListener('click', (e) => {
    spawn3DButterflies(e.clientX, e.clientY);
    createHeartBurst(15);
    goToPage(2);
  });

  btnPage2.addEventListener('click', (e) => {
    spawn3DButterflies(e.clientX, e.clientY);
    goToPage(3);
  });

  btnPage3.addEventListener('click', (e) => {
    spawn3DButterflies(e.clientX, e.clientY);
    goToPage(4);
  });

  // Page 3 "Klik aku ❤️" Interaction
  btnSurprise.addEventListener('click', (e) => {
    playPopSound();
    spawn3DButterflies(e.clientX, e.clientY, 20);
    createHeartBurst(30);
    surpriseToast.classList.remove('hidden');
    
    surpriseToast.style.animation = 'none';
    void surpriseToast.offsetWidth;
    surpriseToast.style.animation = 'toastPop 0.4s ease forwards';
  });

  // Restart Button
  btnRestart.addEventListener('click', () => {
    goToPage(1);
    if (surpriseToast) surpriseToast.classList.add('hidden');
    if (envelopeWrapper) envelopeWrapper.classList.remove('open');
  });

  // --------------------------------------------------------------------------
  // Interactive Floating Stickers & Mouse/Touch Trail 💕✨
  // --------------------------------------------------------------------------
  const cuteStickers = document.querySelectorAll('.cute-sticker');
  cuteStickers.forEach(sticker => {
    sticker.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSound();
      spawn3DButterflies(e.clientX, e.clientY, 8);
      createHeartBurst(8);
      
      sticker.style.transform = 'scale(1.3) rotate(15deg)';
      setTimeout(() => {
        sticker.style.transform = '';
      }, 350);
    });
  });

  let lastTrailTime = 0;
  const trailEmojis = ['❤️', '💕', '✨', '🌸', '💖'];

  function createCursorTrail(x, y) {
    const now = Date.now();
    if (now - lastTrailTime < 65) return;
    lastTrailTime = now;

    const el = document.createElement('div');
    el.className = 'mouse-heart-trail';
    el.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1200);
  }

  window.addEventListener('mousemove', (e) => {
    createCursorTrail(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      createCursorTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  // 3D Blooming Flower Click Listener 🌹
  const flower3DWrappers = document.querySelectorAll('.flower-3d-wrapper');
  flower3DWrappers.forEach(flower => {
    flower.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSound();
      spawn3DFlowers(e.clientX, e.clientY, 8);
      spawn3DButterflies(e.clientX, e.clientY, 10);
      createHeartBurst(10);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.closest('.modal-content') || e.target.closest('.btn-primary') || e.target.closest('.btn-interactive') || e.target.closest('.cute-sticker') || e.target.closest('#wax-seal') || e.target.closest('.flower-3d-wrapper')) return;
    spawn3DButterflies(e.clientX, e.clientY, 3);
    spawn3DFlowers(e.clientX, e.clientY, 2);
  });

});


