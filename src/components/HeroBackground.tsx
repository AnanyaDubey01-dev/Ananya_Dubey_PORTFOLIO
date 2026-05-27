import { forwardRef } from 'react';

interface HeroBackgroundProps {
  videoSrc: string;
}

const HeroBackground = forwardRef<HTMLVideoElement, HeroBackgroundProps>(
  ({ videoSrc }, ref) => {
    return (
      <div className="hero-ambient-layer absolute inset-0 overflow-hidden">
        <video
          ref={ref}
          src={videoSrc}
          className="hero-ambient-video pointer-events-none"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
        />
        <div className="hero-ambient-overlay pointer-events-none absolute inset-0" />
      </div>
    );
  }
);

HeroBackground.displayName = 'HeroBackground';

export default HeroBackground;
