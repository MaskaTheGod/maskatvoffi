import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  overflow-y: auto;
  overflow-x: hidden;
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
`;

// Hero section
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
  font-size: clamp(3rem, 8vw, 7rem);
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
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  text-align: center;
  max-width: 800px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  padding: 0 1rem;
  font-weight: 300;
  z-index: 2;
`;

const Highlight = styled.span`
  color: #FF4D6D;
  font-weight: 500;
`;

// About section components
const Section = styled(motion.section)`
  padding: 8rem 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  scroll-snap-align: start;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(255, 20, 72, 0.2));
`;

const SectionContent = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const StoryBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
  
  @media (min-width: 992px) {
    flex-direction: row;
    align-items: center;
    
    &:nth-of-type(even) {
      flex-direction: row-reverse;
    }
  }
`;

const StoryImage = styled(motion.div)<{ imageUrl: string }>`
  width: 100%;
  max-width: 500px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.imageUrl});
    background-size: cover;
    background-position: center;
    filter: brightness(0.9) contrast(1.1);
    transition: transform 0.5s ease;
  }
  
  &:hover::before {
    transform: scale(1.05);
  }
  
  @media (min-width: 992px) {
    width: 45%;
  }
`;

const StoryText = styled(motion.div)`
  width: 100%;
  
  @media (min-width: 992px) {
    width: 50%;
  }
`;

const StoryTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StoryParagraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

// Team section components
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
`;

const TeamMember = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TeamMemberPhoto = styled(motion.div)<{ photoUrl: string }>`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.photoUrl});
    background-size: cover;
    background-position: center;
    filter: brightness(0.9) contrast(1.1);
    transition: transform 0.5s ease;
  }
  
  &:hover::before {
    transform: scale(1.1);
  }
`;

const TeamMemberName = styled.h4`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TeamMemberTitle = styled.p`
  font-size: 1rem;
  color: #FF4D6D;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TeamMemberBio = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

// Values section components
const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
`;

const ValueCard = styled(motion.div)`
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

const ValueIcon = styled.div`
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

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const ValueDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
`;

