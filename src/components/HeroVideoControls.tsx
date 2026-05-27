interface HeroVideoControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function HeroVideoControls({ isMuted, onToggleMute }: HeroVideoControlsProps) {
  return (
    <div className="hero-controls">
      <div className="hero-sound-badge glass" aria-live="polite">
        {isMuted ? 'Tap to hear intro' : 'Sound on'}
      </div>

      <button
        type="button"
        onClick={onToggleMute}
        className="hero-controls__btn glass"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M11 5L6 9H3v6h3l5 4V5z" />
            <path d="M16 9l4 4M20 9l-4 4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M11 5L6 9H3v6h3l5 4V5z" />
            <path d="M15 9.5a4.5 4.5 0 010 5M17.5 7a7.5 7.5 0 010 10" />
          </svg>
        )}
      </button>
    </div>
  );
}
