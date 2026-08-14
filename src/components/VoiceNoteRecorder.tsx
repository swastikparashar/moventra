import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause, Trash2, CheckCircle2, Sparkles, Volume2, AlertCircle } from 'lucide-react';

interface VoiceNoteRecorderProps {
  title: string;
  placeholder?: string;
  category: 'nutrition' | 'workout';
  onSaveVoiceNote: (note: { transcript: string; audioUrl?: string; timestamp: string; category: string }) => void;
  accentColor?: 'emerald' | 'amber' | 'cyan';
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  title,
  placeholder = "Click the microphone button and speak your voice note...",
  category,
  onSaveVoiceNote,
  accentColor = 'emerald',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
    }
  }, []);

  const startRecording = async () => {
    setMicPermissionDenied(false);
    setSavedSuccess(false);

    try {
      // 1. Request Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Setup MediaRecorder for audio recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();

      // 3. Setup Speech Recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition error:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);
      setRecordingTime(0);

      // Recording duration timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      setMicPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayAudio = () => {
    if (!audioUrl) return;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setAudioUrl(null);
    setRecordingTime(0);
    setSavedSuccess(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
  };

  const handleSave = () => {
    if (!transcript.trim()) return;

    onSaveVoiceNote({
      transcript: transcript.trim(),
      audioUrl: audioUrl || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      handleClear();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const colorStyles = {
    emerald: {
      activeBg: 'bg-emerald-500 text-zinc-950',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    amber: {
      activeBg: 'bg-amber-500 text-zinc-950',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    cyan: {
      activeBg: 'bg-cyan-500 text-zinc-950',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
  }[accentColor];

  return (
    <div className={`p-5 rounded-3xl bg-zinc-900/90 border ${colorStyles.border} shadow-xl space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-zinc-800 ${colorStyles.text}`}>
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">{title}</h3>
            <p className="text-[11px] text-zinc-400">Record speech to log notes using Web Speech API</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${colorStyles.badge}`}>
          Web Speech API
        </span>
      </div>

      {/* Permission Warning */}
      {micPermissionDenied && (
        <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Microphone access denied. Please allow mic permissions in your browser.</span>
        </div>
      )}

      {/* Main Recording Interface */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Record Button */}
        <button
          onClick={toggleRecording}
          className={`px-5 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
              : `${colorStyles.activeBg} ${colorStyles.glow} hover:opacity-90`
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Recording ({formatTime(recordingTime)})</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Record Voice Note</span>
            </>
          )}
        </button>

        {/* Audio Playback Controls if recorded */}
        {audioUrl && !isRecording && (
          <button
            onClick={handlePlayAudio}
            className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isPlaying ? 'Pause Audio' : 'Play Recorded Voice'}</span>
          </button>
        )}

        {/* Recording Wave Indicator */}
        {isRecording && (
          <div className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-zinc-950 rounded-2xl border border-zinc-800">
            <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce" />
            <span className="w-1.5 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="text-xs font-bold text-rose-400 ml-2">Listening...</span>
          </div>
        )}
      </div>

      {/* Live Transcript Display */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none leading-relaxed"
        />

        {transcript && (
          <button
            onClick={handleClear}
            className="absolute top-2.5 right-2.5 p-1.5 text-zinc-500 hover:text-zinc-300 bg-zinc-900 rounded-lg transition-colors"
            title="Clear transcript"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{transcript ? `${transcript.split(/\s+/).filter(Boolean).length} words transcribed` : 'Ready for voice input'}</span>
        </div>

        {savedSuccess ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Voice Note Saved!</span>
          </div>
        ) : (
          <button
            disabled={!transcript.trim() || isRecording}
            onClick={handleSave}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Save Voice Note</span>
          </button>
        )}
      </div>
    </div>
  );
};
