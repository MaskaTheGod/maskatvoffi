import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from './Header';
import FooterLinks from './FooterLinks';

// Main container with dark theme
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000000;
  color: white;
  position: relative;
  font-family: 'Montserrat', 'Inter', sans-serif;
  overflow-y: auto; /* Make the main container scrollable */
  overflow-x: hidden;
  
  /* Scroll snap properties - changed from mandatory to proximity for smoother scrolling */
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 12px;
    display: block;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #FF1048, #FF4D6D);
    border-radius: 6px;
    border: 2px solid #000;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #FF4D6D, #FF1048);
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #FF1048 #000000;
`;

// Background elements
const BackgroundParticles = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
`;

const Particle = styled.div<{ size: number; color: string; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(4px);
  animation: float 15s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(50px, 50px) rotate(120deg);
    }
    66% {
      transform: translate(-30px, 20px) rotate(240deg);
    }
  }
`;

const BackgroundGlow = styled(motion.div)`
  position: fixed;
  top: 30%;
  left: 20%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle at center, rgba(255, 77, 109, 0.15) 0%, transparent 70%);
  z-index: 2;
  filter: blur(120px);
  pointer-events: none;
`;

// Main content components
const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  /* Remove height and overflow since Container handles scrolling now */
`;

const HeroSection = styled(motion.div)`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  padding-top: 120px; /* Add padding to account for fixed header */
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 900;
  text-align: center;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  line-height: 1.1;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
  z-index: 10;
  position: relative;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateZ(0);
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  text-align: center;
  max-width: 800px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  font-weight: 300;
  z-index: 2;
`;

const Highlight = styled.span`
  color: #FF4D6D;
  font-weight: 500;
`;

const ScrollPrompt = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const ScrollIcon = styled(motion.div)`
  width: 30px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    animation: scrollDown 2s infinite;
  }
  
  @keyframes scrollDown {
    0% {
      opacity: 1;
      top: 10px;
    }
    100% {
      opacity: 0;
      top: 30px;
    }
  }
`;

// Feature section components
const FeatureSection = styled(motion.section)`
  padding: 6rem 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 4rem;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(255, 20, 72, 0.2));
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(255, 77, 109, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 77, 109, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 77, 109, 0.1);
  border-radius: 50%;
  padding: 1.5rem;
  
  svg {
    width: 100%;
    height: 100%;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
`;

// Call to action section
const CTASection = styled(motion.section)`
  padding: 8rem 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  margin-top: 4rem;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const CTATitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 900px;
`;

const CTAText = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.3rem);
  max-width: 700px;
  margin-bottom: 3rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
`;

const CTAButton = styled(motion.button)`
  padding: 1.2rem 3.5rem;
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

// Footer components
const Footer = styled(motion.footer)`
  padding: 4rem 2rem;
  min-height: 50vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

// Parallax animation images
const FloatingElement = styled(motion.div)<{ size: number, top: string, left: string, opacity: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  background: radial-gradient(circle at center, rgba(255, 77, 109, ${props => props.opacity}) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 1;
`;

