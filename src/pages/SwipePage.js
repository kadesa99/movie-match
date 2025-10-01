
import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import { Container, Box, IconButton } from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const SwipePage = ({ user, currentMovie, handleVote }) => {
  const [swipeClass, setSwipeClass] = useState('');

  if (!currentMovie) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}>🎉 Du hast alle Filme bewertet!</Container>;
  }

  const handleSwipe = (liked) => {
    setSwipeClass(liked ? 'swiping-right' : 'swiping-left');

    // Warte, bis die Animation abgeschlossen ist, bevor die nächste Karte geladen wird
    setTimeout(() => {
      setSwipeClass('');
      handleVote(liked);
    }, 300); // Muss mit der CSS-Animationsdauer übereinstimmen
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Spalte auf kleinen, Reihe auf mittleren+ Bildschirmen
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        <IconButton color="error" sx={{ transform: 'scale(1.5)', order: { xs: 2, md: 1 } }} onClick={() => handleSwipe(false)}>
          <ThumbDownIcon fontSize="large" />
        </IconButton>
        
        <Box className={`movie-card-container ${swipeClass}`} sx={{ order: { xs: 1, md: 2 }, width: '100%', maxWidth: '400px' }}>
          <MovieCard
            movie={{
              name: currentMovie.name,
              description: currentMovie.overview,
              poster: `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`,
            }}
          />
        </Box>

        <IconButton color="success" sx={{ transform: 'scale(1.5)', order: { xs: 3, md: 3 } }} onClick={() => handleSwipe(true)}>
          <ThumbUpIcon fontSize="large" />
        </IconButton>
      </Box>
    </Container>
  );
};

export default SwipePage;
