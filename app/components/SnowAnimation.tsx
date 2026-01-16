'use client';

import { useEffect, useRef } from 'react';

export default function SnowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake class
    class Snowflake {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      wind: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wind = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind + Math.sin(this.y * 0.01) * 0.5;

        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }

        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create snowflakes
    const snowflakes: Snowflake[] = [];
    const snowflakeCount = 100;

    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push(new Snowflake());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      snowflakes.forEach((snowflake) => {
        snowflake.update();
        snowflake.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
