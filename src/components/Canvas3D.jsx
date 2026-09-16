import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const Canvas3D = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const butterfliesRef = useRef([]);
  const petalsRef = useRef([]);
  const flowersRef = useRef([]);
  const particlesRef = useRef([]);

  useImperativeHandle(ref, () => ({
    spawnButterflies(x, y, count = 16) {
      if (!canvasRef.current) return;
      for (let i = 0; i < count; i++) {
        if (butterfliesRef.current.length < 45) {
          butterfliesRef.current.push(new Butterfly3D(x, y, canvasRef.current, true));
        }
      }
    },
    spawnFlowers(x, y, count = 6) {
      if (!canvasRef.current) return;
      for (let i = 0; i < count; i++) {
        if (flowersRef.current.length < 25) {
          flowersRef.current.push(new Flower3D(x, y, canvasRef.current, true));
        }
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 1. Butterfly3D Class
    class Butterfly3D {
      constructor(x, y, c, isBurst = false) {
        this.x = x !== undefined ? x : Math.random() * c.width;
        this.y = y !== undefined ? y : Math.random() * c.height;
        this.size = Math.random() * 8 + 11;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = isBurst ? Math.random() * 3.2 + 1.5 : Math.random() * 1.3 + 0.7;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.wingAngle = Math.random() * Math.PI * 2;
        this.wingSpeed = Math.random() * 0.22 + 0.16;
        this.turnPhase = Math.random() * Math.PI * 2;
        this.turnSpeed = Math.random() * 0.03 + 0.01;
        this.opacity = Math.random() * 0.35 + 0.65;
        this.life = 1;
        this.isBurst = isBurst;
        this.decay = isBurst ? Math.random() * 0.02 + 0.012 : 0;
        this.colorMain = ['#b83253', '#c97a8e', '#ff758f', '#d4af37'][Math.floor(Math.random() * 4)];
        this.colorSub = ['#ffd1dc', '#fff0f3', '#f7eae5', '#ffffff'][Math.floor(Math.random() * 4)];
      }

      update(c) {
        this.wingAngle += this.wingSpeed;
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
          if (this.x < -35) this.x = c.width + 35;
          if (this.x > c.width + 35) this.x = -35;
          if (this.y < -35) this.y = c.height + 35;
          if (this.y > c.height + 35) this.y = -35;
        }
      }

      draw(context) {
        if (this.opacity <= 0) return;
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle + Math.PI / 2);

        const wingScaleX = Math.abs(Math.cos(this.wingAngle));

        // Left Wing
        context.save();
        context.scale(wingScaleX, 1);
        context.fillStyle = this.colorMain;
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-this.size * 1.2, -this.size * 1.4, -this.size * 1.8, 0, 0, this.size * 0.5);
        context.fill();

        context.fillStyle = this.colorSub;
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-this.size * 0.8, -this.size * 0.9, -this.size * 1.2, 0, 0, this.size * 0.4);
        context.fill();
        context.restore();

        // Right Wing
        context.save();
        context.scale(-wingScaleX, 1);
        context.fillStyle = this.colorMain;
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-this.size * 1.2, -this.size * 1.4, -this.size * 1.8, 0, 0, this.size * 0.5);
        context.fill();

        context.fillStyle = this.colorSub;
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-this.size * 0.8, -this.size * 0.9, -this.size * 1.2, 0, 0, this.size * 0.4);
        context.fill();
        context.restore();

        // Body & Antenna
        context.fillStyle = '#7a1c32';
        context.beginPath();
        context.ellipse(0, 0, 1.8, this.size * 0.5, 0, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = '#d4af37';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, -this.size * 0.4);
        context.lineTo(-4, -this.size * 0.8);
        context.moveTo(0, -this.size * 0.4);
        context.lineTo(4, -this.size * 0.8);
        context.stroke();

        context.restore();
      }
    }

    // 2. Petal3D Class
    class Petal3D {
      constructor(c) {
        this.reset(c);
        this.y = Math.random() * c.height;
      }

      reset(c) {
        this.x = Math.random() * c.width;
        this.y = -20;
        this.size = Math.random() * 6 + 7;
        this.speedY = Math.random() * 0.8 + 0.35;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.035;
        this.opacity = Math.random() * 0.4 + 0.5;
        this.color = ['#ffb7c5', '#ffc0cb', '#f8bbd0', '#ffd1dc'][Math.floor(Math.random() * 4)];
      }

      update(c) {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.012) * 0.7 + this.speedX;
        this.rot += this.rotSpeed;

        if (this.y > c.height + 25) {
          this.reset(c);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rot);
        context.scale(1, Math.sin(this.rot) * 0.5 + 0.5);
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(0, -this.size);
        context.bezierCurveTo(-this.size * 0.85, -this.size * 0.45, -this.size * 0.85, this.size * 0.45, 0, this.size);
        context.bezierCurveTo(this.size * 0.85, this.size * 0.45, this.size * 0.85, -this.size * 0.45, 0, -this.size);
        context.fill();
        context.restore();
      }
    }

    // 3. Flower3D Class
    class Flower3D {
      constructor(x, y, c, isBurst = false) {
        this.x = x !== undefined ? x : Math.random() * c.width;
        this.y = y !== undefined ? y : (isBurst ? y : c.height + 30);
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

      update(c) {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.015) * 0.6 + this.speedX;
        this.rot += this.rotSpeed;

        if (this.bloomScale < this.maxBloom) {
          this.bloomScale += 0.012;
        }

        if (this.isBurst) {
          this.opacity -= this.decay;
        } else if (this.y < -40) {
          this.y = c.height + 40;
          this.x = Math.random() * c.width;
          this.bloomScale = 0.3;
        }
      }

      draw(context) {
        if (this.opacity <= 0) return;
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rot);
        context.scale(this.bloomScale, this.bloomScale);
        context.globalAlpha = Math.max(0, this.opacity);

        for (let i = 0; i < 6; i++) {
          context.save();
          context.rotate((Math.PI / 3) * i);
          context.fillStyle = this.petalColor1;
          context.beginPath();
          context.moveTo(0, 0);
          context.bezierCurveTo(-this.size * 0.7, -this.size * 1.1, -this.size * 1.2, -this.size * 0.4, 0, -this.size * 1.3);
          context.bezierCurveTo(this.size * 1.2, -this.size * 0.4, this.size * 0.7, -this.size * 1.1, 0, 0);
          context.fill();

          context.fillStyle = this.petalColor2;
          context.beginPath();
          context.moveTo(0, 0);
          context.bezierCurveTo(-this.size * 0.4, -this.size * 0.7, -this.size * 0.7, -this.size * 0.3, 0, -this.size * 0.9);
          context.bezierCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.4, -this.size * 0.7, 0, 0);
          context.fill();
          context.restore();
        }

        context.fillStyle = '#d4af37';
        context.beginPath();
        context.arc(0, 0, this.size * 0.32, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    }

    // 4. StardustParticle Class
    class StardustParticle {
      constructor(c) {
        this.reset(c);
        this.y = Math.random() * c.height;
      }

      reset(c) {
        this.x = Math.random() * c.width;
        this.y = c.height + 20;
        this.size = Math.random() * 5 + 3;
        this.speedY = Math.random() * 0.6 + 0.3;
        this.swayFreq = Math.random() * 0.02 + 0.01;
        this.swayAmp = Math.random() * 1.2 + 0.3;
        this.swayPhase = Math.random() * 6.28;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.color = ['#d4af37', '#e6c594', '#ffffff'][Math.floor(Math.random() * 3)];
      }

      update(c) {
        this.swayPhase += this.swayFreq;
        this.x += Math.sin(this.swayPhase) * this.swayAmp;
        this.y -= this.speedY;

        if (this.y < -20) {
          this.reset(c);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    // Initialize Canvas Objects
    const isMobile = window.innerWidth < 600;
    const flowerCount = isMobile ? 4 : 6;
    const petalCount = isMobile ? 6 : 10;
    const stardustCount = isMobile ? 8 : 12;
    const butterflyCount = isMobile ? 8 : 12;

    butterfliesRef.current = [];
    petalsRef.current = [];
    flowersRef.current = [];
    particlesRef.current = [];

    for (let i = 0; i < flowerCount; i++) flowersRef.current.push(new Flower3D(undefined, undefined, canvas));
    for (let i = 0; i < petalCount; i++) petalsRef.current.push(new Petal3D(canvas));
    for (let i = 0; i < stardustCount; i++) particlesRef.current.push(new StardustParticle(canvas));
    for (let i = 0; i < butterflyCount; i++) butterfliesRef.current.push(new Butterfly3D(undefined, undefined, canvas));

    let animId;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = flowersRef.current.length - 1; i >= 0; i--) {
        const fl = flowersRef.current[i];
        fl.update(canvas);
        fl.draw(ctx);
        if (fl.isBurst && fl.opacity <= 0) flowersRef.current.splice(i, 1);
      }

      for (let i = 0; i < petalsRef.current.length; i++) {
        petalsRef.current[i].update(canvas);
        petalsRef.current[i].draw(ctx);
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update(canvas);
        particlesRef.current[i].draw(ctx);
      }

      for (let i = butterfliesRef.current.length - 1; i >= 0; i--) {
        const bf = butterfliesRef.current[i];
        bf.update(canvas);
        bf.draw(ctx);
        if (bf.isBurst && bf.opacity <= 0) butterfliesRef.current.splice(i, 1);
      }

      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="particle-canvas" ref={canvasRef} />;
});

export default Canvas3D;
