"use client"

import { motion } from "framer-motion"
import styled from "@emotion/styled"
import { useEffect, useState } from "react"
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import SplashScreen from "./components/SplashScreen"
import LearnMorePage from "./components/LearnMorePage"
import NotFoundPage from "./components/NotFoundPage"
import Header from "./components/Header"
import AboutUsPage from './components/AboutUsPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsOfServicePage from './components/TermsOfServicePage'
import FAQPage from './components/FAQPage'
// import HelpCenterPage from './components/HelpCenterPage'
import ContactUsPage from './components/ContactUsPage'
import TestPage from './components/TestPage'

// Style for the main container
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`

// Background container
const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  overflow: hidden;
`

// Content container
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
  pointer-events: none; /* Changed to none so clicks pass through to background */
`

// Header logo component
// const HeaderLogo = styled(motion.div)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin: 0;
// `

// Main logo component
const MainLogo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6rem;
  position: relative;
  top: 80px;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MaskaText = styled(motion.h1)`
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.15));
`


const Tagline = styled(motion.h2)`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 700px;
  margin-bottom: 7rem;
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: 0.3px;
  position: relative;
  top: 60px;
`

const ActionContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 5rem;
  pointer-events: auto; /* Enable pointer events for buttons */
`

const WatchButton = styled(motion.button)`
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
  pointer-events: auto;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 0 40px rgba(255, 77, 109, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`

const LearnMoreButton = styled(motion.button)`
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  backdrop-filter: blur(10px);
  pointer-events: auto;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`

const HighlightText = styled.span`
  color: #FF4D6D;
  font-weight: 400;
`

const Features = styled(motion.div)`
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
  pointer-events: auto; /* Enable pointer events for features */
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  flex-wrap: wrap;
  
`

const Feature = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
  background: rgba(255,77,109,0.05);
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255,77,109,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,77,109,0.1);
    transform: translateY(-5px);
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: rgba(255,77,109,0.1);
  border-radius: 50%;
  padding: 1rem;
  pointer-events: none;
  svg {
    width: 100%;
    height: 100%;
    color: white;
  }
`

const FeatureText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.5;
  font-weight: 500;
  cursor: pointer;
`

// Gradient overlay to add depth
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  z-index: 15; /* Changed from 25 to 15 to be below content but above background */
  pointer-events: none;
`

// Add a new styled component for the TV text in the main logo
const TVText = styled(motion.span)`
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
  filter: drop-shadow(0 0 15px rgba(255, 20, 72, 0.4));
`

function App() {
  const [loaded, setLoaded] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Add event listener for mouse movements
  useEffect(() => {
    // Create handler for mouse movement that works with Spline backgrounds
    const handleMouseMove = (e: MouseEvent) => {
      // Get the iframe element
      const backgroundIframe = document.querySelector('iframe[title="Interactive Background"]') as HTMLIFrameElement

      // Make sure we have access to the iframe
      if (backgroundIframe && backgroundIframe.contentWindow) {
        try {
          // Coordinate calculation - calculate relative position in the iframe
          const bounds = backgroundIframe.getBoundingClientRect()
          const x = e.clientX - bounds.left
          const y = e.clientY - bounds.top

          // Send mouse position to the iframe - with both absolute and relative coordinates
          backgroundIframe.contentWindow.postMessage(
            {
              type: "PARENT_MOUSE_MOVE",
              x: e.clientX,
              y: e.clientY,
              relativeX: x,
              relativeY: y,
            },
            "*",
          )
        } catch (error) {
          console.error("Error communicating with iframe:", error)
        }
      }
    }

    // Add listeners
    window.addEventListener("mousemove", handleMouseMove)

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleWatchClick = () => {
    console.log("Watch clicked!")
    // Add your button click logic here
  }

  const handleSplashFinish = () => {
    setShowSplash(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  }

  // Only show the splash screen on the home page route and only for the first visit
  const HomePage = () => {
    return (
      <>
        {showSplash && location.pathname === "/" ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <AppContainer>
            <BackgroundContainer>
              <iframe
                src="https://maskaworld.org/background.html"
                title="Interactive Background"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  pointerEvents: "auto", // Explicitly set to auto
                }}
              />
            </BackgroundContainer>

            <GradientOverlay />

            <Header />

            <ContentContainer>
              <MainLogo
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <LogoContainer>
                  <MaskaText>MASKA</MaskaText>
                  <TVText>.TV</TVText>
                </LogoContainer>
              </MainLogo>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={loaded ? "visible" : "hidden"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tagline variants={itemVariants}>
                  Experience <HighlightText>premium entertainment</HighlightText> reimagined.
                </Tagline>

                <ActionContainer variants={itemVariants}>
                  <WatchButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={handleWatchClick}>
                    Start Watching
                  </WatchButton>

                  <LearnMoreButton whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/learn-more")}>
                    Learn More
                  </LearnMoreButton>
                  
                </ActionContainer>

                <Features variants={itemVariants}>
                  <Feature>
                    <FeatureIcon>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z" fill="rgba(255,77,109,0.15)" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M9 21L15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="17" cy="9" r="1" fill="currentColor"/>
                        <circle cx="7" cy="15" r="1" fill="currentColor"/>
                        <path d="M7 9H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </FeatureIcon>
                    <FeatureText>Stream in 4K Ultra HD with Dolby Atmos sound</FeatureText>
                  </Feature>

                  <Feature>
                    <FeatureIcon>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,77,109,0.15)"/>
                        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </FeatureIcon>
                    <FeatureText>Download content for offline viewing anytime</FeatureText>
                  </Feature>

                  <Feature>
                    <FeatureIcon>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect
                          x="5"
                          y="3"
                          width="14"
                          height="10"
                          rx="2"
                          fill="rgba(255,77,109,0.15)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="2"
                          y="15"
                          width="8"
                          height="6"
                          rx="1"
                          fill="rgba(255,77,109,0.15)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <rect
                          x="14"
                          y="15"
                          width="8"
                          height="6"
                          rx="1"
                          fill="rgba(255,77,109,0.15)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 13v3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </FeatureIcon>
                    <FeatureText>Watch on any device, anytime, anywhere</FeatureText>
                  </Feature>
                </Features>
              </motion.div>
            </ContentContainer>
          </AppContainer>
        )}
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/learn-more" element={<LearnMorePage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