// Footer components
const Footer = styled(motion.div)`
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

// Parallax animation elements
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

// Animation variants
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
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Main component
const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<{ id: number; size: number; color: string; top: string; left: string; delay: number }[]>([]);
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Section references
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);
  const valuesRef = useRef(null);

  // Section visibility
  const storyOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0, 1, 1]);
  const teamOpacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0, 1, 1]);
  const valuesOpacity = useTransform(scrollYProgress, [0.65, 0.8, 0.9], [0, 1, 1]);

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

  // Smooth scrolling effects
  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      const currentProgress = scrollYProgress.get();
      const enhancedProgress = currentProgress < 0.1 
        ? currentProgress * 3 
        : 0.3 + (currentProgress - 0.1) * 0.7;
      
      const dampedProgress = smoothProgress + (enhancedProgress - smoothProgress) * 0.15;
      setSmoothProgress(dampedProgress);
      
      rafId = requestAnimationFrame(handleScroll);
    };
    
    rafId = requestAnimationFrame(handleScroll);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress, smoothProgress]);

  // Transform functions
  const getTranslateY = (progress: number) => {
    const enhancedProgress = Math.pow(progress, 0.7);
    return `translateY(${enhancedProgress * -200}px)`;
  };
  
  const getRotate = (progress: number) => {
    const enhancedProgress = Math.pow(progress, 0.7);
    return `rotate(${enhancedProgress * 15}deg)`;
  };
  
  const getScale = (progress: number) => {
    const enhancedProgress = Math.pow(progress, 0.7);
    return `scale(${1 + (enhancedProgress * 0.25)})`;
  };

  // Team members data
  const teamMembers = [
    {
      name: "Alexandra Chen",
      title: "Founder & CEO",
      bio: "Former Netflix executive with a passion for storytelling and immersive experiences. Visionary behind Maska.FR's unique approach to content curation.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
      name: "David Rodriguez",
      title: "Chief Technology Officer",
      bio: "Tech innovator with 15+ years in streaming platforms. Led development of Maska.FR's groundbreaking 8K streaming technology.",
      photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
      name: "Sophia Thompson",
      title: "Chief Content Officer",
      bio: "Award-winning producer who oversees Maska.FR's exclusive content development and acquisition strategy across global markets.",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
      name: "Michael Kim",
      title: "Head of User Experience",
      bio: "UX visionary responsible for Maska.FR's intuitive, accessible, and groundbreaking interface across all platforms and devices.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    }
  ];

  // Company values data
  const companyValues = [
    {
      title: "Innovation",
      description: "We push boundaries to create revolutionary entertainment experiences, always staying ahead of industry trends.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 8L12 14L20 8L12 2Z" fill="rgba(255,77,109,0.15)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 14L12 20L20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Excellence",
      description: "We are committed to delivering the highest quality in content, technology, and customer experience.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15L8.5 11.5L9.91 10.09L12 12.17L16.18 8L17.59 9.41L12 15Z" fill="rgba(255,77,109,0.15)"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      title: "Diversity",
      description: "We celebrate diverse voices and perspectives, ensuring our content resonates with global audiences.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="rgba(255,77,109,0.15)" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <Container ref={containerRef}>
      {/* Background Particles */}
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
              transform: `scale(${1 + (smoothProgress * 0.5)})`
            }}
          />
        ))}
      </BackgroundParticles>
      
      <BackgroundGlow 
        style={{ 
          transform: `${getTranslateY(smoothProgress)} ${getRotate(smoothProgress)} ${getScale(smoothProgress)}`
        }} 
      />
      
      {/* Floating elements */}
      <FloatingElement 
        size={400} 
        top="20%" 
        left="10%" 
        opacity={0.2}
        style={{ 
          transform: `translateY(${-150 * Math.pow(smoothProgress, 0.7)}px) scale(${1 + 0.3 * smoothProgress}) rotate(${15 * smoothProgress}deg)`
        }}
      />
      
      <FloatingElement 
        size={300} 
        top="60%" 
        left="70%" 
        opacity={0.15}
        style={{ 
          transform: `translateY(${-200 * Math.pow(smoothProgress, 0.7)}px) scale(${1 - 0.3 * smoothProgress}) rotate(${-20 * smoothProgress}deg)`
        }}
      />
      
      <FloatingElement 
        size={200} 
        top="80%" 
        left="30%" 
        opacity={0.1}
        style={{ 
          transform: `translateY(${-180 * Math.pow(smoothProgress, 0.7)}px) scale(${1 + 0.8 * smoothProgress}) rotate(${25 * smoothProgress}deg)`
        }}
      />
      
      {/* Header */}
      <Header fixed={true} />
      
      <ContentWrapper>
        {/* Hero Section */}
        <HeroSection ref={heroRef}>
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", damping: 15 }}
          >
            <HeroTitle>Our Story</HeroTitle>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.3, type: "spring", damping: 12 }}
          >
            <HeroSubtitle>
              Discover how Maska.FR is <Highlight>revolutionizing entertainment</Highlight> through cutting-edge technology, visionary leadership, and a passion for extraordinary content.
            </HeroSubtitle>
          </motion.div>
        </HeroSection>
        
        {/* Company Story Section */}
        <Section 
          ref={storyRef}
          style={{ opacity: storyOpacity }}
        >
          <SectionTitle
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, type: "spring", damping: 15 }}
          >
            The Maska.FR Journey
          </SectionTitle>
          
          <SectionContent>
            <StoryBlock
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <StoryImage 
                imageUrl="https://images.unsplash.com/photo-1601944179066-29786cb9d32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              />
              <StoryText>
                <StoryTitle>Our Beginning</StoryTitle>
                <StoryParagraph>
                  Founded in 2022, Maska.FR began with a revolutionary vision: to create an entertainment platform that would transcend traditional streaming services. Our founders, a team of industry veterans and tech innovators, recognized the limitations of existing platforms and set out to build something extraordinary.
                </StoryParagraph>
                <StoryParagraph>
                  Unlike conventional streaming services, Maska.FR was designed from the ground up to deliver content in ways never before possible—combining cinematic quality with cutting-edge technology to create truly immersive viewing experiences.
                </StoryParagraph>
              </StoryText>
            </StoryBlock>
            
            <StoryBlock
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <StoryImage 
                imageUrl="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              />
              <StoryText>
                <StoryTitle>Innovation at Our Core</StoryTitle>
                <StoryParagraph>
                  The first breakthrough came with our proprietary 8K streaming technology, developed through three years of intensive research. This innovation allowed us to deliver crystal-clear visuals with zero buffering—a technological achievement that quickly distinguished Maska.FR in the competitive streaming landscape.
                </StoryParagraph>
                <StoryParagraph>
                  Our engineering team, comprised of former leaders from Silicon Valley's tech giants, continues to push the boundaries of what's possible in digital entertainment, developing new ways to enhance the viewing experience.
                </StoryParagraph>
              </StoryText>
            </StoryBlock>
            
            <StoryBlock
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <StoryImage 
                imageUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              />
              <StoryText>
                <StoryTitle>Global Impact</StoryTitle>
                <StoryParagraph>
                  Today, Maska.FR serves millions of subscribers across 190 countries, with a library of over 10,000 exclusive titles. Our original productions have garnered critical acclaim, including 28 Emmy Awards and 12 Academy Award nominations.
                </StoryParagraph>
                <StoryParagraph>
                  Beyond entertainment, we're committed to sustainability and social responsibility. Our carbon-neutral streaming infrastructure and commitment to diverse storytelling reflect our belief that great entertainment can also be a force for good.
                </StoryParagraph>
              </StoryText>
            </StoryBlock>
          </SectionContent>
        </Section>
        
        {/* Team Section */}
        <Section 
          ref={teamRef}
          style={{ opacity: teamOpacity }}
        >
          <SectionTitle
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, type: "spring", damping: 15 }}
          >
            Visionary Leadership
          </SectionTitle>
          
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <TeamMemberPhoto 
                  photoUrl={member.photo}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <TeamMemberName>{member.name}</TeamMemberName>
                <TeamMemberTitle>{member.title}</TeamMemberTitle>
                <TeamMemberBio>{member.bio}</TeamMemberBio>
              </TeamMember>
            ))}
          </TeamGrid>
        </Section>
        
        {/* Values Section */}
        <Section 
          ref={valuesRef}
          style={{ opacity: valuesOpacity }}
        >
          <SectionTitle
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, type: "spring", damping: 15 }}
          >
            Our Core Values
          </SectionTitle>
          
          <ValuesGrid>
            {companyValues.map((value, index) => (
              <ValueCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  y: -15, 
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 77, 109, 0.2)",
                  transition: { duration: 0.5 }
                }}
              >
                <ValueIcon>
                  {value.icon}
                </ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Section>
      </ContentWrapper>
      
      {/* Footer */}
      <Footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.0 }}
      >
        <FooterLogo>
          <div style={{ 
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            margin: 0,
            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.15))'
          }}>
            MASKA
          </div>
          <span style={{ 
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #FF4D6D, #FF1048)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            margin: 0,
            filter: 'drop-shadow(0 0 15px rgba(255, 20, 72, 0.4))'
          }}>
            .FR
          </span>
        </FooterLogo>
        
        <FooterLinks />
      </Footer>
    </Container>
  );
};

export default AboutUsPage; 