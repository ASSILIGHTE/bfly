import React, { useState, useRef, useEffect } from 'react';
import Canvas3D from './components/Canvas3D';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isWarmBg, setIsWarmBg] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [p4IntroOut, setP4IntroOut] = useState(false);
  const [p4MainVisible, setP4MainVisible] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, img: '', caption: '' });
  const [flippedCards, setFlippedCards] = useState([false, false, false]);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Web Audio Synth FX
  const playPopSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  // Music Player Toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => console.log('Autoplay prevented:', err));
    } else {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }
  };

  const playAudioIfNeeded = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    playPopSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Page Transitions
  const goToPage = (pageNumber) => {
    playPopSound();
    playAudioIfNeeded();
    setCurrentPage(pageNumber);

    if (pageNumber === 4) {
      setP4IntroOut(false);
      setP4MainVisible(false);
      setTimeout(() => {
        setP4IntroOut(true);
        setTimeout(() => {
          setP4MainVisible(true);
          setIsWarmBg(true);
          if (canvasRef.current) {
            canvasRef.current.spawnButterflies(window.innerWidth / 2, window.innerHeight / 2, 25);
            canvasRef.current.spawnFlowers(window.innerWidth / 2, window.innerHeight / 2, 8);
          }
        }, 500);
      }, 2000);
    } else {
      setIsWarmBg(false);
      setP4IntroOut(false);
      setP4MainVisible(false);
    }
  };

  // Envelope Opening
  const handleOpenEnvelope = () => {
    if (!isEnvelopeOpen) {
      playPopSound();
      setIsEnvelopeOpen(true);
      if (canvasRef.current) {
        canvasRef.current.spawnButterflies(window.innerWidth / 2, window.innerHeight / 2, 14);
        canvasRef.current.spawnFlowers(window.innerWidth / 2, window.innerHeight / 2, 5);
      }
    }
  };

  // Flip Card Handler
  const toggleFlipCard = (index) => {
    playPopSound();
    setFlippedCards(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Photo Lightbox Trigger
  const openModal = (imgSrc, captionText) => {
    playPopSound();
    setModalState({ isOpen: true, img: imgSrc, caption: captionText || 'Special Memory ❤️' });
  };

  const closeModal = () => setModalState({ isOpen: false, img: '', caption: '' });

  // Sticker Click Trigger
  const handleStickerClick = (e) => {
    e.stopPropagation();
    playPopSound();
    if (canvasRef.current) {
      canvasRef.current.spawnButterflies(e.clientX, e.clientY, 8);
      canvasRef.current.spawnFlowers(e.clientX, e.clientY, 4);
    }
  };

  // Cursor Heart Trail
  useEffect(() => {
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

    const handleMouseMove = (e) => createCursorTrail(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) createCursorTrail(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className={`app-root ${isWarmBg ? 'warm-bg' : ''}`}>
      {/* 3D Canvas Layer */}
      <Canvas3D ref={canvasRef} />

      {/* Floating Fullscreen Button */}
      <button className="fullscreen-btn" onClick={toggleFullscreen} title="Layar Penuh (Fullscreen)">
        <span className="fs-icon">⛶</span>
        <span className="fs-text">Full Screen</span>
      </button>

      {/* Vinyl Music Player Widget */}
      <div className={`vinyl-widget ${isPlayingMusic ? 'playing' : ''}`} onClick={toggleMusic} title="Putar / Hentikan Musik">
        <div className="vinyl-disc">
          <div className="vinyl-center"></div>
        </div>
        <div className="vinyl-info">
          <span className="vinyl-title">About You</span>
          <span className="vinyl-artist">The 1975 🎵</span>
        </div>
      </div>
      <audio ref={audioRef} loop src="/The 1975 - About You Official.mp3" preload="auto" />

      {/* Fullscreen Photo Lightbox Modal */}
      {modalState.isOpen && (
        <div className="photo-modal">
          <div className="modal-backdrop" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal} aria-label="Tutup Foto">&times;</button>
            <div className="modal-polaroid">
              <img src={modalState.img} alt="Memory Photo" />
              <p className="modal-caption">{modalState.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="app-wrapper">

        {/* PAGE 1: Hey, kamu... ❤️ */}
        <section className={`page ${currentPage === 1 ? 'active' : ''}`}>
          <div className="cute-sticker teddy-bear" onClick={handleStickerClick} title="Teddy Bear Cute 💕">
            <span className="sticker-emoji">🧸</span>
            <span className="sticker-tag">Hug Me!</span>
          </div>

          <div className="page-content">
            <div className="polaroid-stack">
              <div className="polaroid-card stack-back" onClick={() => openModal('/photos/photo2.jpeg', 'Moments with You 💕')}>
                <div className="tape-sticker top-right-tape"></div>
                <div className="photo-box">
                  <img src="/photos/photo2.jpeg" alt="Photo Memory" />
                </div>
              </div>

              <div className="polaroid-card stack-front" onClick={() => openModal('/photos/photo1.jpeg', 'Hey, You... ❤️')}>
                <div className="heart-clip">📎</div>
                <div className="photo-box">
                  <img src="/photos/photo1.jpeg" alt="Hero Photo" />
                </div>
                <span className="polaroid-handwriting">You & Me ❤️</span>
              </div>
            </div>

            <span className="sub-title-tag">A LITTLE SOMETHING FOR YOU</span>
            <h1 className="main-heading">Hey, kamu... <span className="heart-inline">❤️</span></h1>
            <p className="sub-heading">Aku punya sesuatu kecil buat kamu.</p>

            <button className="btn-primary btn-glow" onClick={(e) => {
              if (canvasRef.current) canvasRef.current.spawnButterflies(e.clientX, e.clientY, 15);
              goToPage(2);
            }}>
              <span>Buka Story</span> <span className="btn-arrow">→</span>
            </button>
          </div>
        </section>

        {/* PAGE 2: Realistic Cute Love Envelope 💌 */}
        <section className={`page ${currentPage === 2 ? 'active' : ''}`}>
          <div className="cute-sticker love-stamp" onClick={handleStickerClick} title="Love Stamp 💌">
            <span className="sticker-emoji">💌</span>
            <span className="sticker-tag">Special!</span>
          </div>

          <div className="page-content">
            <span className="sub-title-tag">KLIK SEGEL DENGAN LOGO HATI UNTUK MEMBUKA</span>

            <div className={`envelope-wrapper ${isEnvelopeOpen ? 'open' : ''}`} onClick={handleOpenEnvelope}>
              <div className="envelope-box">
                <div className="letter-card-slide">
                  <div className="letter-header">
                    <span className="badge-text">SPECIAL MESSAGE 💌</span>
                  </div>
                  <h2 className="card-title">Buat orang favoritku...</h2>
                  <div className="card-body">
                    <p>Aku cuma mau bilang sesuatu yang sederhana.</p>
                    <p>Terima kasih sudah hadir,</p>
                    <p>terima kasih sudah menjadi bagian dari cerita kecilku,</p>
                    <p>dan terima kasih sudah membuat banyak hari terasa lebih menyenangkan.</p>
                    <p className="highlight-quote">
                      Kamu mungkin nggak sadar,<br />
                      tapi kehadiranmu berarti banyak buat aku. <span className="heart-pulse-inline">❤️</span>
                    </p>
                  </div>

                  <div className="letter-polaroid" onClick={(e) => {
                    e.stopPropagation();
                    openModal('/photos/photo2.jpeg', 'Favorite Person 💕');
                  }}>
                    <div className="tape-sticker mini-tape"></div>
                    <div className="polaroid-photo-box">
                      <img src="/photos/photo2.jpeg" alt="Favorite Person" />
                    </div>
                    <span className="polaroid-handwriting">Favorite Person 💕</span>
                  </div>

                  <div className="letter-btn-wrapper">
                    <button className="btn-primary" onClick={(e) => {
                      e.stopPropagation();
                      if (canvasRef.current) canvasRef.current.spawnButterflies(e.clientX, e.clientY, 15);
                      goToPage(3);
                    }}>
                      <span>Ada satu lagi</span> <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>

                <div className="envelope-back-panel"></div>

                <svg className="envelope-flaps-svg" viewBox="0 0 360 220" preserveAspectRatio="none">
                  <polygon points="0,0 180,115 0,220" fill="#fce4ec" stroke="rgba(201, 122, 142, 0.35)" strokeWidth="1.5" />
                  <polygon points="360,0 180,115 360,220" fill="#fce4ec" stroke="rgba(201, 122, 142, 0.35)" strokeWidth="1.5" />
                  <polygon points="0,220 180,95 360,220" fill="#f8bbd0" stroke="rgba(201, 122, 142, 0.4)" strokeWidth="1.5" />
                </svg>

                <div className="envelope-top-flap-wrapper">
                  <svg viewBox="0 0 360 130" preserveAspectRatio="none" className="top-flap-svg">
                    <polygon points="0,0 180,125 360,0" fill="#f48fb1" stroke="#c97a8e" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="wax-seal-badge" title="Klik segel untuk membuka surat">
                  <div className="wax-seal-inner">
                    <span className="seal-icon">❤️</span>
                    <span className="seal-text">OPEN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 3: 3D Flip Secret Cards & 3D Blooming Rose 🫶 */}
        <section className={`page ${currentPage === 3 ? 'active' : ''}`}>
          <div className="cute-sticker love-pill" onClick={handleStickerClick} title="Sweet Sparkle 💖">
            <span className="sticker-emoji">💖</span>
            <span className="sticker-tag">Sweet!</span>
          </div>

          <div className="page-content">
            {/* 3D Blooming Rose Flower Emblem 🌹 */}
            <div className="flower-3d-wrapper" onClick={(e) => {
              e.stopPropagation();
              playPopSound();
              if (canvasRef.current) {
                canvasRef.current.spawnFlowers(e.clientX, e.clientY, 8);
                canvasRef.current.spawnButterflies(e.clientX, e.clientY, 10);
              }
            }} title="Klik bunga untuk merekah 🌹">
              <div className="flower-3d-center">
                <svg className="flower-3d-svg" viewBox="0 0 160 160" width="110" height="110">
                  <g className="flower-petals-group">
                    <path d="M 80 80 C 60 15 100 15 80 80" fill="url(#pGrad1)" stroke="#d4af37" strokeWidth="0.8" className="petal p1" />
                    <path d="M 80 80 C 145 60 145 100 80 80" fill="url(#pGrad1)" stroke="#d4af37" strokeWidth="0.8" className="petal p2" />
                    <path d="M 80 80 C 100 145 60 145 80 80" fill="url(#pGrad1)" stroke="#d4af37" strokeWidth="0.8" className="petal p3" />
                    <path d="M 80 80 C 15 100 15 60 80 80" fill="url(#pGrad1)" stroke="#d4af37" strokeWidth="0.8" className="petal p4" />
                    <path d="M 80 80 C 35 35 125 35 80 80" fill="url(#pGrad2)" stroke="#c97a8e" strokeWidth="0.8" className="petal p5" />
                    <path d="M 80 80 C 125 35 125 125 80 80" fill="url(#pGrad2)" stroke="#c97a8e" strokeWidth="0.8" className="petal p6" />
                    <path d="M 80 80 C 125 125 35 125 80 80" fill="url(#pGrad2)" stroke="#c97a8e" strokeWidth="0.8" className="petal p7" />
                    <path d="M 80 80 C 35 125 35 35 80 80" fill="url(#pGrad2)" stroke="#c97a8e" strokeWidth="0.8" className="petal p8" />
                  </g>
                  <circle cx="80" cy="80" r="14" fill="url(#sGrad)" stroke="#d4af37" strokeWidth="1.5" className="stamen-core" />
                  <circle cx="80" cy="80" r="6" fill="#ffffff" opacity="0.8" />
                  <defs>
                    <radialGradient id="pGrad1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff758f" />
                      <stop offset="70%" stopColor="#b83253" />
                      <stop offset="100%" stopColor="#7a1c32" />
                    </radialGradient>
                    <radialGradient id="pGrad2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffd1dc" />
                      <stop offset="60%" stopColor="#ff758f" />
                      <stop offset="100%" stopColor="#b83253" />
                    </radialGradient>
                    <radialGradient id="sGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fff0ab" />
                      <stop offset="60%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#96771e" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <span className="sub-title-tag">FLIP CARDS TO REVEAL</span>
            <h2 className="page-title">Little Things About You <span className="hand-inline">🫶</span></h2>

            <div className="cards-grid">
              {/* Card 1 */}
              <div className={`flip-card ${flippedCards[0] ? 'flipped' : ''}`} onClick={() => toggleFlipCard(0)}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="flip-icon">❤️</div>
                    <h3>Your Smile</h3>
                    <span className="flip-hint">Hover / Touch untuk buka ↻</span>
                  </div>
                  <div className="flip-card-back" onClick={(e) => { e.stopPropagation(); openModal('/photos/photo4.jpeg', 'Your Smile 😊'); }}>
                    <img src="/photos/photo4.jpeg" alt="Your Smile" className="flip-bg-img" />
                    <div className="flip-overlay">
                      <h4>❤️ Your Smile</h4>
                      <p>“Entah kenapa senyum kamu selalu punya efek aneh.”</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`flip-card ${flippedCards[1] ? 'flipped' : ''}`} onClick={() => toggleFlipCard(1)}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="flip-icon">✨</div>
                    <h3>Your Presence</h3>
                    <span className="flip-hint">Hover / Touch untuk buka ↻</span>
                  </div>
                  <div className="flip-card-back" onClick={(e) => { e.stopPropagation(); openModal('/photos/photo5.jpeg', 'Your Presence ✨'); }}>
                    <img src="/photos/photo5.jpeg" alt="Your Presence" className="flip-bg-img" />
                    <div className="flip-overlay">
                      <h4>✨ Your Presence</h4>
                      <p>“Bahkan cuma ngobrol sebentar sudah cukup bikin hari lebih baik.”</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className={`flip-card ${flippedCards[2] ? 'flipped' : ''}`} onClick={() => toggleFlipCard(2)}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="flip-icon">🌷</div>
                    <h3>Just You</h3>
                    <span className="flip-hint">Hover / Touch untuk buka ↻</span>
                  </div>
                  <div className="flip-card-back" onClick={(e) => { e.stopPropagation(); openModal('/photos/photo6.jpeg', 'Just You 🌷'); }}>
                    <img src="/photos/photo6.jpeg" alt="Just You" className="flip-bg-img" />
                    <div className="flip-overlay">
                      <h4>🌷 Just You</h4>
                      <p>“Nggak perlu alasan khusus. Kamu ya kamu.”</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="surprise-section">
              <button className="btn-interactive" onClick={(e) => {
                playPopSound();
                if (canvasRef.current) {
                  canvasRef.current.spawnButterflies(e.clientX, e.clientY, 20);
                  canvasRef.current.spawnFlowers(e.clientX, e.clientY, 10);
                }
                setToastVisible(true);
              }}>
                <span className="sparkle-gold">✨</span> Klik aku <span className="sparkle-gold">✨</span>
              </button>

              {toastVisible && (
                <div className="surprise-toast">
                  <span className="toast-text">Hehe... ketahuan senang ❤️</span>
                </div>
              )}
            </div>

            <button className="btn-primary" onClick={(e) => {
              if (canvasRef.current) canvasRef.current.spawnButterflies(e.clientX, e.clientY, 15);
              goToPage(4);
            }}>
              <span>Terakhir</span> <span className="btn-arrow">→</span>
            </button>
          </div>
        </section>

        {/* PAGE 4: Grand Romantic Finale ❤️ */}
        <section className={`page ${currentPage === 4 ? 'active' : ''}`}>
          <div className="cute-sticker sakura-badge" onClick={handleStickerClick} title="Forever Love 🌸">
            <span className="sticker-emoji">🌸</span>
            <span className="sticker-tag">Always</span>
          </div>

          <div className="page-content center-focus">
            <div className={`p4-intro-text ${p4IntroOut ? 'fade-out' : ''}`}>
              <span>Satu hal terakhir...</span>
            </div>

            {p4MainVisible && (
              <div className="p4-main-content">
                <div className="butterfly-3d-emblem">
                  <svg className="butterfly-svg" viewBox="0 0 160 160" width="130" height="130">
                    <g className="wing-left">
                      <path d="M 80 80 C 40 20 0 40 20 80 C 30 100 70 95 80 80 Z" fill="url(#wGradL)" stroke="#d4af37" strokeWidth="1.5" />
                      <path d="M 80 80 C 50 85 20 110 35 135 C 55 150 75 115 80 80 Z" fill="url(#wGradLSub)" stroke="#c97a8e" strokeWidth="1.2" />
                    </g>
                    <g className="wing-right">
                      <path d="M 80 80 C 120 20 160 40 140 80 C 130 100 90 95 80 80 Z" fill="url(#wGradR)" stroke="#d4af37" strokeWidth="1.5" />
                      <path d="M 80 80 C 110 85 140 110 125 135 C 105 150 85 115 80 80 Z" fill="url(#wGradRSub)" stroke="#c97a8e" strokeWidth="1.2" />
                    </g>
                    <path d="M 80 60 C 78 50 72 35 68 30 M 80 60 C 82 50 88 35 92 30" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <ellipse cx="80" cy="80" rx="4" ry="25" fill="#7a1c32" stroke="#d4af37" strokeWidth="1" />
                    <circle cx="80" cy="58" r="4" fill="#d4af37" />
                    <defs>
                      <linearGradient id="wGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff758f" />
                        <stop offset="100%" stopColor="#b83253" />
                      </linearGradient>
                      <linearGradient id="wGradR" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff758f" />
                        <stop offset="100%" stopColor="#b83253" />
                      </linearGradient>
                      <linearGradient id="wGradLSub" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffd1dc" />
                        <stop offset="100%" stopColor="#c97a8e" />
                      </linearGradient>
                      <linearGradient id="wGradRSub" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffd1dc" />
                        <stop offset="100%" stopColor="#c97a8e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <span className="sub-title-tag">FOREVER & ALWAYS</span>
                <h1 className="final-title">Aku sayang kamu. <span className="heart-pulse-inline">❤️</span></h1>
                <p className="final-subtext">Sesederhana itu.</p>

                <div className="finale-collage">
                  <div className="collage-item c1" onClick={() => openModal('/photos/photo7.jpeg', 'Sweet Moments 💕')}>
                    <img src="/photos/photo7.jpeg" alt="Memory" />
                  </div>
                  <div className="collage-item c2 main-hero-photo" onClick={() => openModal('/photos/hbd.jpeg', 'Happy Birthday / Special Day ❤️')}>
                    <img src="/photos/hbd.jpeg" alt="Special Day" />
                    <span className="collage-label">Forever ❤️</span>
                  </div>
                  <div className="collage-item c3" onClick={() => openModal('/photos/photo8.jpeg', 'Always Together ✨')}>
                    <img src="/photos/photo8.jpeg" alt="Memory" />
                  </div>
                </div>

                <div className="footer-tag">
                  <p>Made with a little bit of love ❤️</p>
                </div>

                <button className="btn-subtle" onClick={() => {
                  goToPage(1);
                  setToastVisible(false);
                  setIsEnvelopeOpen(false);
                }} title="Mulai lagi dari awal">
                  <span>↺ Ulangi cerita</span>
                </button>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
