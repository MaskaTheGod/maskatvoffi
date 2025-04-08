import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Header from './Header';
import FooterLinks from './FooterLinks';

// Main container
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0a0a0a;
  color: white;
  position: relative;
  font-family: 'Montserrat', 'Inter', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
`;

// Content container
const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  margin: 0 auto;
  padding: 70px 0 4rem;
  min-height: calc(100vh - 200px);
`;

// Navigation arrows
const NavArrow = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const NextArrow = styled(NavArrow)`
  right: 10px;
`;

const PrevArrow = styled(NavArrow)`
  left: 10px;
`;

// Hero section
const HeroSection = styled.div<{ bgImage: string }>`
  width: 100%;
  height: 80vh;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.2)),
    url(${props => props.bgImage}) center/cover no-repeat;
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 5% 5%;
  transition: background 0.5s ease;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  span {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  svg {
    margin-right: 5px;
  }
`;

const HeroTag = styled.div`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
`;

const HeroContent = styled.div`
  max-width: 650px;
  margin-bottom: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #38b6ff;
`;

const HeroDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 85%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.6rem 2rem;
  font-size: 0.9rem;
  background: #38b6ff;
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2a9cd9;
  }
`;

const OutlineButton = styled(ActionButton)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// Genre navigation
const GenreNav = styled.div`
  display: flex;
  padding: 0 5%;
  gap: 1.5rem;
  overflow-x: auto;
  margin: 1rem 0 2rem;
  position: relative;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  &::before, &::after {
    content: '';
    flex: 0 0 5%;
  }
`;

const GenreLink = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1.2rem;
  background: transparent;
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    color: white;
  }
`;

// Section headers
const SectionHeader = styled.div`
  padding: 0 5%;
  margin: 2rem 0 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 500;
  color: white;
  margin-bottom: 0.5rem;
`;

// Content rows
const ContentRow = styled.div`
  position: relative;
  padding: 0 5%;
  margin-bottom: 2rem;
`;

// Horizontal scroll container
const RowContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.5rem 0;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Episode indicators
const EpisodeIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  font-size: 0.8rem;
  z-index: 10;
`;

// Anime card for horizontal rows
const AnimeCard = styled(motion.div)`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
  width: 240px;
  height: 135px;
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  }
`;

const AnimeImage = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  background: url(${props => props.image}) center/cover no-repeat;
  transition: all 0.3s ease;
`;

const AnimeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
`;

const AnimeTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AnimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
`;

// Tabs
const TabsContainer = styled.div`
  display: flex;
  margin: 2rem 0 1rem 5%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 0.7rem 1.5rem;
  background: transparent;
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  border-bottom: ${props => props.active ? '2px solid #38b6ff' : 'none'};
  margin-bottom: -1px;
  
  &:hover {
    color: white;
  }
`;

// Grid layout
const AnimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 0 5%;
  margin-bottom: 2rem;
`;

const GridCard = styled(motion.div)`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const GridImage = styled.div<{ image: string }>`
  width: 100%;
  aspect-ratio: 16/9;
  background: url(${props => props.image}) center/cover no-repeat;
`;

// Top airing section
const TopAiringSection = styled.div`
  background: rgba(20, 20, 20, 0.5);
  border-radius: 4px;
  padding: 1rem;
  margin: 0 5% 2rem;
`;

const TopAiringHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TopAiringTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const TopAiringItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TopAiringThumbnail = styled.div<{ image: string }>`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background: url(${props => props.image}) center/cover no-repeat;
  flex-shrink: 0;
`;

const TopAiringInfo = styled.div`
  flex: 1;
`;

const TopAiringAnimeTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const TopAiringMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
`;

// Pagination
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? '#38b6ff' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#38b6ff' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

// Mock data
const heroItems = [
  { 
    id: 1, 
    title: 'Summer Pockets', 
    image: 'https://images.pexels.com/photos/12807840/pexels-photo-12807840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tag: 'Summer Pockets',
    type: 'TV',
    duration: '24 mins',
    description: 'To help manage his recently deceased grandmother\'s effects, the protagonist Takahara Hairi travels to Torishirojima during his summer vacation. As he gets off the ferry boat, he spots a lone girl standing on the pier. A girl who simply gazes into the distance as her long hair flutters in the wind. He looks at the girl in utter bewilderment, but before he realizes it, she can no...'
  },
  { 
    id: 2, 
    title: 'Demon Slayer', 
    image: 'https://images.pexels.com/photos/9431152/pexels-photo-9431152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tag: 'Demon Slayer',
    type: 'TV',
    duration: '25 mins',
    description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.'
  },
  { 
    id: 3, 
    title: 'Attack on Titan', 
    image: 'https://images.pexels.com/photos/10795018/pexels-photo-10795018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tag: 'Attack on Titan',
    type: 'TV',
    duration: '24 mins',
    description: 'Several hundred years ago, humans were nearly exterminated by giants. Giants are typically several stories tall, seem to have no intelligence, and who devour human beings. A small percentage of humanity survived by building a city protected by extremely high walls - even taller than the biggest giants.'
  }
];

const animeList = [
  { 
    id: 1, 
    title: 'Summer Pockets', 
    image: 'https://images.pexels.com/photos/12807840/pexels-photo-12807840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '9.2',
    year: '2022',
    episodes: 12,
    duration: '24 mins',
    description: 'To help manage his recently deceased grandmother\'s effects, the protagonist Takahara Hairi travels to Torishirojima during his summer vacation. As he gets off the ferry boat, he spots a lone girl standing on the pier. A girl who simply gazes into the distance as her long hair flutters in the wind. He looks at the girl in utter bewilderment, but before he realizes it, she can no...'
  },
  { 
    id: 2, 
    title: 'Himitsu no Ai Pi', 
    image: 'https://images.pexels.com/photos/9430994/pexels-photo-9430994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '8.5',
    year: '2023',
    episodes: 12,
    currentEpisode: 3
  },
  { 
    id: 3, 
    title: 'Bogus Skill <<Fruitmaster>> ~About that time I became the best farmer in the world~', 
    image: 'https://images.pexels.com/photos/8107806/pexels-photo-8107806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '7.8',
    year: '2023',
    episodes: 24,
    currentEpisode: 2
  },
  { 
    id: 4, 
    title: 'My Hero Academia: Vigilantes', 
    image: 'https://images.pexels.com/photos/9428920/pexels-photo-9428920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '9.0',
    year: '2023',
    episodes: 13,
    currentEpisode: 3
  }
];

const popularAnime = [
  { 
    id: 5, 
    title: 'Attack on Titan', 
    image: 'https://images.pexels.com/photos/10795018/pexels-photo-10795018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '9.5',
    year: '2013',
    episodes: 87
  },
  { 
    id: 6, 
    title: 'Demon Slayer', 
    image: 'https://images.pexels.com/photos/9431152/pexels-photo-9431152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '9.2',
    year: '2019',
    episodes: 26
  },
  { 
    id: 7, 
    title: 'Tokyo Revengers', 
    image: 'https://images.pexels.com/photos/14016889/pexels-photo-14016889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '8.5',
    year: '2021',
    episodes: 24
  },
  { 
    id: 8, 
    title: 'Jujutsu Kaisen', 
    image: 'https://images.pexels.com/photos/9431183/pexels-photo-9431183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '9.0',
    year: '2020',
    episodes: 48
  },
  { 
    id: 9, 
    title: 'My Hero Academia', 
    image: 'https://images.pexels.com/photos/9430985/pexels-photo-9430985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '8.9',
    year: '2016',
    episodes: 113
  },
  { 
    id: 10, 
    title: 'Chainsaw Man', 
    image: 'https://images.pexels.com/photos/12324060/pexels-photo-12324060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '8.7',
    year: '2022',
    episodes: 12
  }
];

const genreList = [
  'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror', 'Mahou Shoujo', 
  'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports'
];

const topAiring = [
  {
    id: 11,
    title: 'My Hero Academia: Vigilantes',
    image: 'https://images.pexels.com/photos/9428920/pexels-photo-9428920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: '9.0',
    year: '2023',
    episodes: 13
  }
];

const AnimeStreamingPage: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState('');
  const [activeTab, setActiveTab] = useState('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const nextHero = () => {
    setCurrentHeroIndex((prevIndex) => 
      prevIndex === heroItems.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevHero = () => {
    setCurrentHeroIndex((prevIndex) => 
      prevIndex === 0 ? heroItems.length - 1 : prevIndex - 1
    );
  };
  
  const currentHero = heroItems[currentHeroIndex];
  
  return (
    <Container>
      <Header fixed={true} />
      
      <ContentWrapper>
        {/* Hero Section */}
        <HeroSection bgImage={currentHero.image}>
          <PrevArrow onClick={prevHero}>❮</PrevArrow>
          <NextArrow onClick={nextHero}>❯</NextArrow>
          
          <MetaInfo>
            <span style={{ textTransform: 'uppercase' }}>{currentHero.type}</span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {currentHero.duration}
            </span>
          </MetaInfo>
          
          <HeroTag>{currentHero.tag}</HeroTag>
          
          <HeroContent>
            <HeroTitle>{currentHero.title}</HeroTitle>
            <HeroDescription>
              {currentHero.description}
            </HeroDescription>
            
            <ButtonsContainer>
              <OutlineButton>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12H16M16 12L12 8M16 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                DETAILS
              </OutlineButton>
              <ActionButton>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                </svg>
                WATCH NOW
              </ActionButton>
            </ButtonsContainer>
          </HeroContent>
        </HeroSection>
        
        {/* Genre Navigation */}
        <GenreNav>
          {genreList.map(genre => (
            <GenreLink 
              key={genre}
              active={activeGenre === genre}
              onClick={() => setActiveGenre(genre)}
            >
              {genre}
            </GenreLink>
          ))}
        </GenreNav>
        
        {/* Continue Watching Section */}
        <SectionHeader>
          <SectionTitle>Your Watchlist</SectionTitle>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Continue Watching</div>
        </SectionHeader>
        
        <ContentRow>
          <RowContainer>
            {animeList.slice(1, 4).map(anime => (
              <AnimeCard key={anime.id}>
                {anime.currentEpisode && (
                  <EpisodeIndicator>EP {anime.currentEpisode}</EpisodeIndicator>
                )}
                <AnimeImage image={anime.image} />
                <AnimeOverlay>
                  <AnimeTitle>{anime.title}</AnimeTitle>
                  <AnimeInfo>
                    <span>{anime.year}</span>
                    <span>TV</span>
                  </AnimeInfo>
                </AnimeOverlay>
              </AnimeCard>
            ))}
          </RowContainer>
        </ContentRow>
        
        {/* Tabs Section */}
        <TabsContainer>
          <Tab 
            active={activeTab === 'NEWEST'} 
            onClick={() => setActiveTab('NEWEST')}
          >
            NEWEST
          </Tab>
          <Tab 
            active={activeTab === 'POPULAR'} 
            onClick={() => setActiveTab('POPULAR')}
          >
            POPULAR
          </Tab>
          <Tab 
            active={activeTab === 'TOP RATED'} 
            onClick={() => setActiveTab('TOP RATED')}
          >
            TOP RATED
          </Tab>
        </TabsContainer>
        
        {/* Grid of Anime */}
        <AnimeGrid>
          {popularAnime.map(anime => (
            <GridCard key={anime.id}>
              <GridImage image={anime.image} />
              <AnimeOverlay>
                <AnimeTitle>{anime.title}</AnimeTitle>
                <AnimeInfo>
                  <span>⭐ {anime.rating}</span>
                  <span>{anime.year}</span>
                </AnimeInfo>
              </AnimeOverlay>
            </GridCard>
          ))}
        </AnimeGrid>
        
        {/* Pagination */}
        <Pagination>
          <PaginationButton>❮</PaginationButton>
          <PaginationButton active={true}>1</PaginationButton>
          <PaginationButton>2</PaginationButton>
          <PaginationButton>3</PaginationButton>
          <PaginationButton>❯</PaginationButton>
        </Pagination>
        
        {/* Top Airing Section */}
        <TopAiringSection>
          <TopAiringHeader>
            <TopAiringTitle>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#38b6ff"/>
              </svg>
              TOP AIRING
            </TopAiringTitle>
          </TopAiringHeader>
          
          {topAiring.map(anime => (
            <TopAiringItem key={anime.id}>
              <TopAiringThumbnail image={anime.image} />
              <TopAiringInfo>
                <TopAiringAnimeTitle>{anime.title}</TopAiringAnimeTitle>
                <TopAiringMeta>
                  <span>TV</span>
                  <span>{anime.year}</span>
                  <span>{anime.episodes} EPS</span>
                </TopAiringMeta>
              </TopAiringInfo>
            </TopAiringItem>
          ))}
        </TopAiringSection>
      </ContentWrapper>
      
      <FooterLinks />
    </Container>
  );
};

export default AnimeStreamingPage; 