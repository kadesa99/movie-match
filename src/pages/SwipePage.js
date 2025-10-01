
import React from 'react';
import MovieCard from '../components/MovieCard';

const SwipePage = ({ user, setUser, currentMovie, handleVote }) => {
  if (!user) {
    return (
      <>
        <h2>Wer bist du?</h2>
        <button onClick={() => setUser('Karen')}>Karen</button>
        <button onClick={() => setUser('Tom')}>Tom</button>
        <button onClick={() => setUser('Thalia')}>Thalia</button>
      </>
    );
  }

  if (!currentMovie) {
    return <h3>🎉 Du hast alle Filme bewertet!</h3>;
  }

  return (
    <>
      <h2>Hallo {user} 👋</h2>
      <MovieCard
        movie={{
          name: currentMovie.name,
          description: currentMovie.overview,
          poster: `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`,
        }}
      />
      <div className="swipe-actions">
        <button onClick={() => handleVote(false)} className="dislike">👎</button>
        <button onClick={() => handleVote(true)} className="like">👍</button>
      </div>
    </>
  );
};

export default SwipePage;
