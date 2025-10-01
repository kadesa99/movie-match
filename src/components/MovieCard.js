import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Collapse } from '@mui/material';

const MovieCard = ({ movie }) => {
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  if (!movie || !movie.poster) {
    return null; // Oder eine Platzhalter-Komponente
  }

  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', aspectRatio: '3 / 4.5', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={toggleDescription} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          image={movie.poster}
          alt={movie.name}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        />
        <CardContent sx={{
          position: 'relative',
          zIndex: 2,
          color: 'white',
          marginTop: 'auto', // Schiebt den Inhalt nach unten
          width: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0) 100%)',
        }}>
          <Typography gutterBottom variant="h5" component="div">
            {movie.name}
          </Typography>
          <Collapse in={isDescriptionVisible} timeout="auto">
            <Typography variant="body2" sx={{ maxHeight: 150, overflowY: 'auto' }}>
              {movie.description}
            </Typography>
          </Collapse>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
