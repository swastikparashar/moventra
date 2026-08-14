import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface ExerciseAnimationCanvasProps {
  animationType: 'pushup' | 'squat' | 'plank' | 'jumping_jacks' | 'bicep_curl' | 'lunges' | 'yoga_downward_dog' | 'burpees' | 'crunches';
  muscleGroup?: string;
  isCompact?: boolean;
}

export const ExerciseAnimationCanvas: React.FC<ExerciseAnimationCanvasProps> = ({
  animationType,
  muscleGroup = 'Full Body',
  isCompact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.04 * speed;
      }
      const t = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background styling with subtle grid
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2 + 10;

      // Dark futuristic container styling
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);

      // Soft glow background
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, w * 0.45);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Floor line
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.82);
      ctx.lineTo(w * 0.9, h * 0.82);
      ctx.stroke();

      // Style variables
      const emeraldColor = '#10B981';
      const greenGlow = '#34D399';
      const whiteColor = '#FAFAFA';

      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cycle = (Math.sin(t) + 1) / 2; // 0 to 1 smooth wave

      if (animationType === 'pushup') {
        // Pushup animation
        const bodyY = h * 0.6 + cycle * 35; // moves up and down
        const headX = centerX + 60;
        const feetX = centerX - 80;
        const handX = centerX + 30;
        const floorY = h * 0.78;

        // Legs to torso line
        ctx.strokeStyle = whiteColor;
        ctx.beginPath();
        ctx.moveTo(feetX, floorY - 5);
        ctx.lineTo(headX, bodyY);
        ctx.stroke();

        // Head
        ctx.fillStyle = greenGlow;
        ctx.beginPath();
        ctx.arc(headX + 15, bodyY - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // Arms (elbow flexing)
        const elbowX = handX + (1 - cycle) * 15;
        const elbowY = bodyY + (1 - cycle) * 20;

        ctx.strokeStyle = emeraldColor;
        ctx.beginPath();
        ctx.moveTo(headX - 20, bodyY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, floorY);
        ctx.stroke();
      } else if (animationType === 'squat') {
        // Squat animation
        const hipY = h * 0.45 + cycle * 45;
        const kneeY = h * 0.68;
        const headY = hipY - 50;

        // Head
        ctx.fillStyle = greenGlow;
        ctx.beginPath();
        ctx.arc(centerX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Torso
        ctx.strokeStyle = whiteColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 14);
        ctx.lineTo(centerX, hipY);
        ctx.stroke();

        // Legs (hips bend out back, knees project)
        const kneeXLeft = centerX - 25 - cycle * 15;
        const kneeXRight = centerX + 25 + cycle * 15;
        const feetY = h * 0.8;

        ctx.strokeStyle = emeraldColor;
        ctx.beginPath();
        ctx.moveTo(centerX, hipY);
        ctx.lineTo(kneeXLeft, kneeY);
        ctx.lineTo(centerX - 20, feetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, hipY);
        ctx.lineTo(kneeXRight, kneeY);
        ctx.lineTo(centerX + 20, feetY);
        ctx.stroke();

        // Arms extended out
        const handY = headY + 25 - cycle * 10;
        ctx.strokeStyle = whiteColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 25);
        ctx.lineTo(centerX + 40, handY);
        ctx.stroke();
      } else if (animationType === 'plank') {
        // Plank static/breathing hold
        const breath = Math.sin(t * 1.5) * 3;
        const bodyY = h * 0.6 + breath;
        const feetX = centerX - 80;
        const headX = centerX + 70;
        const elbowX = centerX + 30;
        const floorY = h * 0.78;

        // Body straight line
        ctx.strokeStyle = emeraldColor;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(feetX, floorY - 5);
        ctx.lineTo(headX, bodyY);
        ctx.stroke();

        // Core highlight pulse
        ctx.strokeStyle = greenGlow;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX - 10, bodyY + 5, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Head
        ctx.fillStyle = greenGlow;
        ctx.beginPath();
        ctx.arc(headX + 12, bodyY - 5, 12, 0, Math.PI * 2);
        ctx.fill();

        // Forearms on floor
        ctx.strokeStyle = whiteColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX + 20, bodyY);
        ctx.lineTo(elbowX, floorY);
        ctx.lineTo(elbowX + 25, floorY);
        ctx.stroke();
      } else if (animationType === 'jumping_jacks') {
        // Jumping jacks
        const spread = cycle;
        const legSpread = spread * 40;
        const armAngle = (1 - spread) * Math.PI * 0.75;
        const jumpY = Math.sin(spread * Math.PI) * -15;

        const headY = h * 0.35 + jumpY;
        const hipY = headY + 55;
        const feetY = h * 0.8;

        // Head
        ctx.fillStyle = greenGlow;
        ctx.beginPath();
        ctx.arc(centerX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Spine
        ctx.strokeStyle = whiteColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 14);
        ctx.lineTo(centerX, hipY);
        ctx.stroke();

        // Legs
        ctx.strokeStyle = emeraldColor;
        ctx.beginPath();
        ctx.moveTo(centerX, hipY);
        ctx.lineTo(centerX - 10 - legSpread, feetY);
        ctx.moveTo(centerX, hipY);
        ctx.lineTo(centerX + 10 + legSpread, feetY);
        ctx.stroke();

        // Arms overhead / down
        const armLeftX = centerX - Math.sin(armAngle) * 35;
        const armLeftY = headY + 25 - Math.cos(armAngle) * 35;
        const armRightX = centerX + Math.sin(armAngle) * 35;
        const armRightY = headY + 25 - Math.cos(armAngle) * 35;

        ctx.strokeStyle = greenGlow;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 20);
        ctx.lineTo(armLeftX, armLeftY);
        ctx.moveTo(centerX, headY + 20);
        ctx.lineTo(armRightX, armRightY);
        ctx.stroke();
      } else if (animationType === 'bicep_curl') {
        // Bicep curl animation
        const armFlex = cycle; // 0 to 1
        const headY = h * 0.32;
        const hipY = headY + 55;
        const handY = h * 0.65 - armFlex * 40;
        const elbowY = h * 0.55;

        // Head
        ctx.fillStyle = greenGlow;
        ctx.beginPath();
        ctx.arc(centerX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.strokeStyle = whiteColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 14);
        ctx.lineTo(centerX, hipY);
        ctx.lineTo(centerX - 15, h * 0.8);
        ctx.moveTo(centerX, hipY);
        ctx.lineTo(centerX + 15, h * 0.8);
        ctx.stroke();

        // Bicep arm
        ctx.strokeStyle = emeraldColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 20);
        ctx.lineTo(centerX + 25, elbowY);
        ctx.lineTo(centerX + 25 + armFlex * 10, handY);
        ctx.stroke();

        // Dumbbell weight
        ctx.fillStyle = '#E4E4E7';
        ctx.fillRect(centerX + 15 + armFlex * 10, handY - 6, 20, 12);
      } else {
        // Generic dynamic exercise stance
        const headY = h * 0.35 + Math.sin(t * 2) * 5;
        ctx.fillStyle = greenGlow;
        ctx.beginPath();
        ctx.arc(centerX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = emeraldColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 14);
        ctx.lineTo(centerX, headY + 60);
        ctx.stroke();

        ctx.strokeStyle = whiteColor;
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 60);
        ctx.lineTo(centerX - 25, h * 0.78);
        ctx.moveTo(centerX, headY + 60);
        ctx.lineTo(centerX + 25, h * 0.78);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [animationType, isPlaying, speed]);

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 ${isCompact ? 'p-2' : 'p-4'}`}>
      <canvas
        ref={canvasRef}
        width={isCompact ? 240 : 360}
        height={isCompact ? 160 : 220}
        className="rounded-xl w-full h-auto max-h-[220px] object-contain"
      />

      {/* Control Overlay */}
      <div className="mt-3 flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>{muscleGroup}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 0.75 : 1))}
            className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-mono transition-colors"
          >
            {speed}x
          </button>
        </div>
      </div>
    </div>
  );
};
