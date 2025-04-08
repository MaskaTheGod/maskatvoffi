import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
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

// Terms section components
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

const TermsText = styled.p`
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

// Animations
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

const TermsOfServicePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const containerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  // Generate TOC links with IDs
  const sections = [
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "eligibility", title: "Eligibility" },
    { id: "account", title: "Account and Security" },
    { id: "subscription", title: "Subscription and Billing" },
    { id: "content", title: "Content and Licenses" },
    { id: "prohibited", title: "Prohibited Uses" },
    { id: "disclaimers", title: "Disclaimers and Limitations" },
    { id: "termination", title: "Termination" },
    { id: "changes", title: "Changes to Terms" },
    { id: "general", title: "General Provisions" }
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
          <HeroTitle>Terms of Service</HeroTitle>
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
          <Section id="acceptance" variants={itemVariants}>
            <SectionTitle>Acceptance of Terms</SectionTitle>
            <TermsText>
              Welcome to Maska.TV. These Terms of Service ("Terms") govern your access to and use of the Maska.TV streaming service, including any content, functionality, and services offered on or through our website and applications (collectively, the "Service").
            </TermsText>
            <TermsText>
              By registering for an account, accessing, or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
            </TermsText>
            <TermsText>
              Please read these Terms carefully before using our Service. These Terms constitute a legally binding agreement between you and Maska Entertainment, Inc. ("Maska.TV," "we," "us," or "our").
            </TermsText>
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

          <Section id="eligibility" variants={itemVariants}>
            <SectionTitle>Eligibility</SectionTitle>
            <TermsText>
              You must be at least 18 years old or the age of legal majority in your jurisdiction, whichever is greater, to register for an account and use our Service. By using the Service, you represent and warrant that you meet these eligibility requirements.
            </TermsText>
            <TermsText>
              If you are creating an account on behalf of a company, organization, or other entity, you represent and warrant that you have the authority to bind that entity to these Terms, in which case "you" and "your" will refer to that entity.
            </TermsText>
            <TermsText>
              Certain content available through our Service may be subject to additional age restrictions or ratings. You are responsible for complying with all such restrictions.
            </TermsText>
          </Section>

          <Section id="account" variants={itemVariants}>
            <SectionTitle>Account and Security</SectionTitle>
            <TermsText>
              To access certain features of the Service, you must register for an account. When registering, you agree to provide accurate, current, and complete information about yourself and to update this information to keep it accurate, current, and complete.
            </TermsText>
            <TermsText>
              You are solely responsible for:
            </TermsText>
            <List>
              <ListItem>Maintaining the confidentiality of your account credentials</ListItem>
              <ListItem>All activities that occur under your account</ListItem>
              <ListItem>Restricting access to your devices</ListItem>
              <ListItem>Logging out of your account at the end of each session</ListItem>
            </List>
            <TermsText>
              You agree to immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to protect your account information.
            </TermsText>
            <TermsText>
              Maska.TV reserves the right to disable any user account at any time if, in our opinion, you have violated any provisions of these Terms.
            </TermsText>
          </Section>

          <Section id="subscription" variants={itemVariants}>
            <SectionTitle>Subscription and Billing</SectionTitle>
            <TermsText>
              Maska.TV offers various subscription plans. By subscribing to our Service, you agree to the following terms:
            </TermsText>
            <List>
              <ListItem>
                <strong>Fees:</strong> You agree to pay all fees associated with your selected subscription plan. All fees are in USD unless otherwise stated and are non-refundable except as expressly provided in these Terms.
              </ListItem>
              <ListItem>
                <strong>Free Trials:</strong> We may offer free trial subscriptions. Unless you cancel before the end of the trial period, your subscription will automatically convert to a paid subscription, and your payment method will be charged.
              </ListItem>
              <ListItem>
                <strong>Recurring Billing:</strong> Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date.
              </ListItem>
              <ListItem>
                <strong>Price Changes:</strong> We reserve the right to adjust pricing for our Service or any components thereof. Any price changes will take effect following notice to you.
              </ListItem>
              <ListItem>
                <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Cancellation will be effective at the end of your current billing period.
              </ListItem>
            </List>
            <TermsText>
              By providing a payment method, you authorize us to charge that payment method for the subscription fees associated with your plan. If your payment cannot be completed, we may suspend or terminate your access to the Service.
            </TermsText>
          </Section>

          <Section id="content" variants={itemVariants}>
            <SectionTitle>Content and Licenses</SectionTitle>
            <TermsText>
              Maska.TV grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service, including streaming and temporarily downloading content for personal, non-commercial use only.
            </TermsText>
            <TermsText>
              You may not:
            </TermsText>
            <List>
              <ListItem>Reproduce, distribute, publicly display, publicly perform, or create derivative works from the content available through the Service</ListItem>
              <ListItem>Remove, alter, or obscure any copyright, trademark, or other proprietary notices</ListItem>
              <ListItem>Use the content for any commercial purpose</ListItem>
              <ListItem>Transfer your rights to access content to another person</ListItem>
              <ListItem>Circumvent, disable, or interfere with security-related features of the Service</ListItem>
            </List>
            <TermsText>
              All content provided through the Service is owned by Maska.TV or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </TermsText>
            <TermsText>
              We reserve the right to add, remove, or modify content available through the Service at any time without notice.
            </TermsText>
          </Section>

          <Section id="prohibited" variants={itemVariants}>
            <SectionTitle>Prohibited Uses</SectionTitle>
            <TermsText>
              You agree not to use the Service:
            </TermsText>
            <List>
              <ListItem>In any way that violates any applicable federal, state, local, or international law or regulation</ListItem>
              <ListItem>To impersonate or attempt to impersonate Maska.TV, a Maska.TV employee, another user, or any other person or entity</ListItem>
              <ListItem>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</ListItem>
              <ListItem>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service</ListItem>
              <ListItem>To attack the Service via a denial-of-service attack or a distributed denial-of-service attack</ListItem>
              <ListItem>To use any robot, spider, or other automatic device, process, or means to access the Service for any purpose</ListItem>
              <ListItem>To introduce any viruses, trojan horses, worms, logic bombs, or other malicious or technologically harmful material</ListItem>
            </List>
            <TermsText>
              We reserve the right to terminate your access to the Service for any violation of these prohibited uses.
            </TermsText>
          </Section>

          <Section id="disclaimers" variants={itemVariants}>
            <SectionTitle>Disclaimers and Limitations</SectionTitle>
            <TermsText>
              THE SERVICE AND ALL CONTENT PROVIDED THROUGH THE SERVICE ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </TermsText>
            <TermsText>
              TO THE FULLEST EXTENT PERMITTED BY LAW, MASKA.TV DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </TermsText>
            <TermsText>
              MASKA.TV DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </TermsText>
            <TermsText>
              IN NO EVENT WILL MASKA.TV, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
            </TermsText>
            <TermsText>
              SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU.
            </TermsText>
          </Section>

          <Section id="termination" variants={itemVariants}>
            <SectionTitle>Termination</SectionTitle>
            <TermsText>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms.
            </TermsText>
            <TermsText>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service and cancel your subscription through your account settings.
            </TermsText>
            <TermsText>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </TermsText>
          </Section>

          <Section id="changes" variants={itemVariants}>
            <SectionTitle>Changes to Terms</SectionTitle>
            <TermsText>
              We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them and apply to all access to and use of the Service thereafter.
            </TermsText>
            <TermsText>
              Your continued use of the Service following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.
            </TermsText>
            <TermsText>
              If we make material changes to these Terms, we will provide notice through the Service or by other means, to provide you the opportunity to review the changes before they become effective.
            </TermsText>
          </Section>

          <Section id="general" variants={itemVariants}>
            <SectionTitle>General Provisions</SectionTitle>
            <TermsText>
              <strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law.
            </TermsText>
            <TermsText>
              <strong>Dispute Resolution:</strong> Any dispute arising from or relating to these Terms or the Service will be resolved through binding arbitration in Los Angeles, California, except that you or Maska.TV may seek injunctive or other equitable relief in any court of competent jurisdiction.
            </TermsText>
            <TermsText>
              <strong>Severability:</strong> If any provision of these Terms is held to be invalid, illegal, or unenforceable, such provision shall be struck, and the remaining provisions shall remain in full force and effect.
            </TermsText>
            <TermsText>
              <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the sole and entire agreement between you and Maska.TV regarding the Service and supersede all prior and contemporaneous understandings, agreements, representations, and warranties.
            </TermsText>
            <TermsText>
              <strong>Waiver:</strong> No waiver of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition.
            </TermsText>
            <TermsText>
              <strong>Assignment:</strong> You may not assign or transfer these Terms or your rights under these Terms, in whole or in part, by operation of law or otherwise, without our prior written consent. We may assign these Terms at any time without notice.
            </TermsText>
            <TermsText>
              <strong>Contact Information:</strong> Questions or comments about the Terms or the Service may be directed to us at the email address terms@maska.tv or by mail at Maska Entertainment, Inc., 123 Entertainment Blvd, Suite 500, Los Angeles, CA 90001.
            </TermsText>
          </Section>
        </motion.div>
        
        <FooterWrapper>
          <FooterLinks />
        </FooterWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default TermsOfServicePage; 