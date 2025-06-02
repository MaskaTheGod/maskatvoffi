import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

// Styled components for the footer
const FooterContainer = styled.footer`
  padding: 3rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const StyledLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

// Links data
const footerLinks = [
  { label: 'About Us', path: '/about-us' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Contact Us', path: '/contact-us' },
];

interface FooterLinksProps {
  className?: string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ className }) => {
  return (
    <FooterContainer className={className}>
      <LinksContainer>
        {footerLinks.map((link, index) => (
          <StyledLink key={index} to={link.path}>
            {link.label}
          </StyledLink>
        ))}
      </LinksContainer>
      <div>© {new Date().getFullYear()} Maska.FR. All rights reserved.</div>
    </FooterContainer>
  );
};

export default FooterLinks; 