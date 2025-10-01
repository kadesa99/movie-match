
import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

// Eine wiederverwendbare Komponente für ein einzelnes Galerie-Element
const GalleryItem = ({ movie }) => (
  <Grid item xs={6} sm={4} md={3}>
    <Card>
      <CardMedia
        component="img"
        image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.name}
        sx={{ aspectRatio: '2/3' }}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="caption" display="block" noWrap>
          {movie.name}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const GalleryPage = ({ matches, allUsers, filteredUsers, onFilterChange }) => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Gemeinsame Favoriten
      </Typography>

      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Filter</Typography>
        <FormGroup row sx={{ justifyContent: 'center' }}>
          {allUsers.map(u => (
            <FormControlLabel
              key={u}
              control={<Checkbox checked={filteredUsers.includes(u)} onChange={(e) => onFilterChange(u, e.target.checked)} />}
              label={u}
            />
          ))}
        </FormGroup>
      </Box>

      <Grid container spacing={2}>
        {matches.length > 0 ? (
          matches.map((m) => <GalleryItem key={m.id} movie={m} />)
        ) : (
          <Grid item xs={12}>
            <Typography align="center">Keine Übereinstimmungen für die aktuelle Auswahl.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default GalleryPage;