// Footer Section
const FooterSection = styled.div`
  width: 100%;
  padding: 4rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LearnMorePageProps {
  onBack?: () => void;
}

// Enhance the variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

const LearnMorePage: React.FC<LearnMorePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    // Add smooth damping to make scrolling feel more controlled
    offset: ["start start", "end end"],
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<{ id: number; size: number; color: string; top: string; left: string; delay: number }[]>([]);
  // Track smooth scroll progress
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Create refs for each section
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Add scroll progress for each section with slower transitions
  const featuresScrollProgress = useTransform(
    scrollYProgress, 
    [0.05, 0.2, 0.4], // Begin transitions much earlier (reduced from [0.1, 0.4, 0.6])
    [0, 0.5, 1]
  );
  
  const ctaScrollProgress = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7], // Begin transitions much earlier (reduced from [0.6, 0.8, 1])
    [0, 0.5, 1] 
  );

  // Generate random particles on mount
  useEffect(() => {
    const colors = [
      'rgba(255, 77, 109, 0.3)',
      'rgba(255, 255, 255, 0.2)',
      'rgba(100, 61, 136, 0.3)'
    ];
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, []);

  // Track scroll position for animation triggers
  const [currentSection, setCurrentSection] = useState(0);
  
  // Implement smooth scrolling with damping effect
  useEffect(() => {
    let rafId: number;
    
    // Create smooth damping effect for scroll progress
    const handleScroll = () => {
      // Get current raw progress
      const currentProgress = scrollYProgress.get();
      
      // Apply enhanced sensitivity to early scrolling
      // This multiplier makes initial scrolling have a greater effect 
      const enhancedProgress = currentProgress < 0.1 
        ? currentProgress * 3 // Triple the effect for first 10% of scrolling
        : 0.3 + (currentProgress - 0.1) * 0.7; // Then scale the rest to fit remaining range
        
      // Apply damping/smoothing to the progress - increased factor for faster response
      const dampedProgress = smoothProgress + (enhancedProgress - smoothProgress) * 0.15; // Increased from 0.1 to 0.15
      
      // Update smooth progress
      setSmoothProgress(dampedProgress);
      
      // Check which section is in view
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition < windowHeight * 0.3) { // Reduced from 0.5 to detect section changes earlier
        setCurrentSection(0);
      } else if (scrollPosition < windowHeight * 1.2) { // Reduced from 1.5
        setCurrentSection(1);
      } else {
        setCurrentSection(2);
      }
      
      // Continue animation loop
      rafId = requestAnimationFrame(handleScroll);
    };
    
    // Start animation loop
    rafId = requestAnimationFrame(handleScroll);
    
    // Clean up
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress, smoothProgress]);

  // Faster transform value functions with enhanced early scrolling sensitivity
  const getTranslateY = (progress: number) => {
    // Non-linear curve that moves quickly at first
    const enhancedProgress = Math.pow(progress, 0.7); // Power less than 1 makes early changes more pronounced
    return `translateY(${enhancedProgress * -200}px)`; // Increased from -150 for more dramatic effect
  };
  
  const getRotate = (progress: number) => {
    const enhancedProgress = Math.pow(progress, 0.7);
    return `rotate(${enhancedProgress * 15}deg)`; // Increased from 10 to 15
  };
  
  const getScale = (progress: number) => {
    const enhancedProgress = Math.pow(progress, 0.7);
    return `scale(${1 + (enhancedProgress * 0.25)})`; // Increased from 0.15 to 0.25
  };
  
  const getTitleTransform = (progress: number) => {
    // Make initial scrolling have a bigger impact
    const enhancedProgress = Math.pow(progress, 0.6); // Even more pronounced for title
    const y = enhancedProgress * -100; // Increased from -75
    const scale = 1 - (enhancedProgress * 0.2); // Increased from 0.15
    const rotate = enhancedProgress * -5; // Increased from -3
    return `translateY(${y}px) scale(${scale}) rotateX(${rotate}deg)`;
  };
  
  const getSubtitleTransform = (progress: number) => {
    const enhancedProgress = Math.pow(progress, 0.7);
    const y = enhancedProgress * -50; // Increased from -35
    return `translateY(${y}px)`;
  };
  
  // Faster opacity transition
  const getOpacity = (progress: number) => {
    if (progress < 0.15) { // Reduced from 0.25 to make it fade faster with less scrolling
      return 1 - (progress * 6.67); // Adjusted for faster fade (1/0.15 = 6.67)
    }
    return 0;
  };

  return (
    <Container ref={containerRef}>
      {/* Background Particles with enhanced animations */}
      <BackgroundParticles 
        style={{ 
          transform: getTranslateY(smoothProgress)
        }}
      >
        {particles.map(particle => (
          <Particle 
            key={particle.id}
            size={particle.size}
            color={particle.color}
            delay={particle.delay}
            style={{ 
              top: particle.top, 
              left: particle.left,
              transform: `scale(${1 + (smoothProgress * 0.5)})` // Increased from 0.35 to 0.5
            }}
          />
        ))}
      </BackgroundParticles>
      
      <BackgroundGlow 
        style={{ 
          transform: `${getTranslateY(smoothProgress)} ${getRotate(smoothProgress)} ${getScale(smoothProgress)}`
        }} 
      />
      
      {/* Floating elements with more dramatic parallax effect */}
      <FloatingElement 
        size={400} 
        top="20%" 
        left="10%" 
        opacity={0.2}
        style={{ 
          transform: `translateY(${-150 * Math.pow(smoothProgress, 0.7)}px) scale(${1 + 0.3 * smoothProgress}) rotate(${15 * smoothProgress}deg)` // Increased movement
        }}
      />
      
      <FloatingElement 
        size={300} 
        top="60%" 
        left="70%" 
        opacity={0.15}
        style={{ 
          transform: `translateY(${-200 * Math.pow(smoothProgress, 0.7)}px) scale(${1 - 0.3 * smoothProgress}) rotate(${-20 * smoothProgress}deg)` // Increased movement
        }}
      />
      
      <FloatingElement 
        size={200} 
        top="80%" 
        left="30%" 
        opacity={0.1}
        style={{ 
          transform: `translateY(${-180 * Math.pow(smoothProgress, 0.7)}px) scale(${1 + 0.8 * smoothProgress}) rotate(${25 * smoothProgress}deg)` // Increased movement
        }}
      />
      
      {/* Header */}
      <Header fixed={true} />
      
      <ContentWrapper>
        {/* Hero Section with enhanced animations */}
        <HeroSection ref={heroRef}>
          <motion.div 
            style={{ 
              transform: getTitleTransform(smoothProgress)
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", damping: 15 }} // Faster animation
          >
            <HeroTitle>Premium Entertainment Experience</HeroTitle>
          </motion.div>
          
          <motion.div 
            style={{ 
              transform: getSubtitleTransform(smoothProgress),
              opacity: getOpacity(smoothProgress)
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.3, type: "spring", damping: 12 }} // Faster animation
          >
            <HeroSubtitle>
              Explore our curated collection of <Highlight>exclusive content</Highlight>, 
              featuring stunning 4K visuals and immersive Dolby Atmos sound. 
              Maska.FR redefines your streaming experience.
            </HeroSubtitle>
          </motion.div>
          
          <ScrollPrompt
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }} // Faster animation
          >
            <ScrollIcon 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }} // Faster animation
            />
            <span>Scroll to explore</span>
          </ScrollPrompt>
        </HeroSection>
        
        {/* Features Section with enhanced scroll-driven animations */}
        <FeatureSection
          ref={featuresRef}
          style={{ opacity: featuresScrollProgress.get() }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }} // More sensitive trigger
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3, // Faster stagger delay
                delayChildren: 0.2, 
                duration: 0.6
              }
            }
          }}
        >
          <SectionTitle
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, type: "spring", damping: 15 }} // Faster animation
          >
            Extraordinary Features
          </SectionTitle>
          
          <FeaturesGrid>
            {[
              {
                title: "4K Ultra HD Streaming",
                description: "Experience crystal-clear 4K resolution with HDR support for the ultimate viewing quality on compatible devices.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z" fill="rgba(255,77,109,0.15)" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 21L15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="17" cy="9" r="1" fill="currentColor"/>
                    <circle cx="7" cy="15" r="1" fill="currentColor"/>
                    <path d="M7 9H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )
              },
              {
                title: "Offline Viewing",
                description: "Download your favorite shows and movies to watch offline anytime, anywhere, without internet connection.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,77,109,0.15)"/>
                    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: "Unlimited Streaming",
                description: "Stream as much as you want, whenever you want, with no ads or interruptions for a seamless viewing experience.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="rgba(255,77,109,0.15)"/>
                    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )
              }
            ].map((feature, i) => (
              <FeatureCard
                key={i}
                custom={i}
                variants={{
                  hidden: { y: 100, opacity: 0 },
                  visible: { 
                    y: 0, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      damping: 10, // Faster bounce
                      stiffness: 70, // Increased stiffness for faster motion
                      duration: 0.9, // Faster duration
                      delay: i * 0.2 // Reduced delay between items
                    }
                  }
                }}
                whileHover={{ 
                  y: -15, 
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 77, 109, 0.2)",
                  transition: { duration: 0.5 } // Faster hover
                }}
              >
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>
                  {feature.description}
                </FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeatureSection>
        
        {/* CTA Section with enhanced scroll-driven animations */}
        <CTASection
          ref={ctaRef}
          style={{ opacity: ctaScrollProgress.get() }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3, // Faster stagger
                delayChildren: 0.2,
                duration: 0.7
              }
            }
          }}
        >
          <CTATitle
            variants={{
              hidden: { y: 80, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 12, // Faster bounce
                  stiffness: 70, // Increased stiffness
                  duration: 1.0 // Faster duration
                }
              }
            }}
          >
            Ready to Elevate Your Entertainment?
          </CTATitle>
          
          <CTAText
            variants={{
              hidden: { y: 80, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 12,
                  stiffness: 70,
                  duration: 1.0,
                  delay: 0.2
                }
              }
            }}
          >
            Join millions of viewers already enjoying premium content on Maska.FR. 
            Start your journey today with a 7-day free trial.
          </CTAText>
          
          <CTAButton
            variants={{
              hidden: { y: 80, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 12,
                  stiffness: 70,
                  duration: 1.0,
                  delay: 0.4
                }
              }
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 50px rgba(255, 77, 109, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.3)",
              transition: { duration: 0.5 } // Faster hover
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
          >
            Get Started
          </CTAButton>
        </CTASection>
      </ContentWrapper>
      
      {/* Footer with enhanced scroll-driven animations */}
      <FooterSection>
        <FooterLinks />
      </FooterSection>
    </Container>
  );
};

export default LearnMorePage; 