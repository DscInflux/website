'use client';

import { useEffect, useRef, useState } from 'react';

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
}

const ConnectingDots: React.FC<ConnectingDotsProps> = ({
	dotColor = 'rgba(255, 255, 255, 0.7)',
	lineColor = 'rgba(255, 255, 255, 0.2)'
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const particlesRef = useRef<Particle[]>([]);
	const animationRef = useRef<number>(0);
	const [shouldAnimate, setShouldAnimate] = useState(true);

	const [dotCount, setDotCount] = useState(200);
	const [lineThreshold, setLineThreshold] = useState(150);

	// Detect motion preference, screen size, and device capability
	useEffect(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const isMobile = window.innerWidth < 768;
		const lowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

		if (prefersReducedMotion) {
			setShouldAnimate(false);
			return;
		}

		if (isMobile || lowEndDevice) {
			setDotCount(30);
			setLineThreshold(20);
		} else {
			setDotCount(200);
			setLineThreshold(150);
		}
	}, []);

	const initParticles = (width: number, height: number) => {
		const particles: Particle[] = [];
		for (let i = 0; i < dotCount; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 1,
				vy: (Math.random() - 0.5) * 1,
				radius: Math.random() * 2 + 1
			});
		}
		particlesRef.current = particles;
	};

	const animate = () => {
		if (!canvasRef.current || !shouldAnimate) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particlesRef.current.forEach((particle, i) => {
			particle.x += particle.vx;
			particle.y += particle.vy;

			if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
			if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			ctx.fillStyle = dotColor;
			ctx.fill();

			for (let j = i + 1; j < particlesRef.current.length; j++) {
				const particle2 = particlesRef.current[j];
				const dx = particle.x - particle2.x;
				const dy = particle.y - particle2.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < lineThreshold) {
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

	const handleResize = () => {
		if (canvasRef.current) {
			const parent = canvasRef.current.parentElement || document.body;
			const { clientWidth, clientHeight } = parent;
			setDimensions({ width: clientWidth, height: clientHeight });

			canvasRef.current.width = clientWidth;
			canvasRef.current.height = clientHeight;

			initParticles(clientWidth, clientHeight);
		}
	};

	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);

		if (shouldAnimate) {
			animationRef.current = requestAnimationFrame(animate);
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationRef.current);
		};
	}, [dotCount, lineThreshold, shouldAnimate]);

	return (
		<div className="pointer-events-none fixed inset-0 z-[-1]">
			<canvas
				ref={canvasRef}
				className="h-full w-full"
				width={dimensions.width}
				height={dimensions.height}
			/>
		</div>
	);
};

export default ConnectingDots;
