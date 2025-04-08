import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from './Header';
import FooterLinks from './FooterLinks';

// Main container
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000000;
  color: white;
  position: relative;
  font-family: 'Montserrat', 'Inter', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
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
const BackgroundGlow = styled.div`
  position: fixed;
  top: 30%;
  left: 20%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle at center, rgba(255, 77, 109, 0.08) 0%, transparent 70%);
  z-index: 1;
  filter: blur(120px);
  pointer-events: none;
`;

// Main content components
const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 120px 2rem 4rem;
`;

// Hero section
const HeroSection = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  position: relative;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  text-align: center;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  line-height: 1.1;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
  z-index: 10;
  position: relative;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 700px;
  margin-bottom: 3rem;
`;

// FAQ section
const FaqSection = styled(motion.section)`
  width: 100%;
  margin-bottom: 4rem;
`;

const FaqContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FaqCategory = styled(motion.div)`
  margin-bottom: 3rem;
`;

const CategoryTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(45deg, #FF4D6D, #FF1048);
    border-radius: 3px;
  }
`;

const FaqItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.04, 0.62, 0.23, 0.98);
  will-change: transform, box-shadow, border-color;
  transform: translateZ(0);
  
  &:hover {
    border-color: rgba(255, 77, 109, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 77, 109, 0.1);
    transform: translateY(-2px) translateZ(0);
  }
`;

const FaqQuestion = styled(motion.div)<{ isOpen: boolean }>`
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: ${props => props.isOpen ? '600' : '500'};
  color: ${props => props.isOpen ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  background-color: ${props => props.isOpen ? 'rgba(255, 77, 109, 0.05)' : 'transparent'};
  transition: all 0.4s cubic-bezier(0.04, 0.62, 0.23, 0.98);
  
  &:hover {
    color: white;
    background-color: ${props => props.isOpen ? 'rgba(255, 77, 109, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
  }
`;

const FaqAnswer = styled(motion.div)`
  padding: 0 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.7;
  overflow: hidden;
  will-change: max-height, opacity;
  transform: translateZ(0);
`;

const FaqAnswerContent = styled(motion.div)`
  padding-bottom: 1.5rem;
`;

const IconWrapper = styled(motion.div)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 77, 109, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 1rem;
`;

// Search component
const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 600px;
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 1.2rem 3rem 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: rgba(255, 77, 109, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(255, 77, 109, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
`;

// Footer
const FooterWrapper = styled.div`
  margin-top: 4rem;
`;

// Floating elements for visual interest
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
  pointer-events: none;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 90,
      mass: 0.8
    }
  }
};

