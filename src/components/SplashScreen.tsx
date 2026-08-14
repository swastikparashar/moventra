import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Sparkles, Volume2, Play } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  creatorName?: string;
  creatorRole?: string;
}

// Synthesize a futuristic power-up sound as a PCM WAV Data URI to prevent AudioDestinationNode errors
const createFuturisticWavUri = (): string => {
  try {
    const sampleRate = 22050;
    const duration = 1.6;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Sub-bass sweep
      const bassFreq = 80 + t * 60;
      sample += Math.sin(2 * Math.PI * bassFreq * t) * Math.max(0, 1 - t / 1.6) * 0.45;

      // Arpeggiated power chimes
      const chimeIdx = Math.min(freqs.length - 1, Math.floor(t / 0.16));
      const chimeTime = t - chimeIdx * 0.16;
      if (chimeTime >= 0) {
        const f = freqs[chimeIdx];
        sample += Math.sin(2 * Math.PI * f * t) * Math.exp(-chimeTime * 6) * 0.35;
      }

      // Shimmer tone
      if (t > 1.0) {
        sample += Math.sin(2 * Math.PI * 1567.98 * t) * Math.exp(-(t - 1.0) * 5) * 0.3;
      }

      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF, true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  } catch {
    return '';
  }
};

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  creatorName = 'SWASTIK PARASHAR',
  creatorRole = 'C.E.O. & FOUNDER',
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Core Systems...');
  const [audioPlayed, setAudioPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play intro sound safely via HTML5 Audio with pre-rendered WAV Data URL (Safe & reliable)
  const playIntroSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        const wavUri = createFuturisticWavUri();
        if (wavUri) {
          const audio = new Audio(wavUri);
          audio.volume = 0.85;
          audioRef.current = audio;
        }
      }

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAudioPlayed(true);
            })
            .catch(() => {
              // Playback prevented by browser autoplay policy until user gesture
            });
        }
      }
    } catch {
      // Ignore audio playback errors
    }
  }, []);

  // Play audio on mount and unlock on user interaction
  useEffect(() => {
    playIntroSound();

    const handleUserGesture = () => {
      playIntroSound();
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });
    window.addEventListener('keydown', handleUserGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, [playIntroSound]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStatusText('Loading AI Fitness Models...');
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStatusText('Syncing User Profile & Workouts...');
    }, 1400);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Moventra AI Ready');
    }, 2200);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => playIntroSound()}
      className="fixed inset-0 z-50 bg-[#090909] text-white flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none cursor-pointer"
    >
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-green-500/20 via-emerald-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar / Skip & Sound Trigger */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            Moventra OS v3.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              playIntroSound();
            }}
            className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold hover:bg-green-500/30 transition-all flex items-center gap-1.5 shadow-lg shadow-green-500/10"
          >
            <Volume2 className="w-4 h-4 text-green-400 animate-bounce" />
            <span>Play Tone 🔊</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all backdrop-blur-md"
          >
            Skip Intro →
          </button>
        </div>
      </div>

      {/* Main Animated Branding Content */}
      <div className="flex flex-col items-center text-center z-10 max-w-xl my-auto">
        {/* Glowing Logo Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-600 blur-xl opacity-50 animate-pulse" />
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-emerald-700 p-0.5 shadow-2xl shadow-green-500/30 flex items-center justify-center relative">
            <div className="w-full h-full bg-black/90 rounded-[22px] flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 fill-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Title: MOVENTRA AI */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-3">
            MOVENTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-emerald-200">AI</span>
          </h1>
        </motion.div>

        {/* Creator Attribution Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2 mt-2"
        >
          <div className="flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">
            <span>BY</span>
            <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2 rounded-2xl border border-emerald-500/30 text-green-400 shadow-2xl backdrop-blur-md">
              <span className="text-white text-base font-black tracking-wider">{creatorName}</span>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/10 mt-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{creatorRole}</span>
          </motion.div>

          {/* Interactive Tap Prompt for Sound Guarantee */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              playIntroSound();
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold hover:bg-green-500/30 transition-all shadow-xl shadow-green-500/20 animate-pulse"
          >
            <Volume2 className="w-4 h-4 text-green-400" />
            <span>Click Anywhere or Tap Here for Intro Audio 🔊</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Progress Bar & Status at Bottom */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-green-400 animate-spin" />
            {statusText}
          </span>
          <span className="font-bold text-white">{progress}%</span>
        </div>

        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-amber-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

