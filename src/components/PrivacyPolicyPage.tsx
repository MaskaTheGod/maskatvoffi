import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  margin-bottom: 2rem;
  line-height: 1.1;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
  z-index: 10;
  position: relative;
`;

const LastUpdated = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3rem;
`;

const Highlight = styled.span`
  color: #FF4D6D;
  font-weight: 500;
`;

// Policy section components
const Section = styled(motion.section)`
  margin-bottom: 4rem;
  position: relative;
`;

const SectionTitle = styled(motion.h2)`
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

const PolicyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.8rem;
`;

const ContactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  margin: 3rem 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  
  &:hover {
    border-color: rgba(255, 77, 109, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 77, 109, 0.15);
  }
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const TableOfContents = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0 3rem;
  backdrop-filter: blur(10px);
`;

const TOCTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
`;

const TOCList = styled.ol`
  padding-left: 1.5rem;
`;

const TOCItem = styled.li`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.8rem;
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: #FF4D6D;
    }
  }
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  opacity: 0.03;
  z-index: -1;
  right: -150px;
  top: 50px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// Footer
const FooterWrapper = styled.div`
  margin-top: 4rem;
`;

// Parallax animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
      damping: 12, 
      stiffness: 100 
    }
  }
};

const PrivacyPolicyPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const containerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  // Generate TOC links with IDs
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collected", title: "Information We Collect" },
    { id: "use-of-information", title: "How We Use Your Information" },
    { id: "information-sharing", title: "Information Sharing and Disclosure" },
    { id: "data-security", title: "Data Security" },
    { id: "your-rights", title: "Your Rights and Choices" },
    { id: "children-privacy", title: "Children's Privacy" },
    { id: "international-transfers", title: "International Data Transfers" },
    { id: "policy-changes", title: "Changes to This Privacy Policy" },
    { id: "contact-us", title: "Contact Us" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container ref={containerRef}>
      <Header fixed={true} />
      
      <BackgroundGlow />
      
      <ContentWrapper>
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Privacy Policy</HeroTitle>
          <LastUpdated>Last Updated: January 15, 2024</LastUpdated>
          
          <TableOfContents
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TOCTitle>Table of Contents</TOCTitle>
            <TOCList>
              {sections.map(section => (
                <TOCItem key={section.id}>
                  <a 
                    href={`#${section.id}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }}
                  >
                    {section.title}
                  </a>
                </TOCItem>
              ))}
            </TOCList>
          </TableOfContents>
        </HeroSection>
        
        <motion.div 
          style={{ opacity: sectionOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Section id="introduction" variants={itemVariants}>
            <SectionTitle>Introduction</SectionTitle>
            <PolicyText>
              Maska.FR ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our streaming service, including mobile applications and related services (collectively, the "Service").
            </PolicyText>
            <PolicyText>
              Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
            </PolicyText>
            <FloatingIcon
              initial={{ rotate: 0 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"/>
              </svg>
            </FloatingIcon>
          </Section>

          <Section id="information-collected" variants={itemVariants}>
            <SectionTitle>Information We Collect</SectionTitle>
            <PolicyText>
              We collect several types of information from and about users of our Service, including:
            </PolicyText>
            <List>
              <ListItem>
                <strong>Personal Information:</strong> Name, email address, phone number, billing address, payment information, and other similar identifiers.
              </ListItem>
              <ListItem>
                <strong>Account Information:</strong> Your username, password, account preferences, and subscription details.
              </ListItem>
              <ListItem>
                <strong>User Content:</strong> Profiles, watchlists, ratings, reviews, and content preferences you provide.
              </ListItem>
              <ListItem>
                <strong>Usage Data:</strong> Information about how you use our Service, including viewing history, search queries, interaction with content, and time spent.
              </ListItem>
              <ListItem>
                <strong>Device Information:</strong> Hardware model, operating system, browser type, IP address, device identifiers, and mobile network information.
              </ListItem>
              <ListItem>
                <strong>Location Data:</strong> General location derived from IP address.
              </ListItem>
            </List>
          </Section>

          <Section id="use-of-information" variants={itemVariants}>
            <SectionTitle>How We Use Your Information</SectionTitle>
            <PolicyText>
              We use the information we collect for various purposes, including to:
            </PolicyText>
            <List>
              <ListItem>Provide, maintain, and improve our Service</ListItem>
              <ListItem>Process transactions and manage your account</ListItem>
              <ListItem>Personalize your experience and deliver tailored content recommendations</ListItem>
              <ListItem>Communicate with you about new features, offers, and updates</ListItem>
              <ListItem>Monitor and analyze usage patterns and trends</ListItem>
              <ListItem>Detect, prevent, and address technical issues and security breaches</ListItem>
              <ListItem>Comply with legal obligations and enforce our terms of service</ListItem>
            </List>
            <PolicyText>
              We process your information for these purposes based on our legitimate business interests, to perform our contract with you, to comply with legal obligations, and/or with your consent when applicable.
            </PolicyText>
          </Section>

          <Section id="information-sharing" variants={itemVariants}>
            <SectionTitle>Information Sharing and Disclosure</SectionTitle>
            <PolicyText>
              We may share your information in the following circumstances:
            </PolicyText>
            <List>
              <ListItem>
                <strong>Service Providers:</strong> With third-party vendors and service providers who need access to your information to help us provide the Service (e.g., payment processors, cloud hosting, analytics).
              </ListItem>
              <ListItem>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, in which case personal information may be one of the transferred assets.
              </ListItem>
              <ListItem>
                <strong>Legal Compliance:</strong> When required by law or in response to valid legal process, such as a court order or government request.
              </ListItem>
              <ListItem>
                <strong>Protection of Rights:</strong> When we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or others.
              </ListItem>
            </List>
            <PolicyText>
              We do not sell your personal information to third parties for monetary compensation. However, we may share certain information with partners for personalization and advertising purposes.
            </PolicyText>
          </Section>

          <Section id="data-security" variants={itemVariants}>
            <SectionTitle>Data Security</SectionTitle>
            <PolicyText>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.
            </PolicyText>
            <PolicyText>
              We cannot guarantee the absolute security of your information. We encourage you to help us by keeping your account password confidential and by taking precautions to protect your personal information while using the Internet.
            </PolicyText>
          </Section>

          <Section id="your-rights" variants={itemVariants}>
            <SectionTitle>Your Rights and Choices</SectionTitle>
            <PolicyText>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </PolicyText>
            <List>
              <ListItem>Access to your personal information</ListItem>
              <ListItem>Correction of inaccurate or incomplete information</ListItem>
              <ListItem>Deletion of your personal information</ListItem>
              <ListItem>Portability of your personal information</ListItem>
              <ListItem>Restriction or objection to certain processing</ListItem>
              <ListItem>Withdrawal of consent (where processing is based on consent)</ListItem>
            </List>
            <PolicyText>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section. We will respond to your request within the timeframe required by applicable law.
            </PolicyText>
            <PolicyText>
              Please note that some of these rights may be limited where we have compelling reasons to continue processing your information.
            </PolicyText>
          </Section>

          <Section id="children-privacy" variants={itemVariants}>
            <SectionTitle>Children's Privacy</SectionTitle>
            <PolicyText>
              Our Service is not directed to children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can take necessary actions.
            </PolicyText>
          </Section>

          <Section id="international-transfers" variants={itemVariants}>
            <SectionTitle>International Data Transfers</SectionTitle>
            <PolicyText>
              Your personal information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.
            </PolicyText>
            <PolicyText>
              Whenever we transfer your personal information internationally, we take appropriate safeguards to ensure that your information receives an adequate level of protection.
            </PolicyText>
          </Section>

          <Section id="policy-changes" variants={itemVariants}>
            <SectionTitle>Changes to This Privacy Policy</SectionTitle>
            <PolicyText>
              We may update our Privacy Policy from time to time. Any changes will be posted on this page, and if significant, we will provide a more prominent notice.
            </PolicyText>
            <PolicyText>
              Your continued use of the Service after we post any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to the modified Privacy Policy.
            </PolicyText>
          </Section>

          <Section id="contact-us" variants={itemVariants}>
            <SectionTitle>Contact Us</SectionTitle>
            <PolicyText>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </PolicyText>
            
            <ContactCard
              whileHover={{ 
                y: -5, 
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 77, 109, 0.2)" 
              }}
              transition={{ duration: 0.5 }}
            >
              <ContactTitle>Maska.FR Privacy Team</ContactTitle>
              <PolicyText>Email: privacy@maska.FR</PolicyText>
              <PolicyText>Address: 123 Entertainment Blvd, Suite 500, Los Angeles, CA 90001</PolicyText>
              <PolicyText>Phone: +1 (800) 555-MASKA</PolicyText>
            </ContactCard>
            
            <PolicyText>
              We strive to respond to all inquiries within 30 days.
            </PolicyText>
          </Section>
        </motion.div>
        
        <FooterWrapper>
          <FooterLinks />
        </FooterWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default PrivacyPolicyPage; 