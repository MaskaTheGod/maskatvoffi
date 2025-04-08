import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
  pointer-events: none;
`;

const Title = styled(motion.h1)`
  font-size: 8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(255, 20, 72, 0.4));
`;

const SubTitle = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const HomeButton = styled(motion.button)`
  padding: 1rem 3rem;
  font-size: 1.1rem;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 0 30px rgba(255, 77, 109, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 0 40px rgba(255, 77, 109, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

// Styled component for the glowing button
const GlowButton = styled.button`
  --glow-color: rgb(217, 176, 255);
  --glow-spread-color: rgb(81 55 107 / 78%);
  --enhanced-glow-color: rgb(231, 206, 255);
  --btn-color: rgb(100, 61, 136);
  border: .25em solid var(--glow-color);
  padding: 1em 3em;
  color: var(--glow-color);
  font-size: 15px;
  font-weight: bold;
  background-color: var(--btn-color);
  border-radius: 1em;
  outline: none;
  box-shadow: 0 0 1em .25em var(--glow-color),
         0 0 4em 1em var(--glow-spread-color),
         inset 0 0 .75em .25em var(--glow-color);
  text-shadow: 0 0 .5em var(--glow-color);
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
  pointer-events: auto;

  &::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 120%;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(2em);
    opacity: .7;
    transform: perspective(1.5em) rotateX(35deg) scale(1, .6);
  }

  &:hover {
    color: var(--btn-color);
    background-color: rgb(217, 176, 255);
    box-shadow: 0 0 1em .25em var(--glow-color),
           0 0 4em 2em var(--glow-spread-color),
           inset 0 0 .75em .25em var(--glow-color);
  }

  &:active {
    box-shadow: 0 0 0.6em .25em var(--glow-color),
           0 0 2.5em 2em var(--glow-spread-color),
           inset 0 0 .5em .25em var(--glow-color);
  }
`;

interface NotFoundPageProps {
  onHome?: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onHome }) => {
  const navigate = useNavigate();
  
  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      navigate('/');
    }
  };
  
  useEffect(() => {
    // Create handler for mouse movement that works with the 404 page
    const handleMouseMove = (e: MouseEvent) => {
      // Get the iframe element
      const backgroundIframe = document.querySelector('iframe[title="404 Background"]') as HTMLIFrameElement;

      // Make sure we have access to the iframe
      if (backgroundIframe && backgroundIframe.contentWindow) {
        try {
          // Coordinate calculation - calculate relative position in the iframe
          const bounds = backgroundIframe.getBoundingClientRect();
          const x = e.clientX - bounds.left;
          const y = e.clientY - bounds.top;

          // Send mouse position to the iframe
          backgroundIframe.contentWindow.postMessage(
            {
              type: "PARENT_MOUSE_MOVE",
              x: e.clientX,
              y: e.clientY,
              relativeX: x,
              relativeY: y,
            },
            "*"
          );
        } catch (error) {
          console.error("Error communicating with iframe:", error);
        }
      }
    };

    // Add listeners
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Container>
      <BackgroundContainer>
        <iframe
          src="https://maskaworld.org/404.html"
          title="404 Background"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "auto",
          }}
        />
      </BackgroundContainer>
      
      <ContentContainer>
        <GlowButton 
          onClick={() => navigate('/')}
          style={{
            position: 'relative',
            zIndex: 30,
            marginTop: '25rem',
          }}
        >
          Go Back
        </GlowButton>
      </ContentContainer>
    </Container>
  );
};

export default NotFoundPage; 