// Icon components
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Frequently asked questions data
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "Subscription & Billing",
    items: [
      {
        question: "What subscription plans does Maska.TV offer?",
        answer: (
          <>
            <p>Maska.TV offers three subscription tiers:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.8rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Basic</strong> ($8.99/month): HD streaming on one device</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Standard</strong> ($14.99/month): 4K streaming on up to two devices simultaneously</li>
              <li><strong>Premium</strong> ($19.99/month): 4K Ultra HD with Dolby Atmos on up to four devices simultaneously, plus exclusive content</li>
            </ul>
            <p style={{ marginTop: '0.8rem' }}>All plans include ad-free viewing and access to our entire content library.</p>
          </>
        )
      },
      {
        question: "How does the free trial work?",
        answer: "New subscribers receive a 14-day free trial. You'll need to provide payment information when signing up, but you won't be charged until the trial period ends. You can cancel anytime during the trial period and won't be billed."
      },
      {
        question: "How do I cancel my subscription?",
        answer: "You can cancel your subscription at any time by going to your Account Settings and selecting 'Cancel Subscription'. Your subscription will remain active until the end of your current billing period. We don't offer refunds for partial subscription periods."
      },
      {
        question: "Will I be notified before my subscription renews?",
        answer: "Yes, we'll send you an email reminder three days before your subscription renews. You can also enable push notifications in your account settings to receive renewal reminders."
      },
      {
        question: "What payment methods are accepted?",
        answer: "Maska.TV accepts all major credit/debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. In select regions, we also support local payment methods."
      }
    ]
  },
  {
    title: "Content & Streaming",
    items: [
      {
        question: "What types of content are available on Maska.TV?",
        answer: "Maska.TV offers a diverse library of movies, TV shows, documentaries, and exclusive original productions. Our content spans various genres including drama, comedy, action, sci-fi, horror, and family-friendly programming. We regularly add new titles and produce original content exclusively for our platform."
      },
      {
        question: "Can I download content for offline viewing?",
        answer: "Yes, most titles on Maska.TV are available for download on mobile devices for offline viewing. Look for the download icon on eligible titles. Downloads remain available for 30 days and expire 48 hours after you start watching."
      },
      {
        question: "What video quality does Maska.TV offer?",
        answer: "Depending on your subscription plan and internet speed, Maska.TV offers streaming in SD (480p), HD (1080p), and 4K Ultra HD with HDR and Dolby Vision on select titles. We also offer Dolby Atmos audio on compatible devices with our Premium plan."
      },
      {
        question: "How many devices can I stream on simultaneously?",
        answer: "The number of devices you can stream on simultaneously depends on your subscription plan: Basic (1 device), Standard (2 devices), or Premium (4 devices)."
      },
      {
        question: "Does Maska.TV have parental controls?",
        answer: "Yes, Maska.TV offers comprehensive parental controls. You can create kids' profiles with age-appropriate content restrictions, set PIN-protected access to adult content, and monitor viewing activity for all profiles on your account."
      }
    ]
  },
  {
    title: "Technical Support",
    items: [
      {
        question: "What devices can I watch Maska.TV on?",
        answer: (
          <>
            <p>Maska.TV is available on a wide range of devices, including:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.8rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Smartphones and tablets (iOS and Android)</li>
              <li style={{ marginBottom: '0.5rem' }}>Web browsers (Chrome, Safari, Firefox, Edge)</li>
              <li style={{ marginBottom: '0.5rem' }}>Smart TVs (Samsung, LG, Sony, Vizio)</li>
              <li style={{ marginBottom: '0.5rem' }}>Streaming devices (Roku, Apple TV, Amazon Fire TV, Chromecast)</li>
              <li style={{ marginBottom: '0.5rem' }}>Gaming consoles (PlayStation, Xbox)</li>
            </ul>
          </>
        )
      },
      {
        question: "Why am I experiencing buffering or poor video quality?",
        answer: "Buffering or poor video quality is usually related to your internet connection. For optimal streaming, we recommend a minimum speed of 5 Mbps for HD content and 25 Mbps for 4K content. Try closing other applications, restarting your device, or connecting via ethernet cable instead of Wi-Fi for better performance."
      },
      {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login screen and click 'Forgot Password'. Enter the email address associated with your account, and we'll send you a password reset link. For security reasons, this link expires after 24 hours."
      },
      {
        question: "Can I watch Maska.TV while traveling abroad?",
        answer: "Yes, Maska.TV is available in over 190 countries. However, the content library may vary based on your location due to licensing restrictions. Some features may also be limited in certain regions. Downloaded content remains accessible regardless of your location."
      },
      {
        question: "My audio and video are out of sync. How can I fix this?",
        answer: "If you're experiencing audio/video sync issues, try these steps: (1) Refresh your browser or restart the app, (2) Clear the app cache, (3) Update your app to the latest version, (4) Restart your device, (5) Check if the issue occurs on other devices. If problems persist, please contact our support team."
      }
    ]
  },
  {
    title: "Account Management",
    items: [
      {
        question: "How many profiles can I create on my account?",
        answer: "You can create up to 5 profiles on a single Maska.TV account. Each profile maintains its own watchlist, viewing history, and personalized recommendations."
      },
      {
        question: "Can I share my account with family members?",
        answer: "Yes, Maska.TV allows account sharing among household members. Each person can create their own profile. However, the number of simultaneous streams is limited by your subscription plan. For security reasons, we may verify that shared accounts are within the same household."
      },
      {
        question: "How do I update my billing information?",
        answer: "To update your billing information, go to your Account Settings and select 'Payment Information'. From there, you can add, edit, or remove payment methods. Changes will apply to your next billing cycle."
      },
      {
        question: "Can I transfer my watch history and preferences to a new account?",
        answer: "Currently, we don't offer the ability to transfer watch history and preferences between accounts. If you create a new account, you'll need to rebuild your watchlist and viewing preferences."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, go to Account Settings and select 'Delete Account' at the bottom of the page. You'll need to confirm this action by entering your password. Please note that account deletion is permanent and removes all your profiles, viewing history, and saved preferences."
      }
    ]
  }
];

const FAQPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemOpen = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    return openItems[key] || false;
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqData.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.items.length > 0)
    : faqData;

  return (
    <Container ref={containerRef}>
      <Header fixed={true} />
      
      <BackgroundGlow />
      
      {/* Floating elements for visual interest */}
      <FloatingElement 
        size={400} 
        top="15%" 
        left="5%" 
        opacity={0.1}
        animate={{ 
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <FloatingElement 
        size={300} 
        top="60%" 
        left="80%" 
        opacity={0.08}
        animate={{ 
          x: [0, -20, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <ContentWrapper>
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Frequently Asked Questions</HeroTitle>
          <HeroSubtitle>
            Find answers to common questions about Maska.TV's subscription plans, features, and technical support.
          </HeroSubtitle>
          
          <SearchContainer>
            <SearchInput 
              placeholder="Search for a question..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <SearchIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </SearchIcon>
          </SearchContainer>
        </HeroSection>
        
        <FaqSection
          style={{ opacity: sectionOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredFaqs.map((category, categoryIndex) => (
            <FaqCategory 
              key={categoryIndex}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    delay: categoryIndex * 0.1,
                    ease: [0.04, 0.62, 0.23, 0.98]
                  } 
                }
              }}
            >
              <CategoryTitle>{category.title}</CategoryTitle>
              <FaqContainer>
                {category.items.map((item, itemIndex) => (
                  <FaqItem 
                    key={itemIndex}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={itemIndex}
                    transition={{ 
                      type: "spring",
                      damping: 15,
                      stiffness: 90,
                      mass: 0.8,
                      delay: itemIndex * 0.08 
                    }}
                  >
                    <FaqQuestion 
                      isOpen={isItemOpen(categoryIndex, itemIndex)}
                      onClick={() => toggleItem(categoryIndex, itemIndex)}
                      whileHover={{ 
                        backgroundColor: isItemOpen(categoryIndex, itemIndex) 
                          ? 'rgba(255, 77, 109, 0.07)' 
                          : 'rgba(255, 255, 255, 0.03)' 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.question}
                      <IconWrapper
                        animate={{ 
                          rotate: isItemOpen(categoryIndex, itemIndex) ? 180 : 0,
                          backgroundColor: isItemOpen(categoryIndex, itemIndex) 
                            ? 'rgba(255, 77, 109, 0.25)' 
                            : 'rgba(255, 77, 109, 0.1)'
                        }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.04, 0.62, 0.23, 0.98] 
                        }}
                      >
                        {isItemOpen(categoryIndex, itemIndex) ? <MinusIcon /> : <PlusIcon />}
                      </IconWrapper>
                    </FaqQuestion>
                    <AnimatePresence initial={false}>
                      {isItemOpen(categoryIndex, itemIndex) && (
                        <FaqAnswer
                          initial={{ maxHeight: 0, opacity: 0 }}
                          animate={{ 
                            maxHeight: 1000, 
                            opacity: 1,
                            transition: { 
                              maxHeight: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                              opacity: { duration: 0.25, delay: 0.15 }
                            }
                          }}
                          exit={{ 
                            maxHeight: 0, 
                            opacity: 0,
                            transition: { 
                              maxHeight: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                              opacity: { duration: 0.2 }
                            } 
                          }}
                        >
                          <FaqAnswerContent
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          >
                            {item.answer}
                          </FaqAnswerContent>
                        </FaqAnswer>
                      )}
                    </AnimatePresence>
                  </FaqItem>
                ))}
              </FaqContainer>
            </FaqCategory>
          ))}
          
          {filteredFaqs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                textAlign: 'center', 
                padding: '3rem 0',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              No questions found matching "{searchQuery}". Please try a different search term.
            </motion.div>
          )}
        </FaqSection>
        
        <FooterWrapper>
          <FooterLinks />
        </FooterWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default FAQPage; 