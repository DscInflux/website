"use client";
import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ConnectingDotsProps {
  dotColor?: string;
  lineColor?: string;
  dotCount?: number;
  lineThreshold?: number;
}

const ConnectingDots: React.FC<ConnectingDotsProps> = ({
  dotColor = "rgba(255, 255, 255, 0.7)",
  lineColor = "rgba(255, 255, 255, 0.2)",
  dotCount = 200,
  lineThreshold = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < dotCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1, // Increased speed
        vy: (Math.random() - 0.5) * 1, // Increased speed
        radius: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = particles;
  };

  // Animation logic
  const animate = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Connect particles that are close
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const particle2 = particlesRef.current[j];
        const dx = particle.x - particle2.x;
        const dy = particle.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < lineThreshold) {
          // Fade lines based on distance
          const opacity = 1 - distance / lineThreshold;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/g, `${opacity})`);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  const handleResize = () => {
    if (canvasRef.current) {
      const { clientWidth, clientHeight } =
        canvasRef.current.parentElement || document.body;
      setDimensions({
        width: clientWidth,
        height: clientHeight,
      });

      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;

      // Reinitialize particles when resizing
      initParticles(clientWidth, clientHeight);
    }
  };

  // Setup canvas and start animation
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default ConnectingDots;
