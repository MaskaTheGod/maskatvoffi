import React, { useState, useRef, useEffect } from 'react';
import '../styles/SplashScreen.css';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [animationState, setAnimationState] = useState<'initial' | 'centered' | 'revealed' | 'fadeOut'>('initial');
  const [startScreen, setStartScreen] = useState(true);
  const [transitionInProgress, setTransitionInProgress] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio element programmatically instead of in JSX
    const audio = new Audio();
    audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-transition-sweep-495.mp3'; // Using a placeholder URL that's publicly available
    audio.preload = 'auto';
    audio.volume = 0.7;
    
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    
    audioRef.current = audio;
    
    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Add mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen for 3D effect
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10 degree rotation
      const y = (e.clientY / window.innerHeight - 0.5) * 20; // -10 to 10 degree rotation
      
      setMousePosition({ x, y: -y }); // Invert Y for natural tilt movement
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Helper function to play audio safely
  const playAudio = () => {
    if (audioRef.current && audioLoaded) {
      // Reset to beginning to ensure it plays again
      audioRef.current.currentTime = 0;
      
      // Use Promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio playback was prevented by browser:', error);
        });
      }
    }
  };

  // Start the splash animation sequence
  const startAnimation = () => {
    // First animation: M moves to center
    setTimeout(() => {
      setAnimationState('centered');
    }, 1000);
    
    // Second animation: Full logo reveal
    setTimeout(() => {
      setAnimationState('revealed');
      playAudio();
    }, 2800);
    
    // Third animation: Fade out
    setTimeout(() => {
      setAnimationState('fadeOut');
    }, 5000);
    
    // Remove splash screen after animation completes
    setTimeout(() => {
      onFinish();
    }, 6000);
  };

  // Handle click on the start screen with smooth transition
  const handleStart = () => {
    if (transitionInProgress) return;
    
    setTransitionInProgress(true);
    
    // Fade out the start screen first
    document.querySelector('.start-screen')?.classList.add('fade-out');
    
    // Try to play audio first to handle user interaction requirement
    playAudio();
    
    // Smoothly transition to the animation sequence
    setTimeout(() => {
      setStartScreen(false);
      startAnimation();
    }, 800);
  };
  
  // Add user interaction handler for during animation to help with audio autoplay
  const handleUserInteraction = () => {
    playAudio();
  };

  // Render the click-to-start screen
  if (startScreen) {
    return (
      <div 
        className="start-screen" 
        onClick={handleStart}
        style={{
          cursor: transitionInProgress ? 'default' : 'pointer',
        }}
      >
        <div className="gradient-background"></div>
        
        <div className="start-content" style={{
          transform: `rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg) translateZ(20px)`
        }}>
          <div className="logo-container">
            <div className="logo-glow"></div>
            <svg className="start-logo" width="160" height="160" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10L50 4L90 10L50 116L10 10Z" fill="url(#mGradient)" />
              <defs>
                <linearGradient id="mGradient" x1="10" y1="4" x2="90" y2="116" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#FF4D6D" />
                  <stop offset="1" stopColor="#FF1048" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="brand-name">
            <span className="brand-text">MASKA</span>
            <span className="brand-accent">.FR</span>
          </div>
          
          <div className="start-prompt">
            <div className="start-btn">
              <span>ENTER EXPERIENCE</span>
            </div>
          </div>
        </div>
        
        <div className="background-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>
    );
  }

  // Render the main splash animation
  return (
    <div 
      className={`splash-screen ${animationState}`}
      onClick={handleUserInteraction}
      onKeyDown={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <div className="splash-background"></div>
      
      <div className="splash-content" style={{
        transform: animationState === 'revealed' 
          ? `rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)` 
          : 'none'
      }}>
        {/* Text logo placed FIRST in DOM to be visually BEHIND */}
        
        {/* M logo placed SECOND in DOM but initially has higher z-index */}
        <div className="m-logo">
          <svg width="120" height="140" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10L50 4L90 10L50 116L10 10Z" fill="url(#mGradient)" />
            <defs>
              <linearGradient id="mGradient" x1="10" y1="4" x2="90" y2="116" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FF4D6D" />
                <stop offset="1" stopColor="#FF1048" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Ambient light effects */}
      <div className="ambient-lights">
        <div className="light light-1"></div>
        <div className="light light-2"></div>
        <div className="light light-3"></div>
      </div>

      {/* Animated particles for the revealed state */}
      <div className="splash-particles">
        {[...Array(24)].map((_, i) => (
          <div key={i} className={`splash-particle splash-particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
};

export default SplashScreen; 