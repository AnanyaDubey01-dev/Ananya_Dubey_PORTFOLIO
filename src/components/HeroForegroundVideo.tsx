import { forwardRef } from 'react';

interface HeroForegroundVideoProps {
  videoSrc: string;
  isMuted: boolean;
}

const HeroForegroundVideo = forwardRef<HTMLVideoElement, HeroForegroundVideoProps>(
  ({ videoSrc, isMuted }, ref) => {
    return (
      <div className="hero-foreground-video hero-gpu-layer">
        <video
          ref={ref}
          src={videoSrc}
          className="hero-foreground-video__element"
          muted={isMuted}
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          tabIndex={-1}
        />
      </div>
    );
  }
);

HeroForegroundVideo.displayName = 'HeroForegroundVideo';

export default HeroForegroundVideo;
