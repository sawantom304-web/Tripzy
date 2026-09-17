import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 300;

export default function HeroScrollCanvas({ scrollProgress = 0 }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload all 300 image frames
  useEffect(() => {
    let loaded = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update target frame from scroll progress
  useEffect(() => {
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(scrollProgress * (TOTAL_FRAMES - 1)))
    );
    targetFrameRef.current = frameIndex;
  }, [scrollProgress]);

  // Smooth lerp draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const dist = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += dist * 0.18; // Smooth lerp

      const frameIndex = Math.round(currentFrameRef.current);
      const img = imagesRef.current[frameIndex] || imagesRef.current[0];

      if (img && img.complete && img.naturalWidth !== 0) {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgWidth = img.naturalWidth || img.width || 1920;
        const imgHeight = img.naturalHeight || img.height || 1080;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const imgAspect = imgWidth / imgHeight;
        const canvasAspect = canvasWidth / canvasHeight;

        let renderW, renderH, renderX, renderY;

        if (canvasAspect > imgAspect) {
          renderW = canvasWidth;
          renderH = canvasWidth / imgAspect;
          renderX = 0;
          renderY = (canvasHeight - renderH) / 2;
        } else {
          renderH = canvasHeight;
          renderW = canvasHeight * imgAspect;
          renderX = (canvasWidth - renderW) / 2;
          renderY = 0;
        }

        ctx.drawImage(img, renderX, renderY, renderW, renderH);

        // Transparent gradient overlay for legibility while keeping scrolling animation 100% visible
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, 'rgba(10, 14, 26, 0.45)');
        gradient.addColorStop(0.5, 'rgba(10, 14, 26, 0.25)');
        gradient.addColorStop(1, 'rgba(10, 14, 26, 0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-[#0A0E1A] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#00F5D4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#9CA3AF] font-mono text-sm tracking-widest uppercase">
            Loading Cinematic Animation ({Math.round((loadedCount / TOTAL_FRAMES) * 100)}%)
          </p>
        </div>
      )}
    </div>
  );
}
