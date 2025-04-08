import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Header components
const HeaderContainer = styled.header<{ fixed?: boolean }>`
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 30;
  pointer-events: none;
  backdrop-filter: ${props => props.fixed ? 'blur(10px)' : 'none'};
  background: ${props => props.fixed ? 'rgba(0, 0, 0, 0.4)' : 'transparent'};
  transition: all 0.3s ease;
`;

const HeaderTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  pointer-events: auto;
`;

const HeaderLogo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
`;

const MaskaText = styled(motion.h1)`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(to right, #FFFFFF 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.15));
`;

const TVText = styled(motion.span)`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(45deg, #FF4D6D, #FF1048);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
  filter: drop-shadow(0 0 15px rgba(255, 20, 72, 0.4));
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  pointer-events: auto;
  justify-content: center;
  width: 100%;
  position: absolute;
  padding: 0.5rem 0;
  top: 4vh;
  cursor: pointer;
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: ${props => props.active ? '#FF1048' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? '700' : '500'};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.active ? '#FF4D6D' : 'white'};
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
  }
`;

const SignInButton = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 1000;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface HeaderProps {
  showNavLinks?: boolean;
  customLinks?: { label: string; path: string }[];
  onSignIn?: () => void;
  fixed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showNavLinks = true, 
  customLinks,
  onSignIn = () => alert("Sign-in functionality would go here!"),
  fixed = false
}) => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  
  const defaultLinks = [
    { label: 'Home', path: '/' },
    { label: 'Animes', path: '#' },
    { label: 'Movies', path: '#' },
    { label: 'Latest', path: '#' },
    { label: 'My List', path: '#' }
  ];
  
  const links = customLinks || defaultLinks;

  // Check if a link is active based on the current location
  const isActive = (path: string) => {
    if (path === '/') {
      return location === '/';
    }
    return location === path;
  };

  return (
    <HeaderContainer fixed={fixed}>
      <HeaderTop>
        <HeaderLogo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <LogoContainer onClick={() => navigate('/')}>
            <MaskaText>MASKA</MaskaText>
            <TVText>.TV</TVText>
          </LogoContainer>
        </HeaderLogo>
        
        <SignInButton 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.98 }}
          onClick={onSignIn}
        >
          Sign In
        </SignInButton>
      </HeaderTop>
      
      {showNavLinks && (
        <NavLinks>
          {links.map((link, index) => (
            <NavLink 
              key={index}
              active={isActive(link.path)}
              onClick={() => link.path.startsWith('/') ? navigate(link.path) : null}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>
      )}
    </HeaderContainer>
  );
};

export default Header; 