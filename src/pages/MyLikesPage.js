
import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Eine wiederverwendbare Komponente für ein einzelnes Galerie-Element mit Löschfunktion
const LikedItem = ({ movie, onRemove }) => (
  <Grid item xs={6} sm={4} md={3}>
    <Card>
      <CardMedia
        component="img"
        image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.name}
        sx={{ aspectRatio: '2/3' }}
      />
      <CardContent sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" display="block" noWrap sx={{ flexGrow: 1, mr: 1 }}>
          {movie.name}
        </Typography>
        <IconButton size="small" onClick={onRemove} aria-label="delete">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardContent>
    </Card>
  </Grid>
);

const MyLikesPage = ({ movies, userLikes, removeLike }) => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Deine Likes
      </Typography>
      <Grid container spacing={2}>
        {userLikes.length > 0 ? (
          userLikes.map(v => {
            const movie = movies.find(m => m.id === v.id);
            return movie ? <LikedItem key={movie.id} movie={movie} onRemove={() => removeLike(movie.id)} /> : null;
          })
        ) : (
          <Grid item xs={12}>
            <Typography align="center">Du hast noch keine Filme oder Serien geliked.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MyLikesPage;

