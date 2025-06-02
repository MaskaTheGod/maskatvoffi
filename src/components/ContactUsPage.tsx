import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 2rem 4rem;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const PageTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  text-align: center;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
`;

const ContactSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 2rem;
  
  @media (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const ContactForm = styled.form`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #FF4D6D;
    box-shadow: 0 0 10px rgba(255, 77, 109, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  min-height: 150px;
  outline: none;
  transition: all 0.3s ease;
  resize: vertical;
  
  &:focus {
    border-color: #FF4D6D;
    box-shadow: 0 0 10px rgba(255, 77, 109, 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 16, 72, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #FF4D6D;
`;

const InfoText = styled.div`
  color: rgba(255, 255, 255, 0.8);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF4D6D;
    transform: translateY(-3px);
  }
`;

const FormSuccess = styled(motion.div)`
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid rgba(39, 174, 96, 0.3);
  padding: 1rem;
  border-radius: 8px;
  color: rgba(39, 174, 96, 0.9);
  margin-bottom: 1rem;
`;

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <Container>
      <Header />
      
      <BackgroundGlow
        animate={{
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <ContentWrapper>
        <PageTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </PageTitle>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ 
            textAlign: 'center', 
            maxWidth: '700px', 
            margin: '0 auto 3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem'
          }}
        >
          Have questions or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly using the contact information provided.
        </motion.p>
        
        <ContactSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ContactInfo>
            <InfoTitle>Get In Touch</InfoTitle>
            
            <InfoItem>
              <InfoIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </InfoIcon>
              <InfoText>+1 (555) 123-4567</InfoText>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </InfoIcon>
              <InfoText>support@maska.FR</InfoText>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </InfoIcon>
              <InfoText>
                Maska Entertainment Inc.<br />
                123 Streaming Street<br />
                Los Angeles, CA 90210
              </InfoText>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </InfoIcon>
              <InfoText>
                Business Hours:<br />
                Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                Saturday - Sunday: Closed
              </InfoText>
            </InfoItem>
            
            <SocialLinks>
              <SocialIcon href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </SocialIcon>
            </SocialLinks>
          </ContactInfo>
          
          <ContactForm onSubmit={handleSubmit}>
            {submitSuccess && (
              <FormSuccess
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Thank you for your message! We'll get back to you as soon as possible.
              </FormSuccess>
            )}
            
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this regarding?"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
              />
            </FormGroup>
            
            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>
        </ContactSection>
      </ContentWrapper>
      
      <FooterLinks />
    </Container>
  );
};

export default ContactUsPage; 