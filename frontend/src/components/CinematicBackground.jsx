import React, { useRef, useEffect } from 'react';

const CinematicBackground = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Particle system
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = [
          'rgba(255, 215, 0, ',      // Golden glow
          'rgba(255, 244, 79, ',     // Glowing yellow
          'rgba(218, 165, 32, ',     // Goldenrod
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Subtle mouse attraction
        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.x += dx * 0.001;
          this.y += dy * 0.001;
        }

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, this.color + this.opacity + ')');
        gradient.addColorStop(1, this.color + '0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Wave system
    class Wave {
      constructor(yOffset, speed, amplitude, color, width) {
        this.yOffset = yOffset;
        this.speed = speed;
        this.amplitude = amplitude;
        this.color = color;
        this.width = width;
        this.time = Math.random() * 1000;
      }

      draw() {
        this.time += this.speed;
        ctx.beginPath();
        ctx.moveTo(0, height / 2 + this.yOffset);

        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + 
                    this.yOffset + 
                    Math.sin((x + this.time) * 0.005) * this.amplitude +
                    Math.sin((x + this.time * 0.5) * 0.01) * (this.amplitude * 0.5);
          ctx.lineTo(x, y);
        }

        // Glow effect
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.stroke();

        // Additional inner glow
        ctx.shadowBlur = 40;
        ctx.lineWidth = this.width * 0.5;
        ctx.stroke();

        ctx.shadowBlur = 0;
      }
    }

    // Energy stream lines
    class EnergyStream {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.hue = Math.random() > 0.5 ? 45 : 55; // Golden or yellow hues
      }

      update() {
        this.y += this.speed;
        if (this.y > height + this.length) {
          this.reset();
        }
      }

      draw() {
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x, this.y + this.length
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 60%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    // Create instances
    const particles = Array.from({ length: 80 }, () => new Particle());
    const waves = [
      new Wave(-50, 0.3, 30, 'rgba(255, 215, 0, 0.15)', 3),
      new Wave(0, 0.2, 40, 'rgba(255, 244, 79, 0.1)', 2),
      new Wave(50, 0.25, 35, 'rgba(218, 165, 32, 0.08)', 2.5),
    ];
    const streams = Array.from({ length: 12 }, () => new EnergyStream());

    // Animation loop
    const animate = () => {
      // Create cinematic gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0A0A0C');
      gradient.addColorStop(0.5, '#1A1A1D');
      gradient.addColorStop(1, '#1C1C1C');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add noise/fog overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < 50; i++) {
        ctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 2,
          Math.random() * 2
        );
      }

      // Draw waves
      waves.forEach(wave => wave.draw());

      // Draw energy streams
      streams.forEach(stream => {
        stream.update();
        stream.draw();
      });

      // Draw and update particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Connect nearby particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / 100) * 0.1;
            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: '#0A0A0C' }}
    />
  );
};

export default CinematicBackground;
