import React from 'react';
import styled from '@emotion/styled';
import Header from './Header';
import FooterLinks from './FooterLinks';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000000;
  color: white;
  position: relative;
  font-family: 'Montserrat', 'Inter', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
`;

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
  align-items: center;
  justify-content: center;
`;

const TestPage: React.FC = () => {
  return (
    <Container>
      <Header />
      <ContentWrapper>
        <h1 style={{ color: 'white' }}>Test Page</h1>
        <p style={{ color: 'white' }}>This is a simple test page to verify routing works.</p>
      </ContentWrapper>
      <FooterLinks />
    </Container>
  );
};

export default TestPage; 