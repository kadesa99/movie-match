import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  // Stellt sicher, dass movie und movie.poster existieren, um Fehler zu vermeiden
  if (!movie || !movie.poster) {
    return <div className="movie-card-placeholder">Wird geladen...</div>; 
  }

  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.name} />
      <div className="movie-card-overlay">
        <h2>{movie.name}</h2>
        <p>{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieCard;
