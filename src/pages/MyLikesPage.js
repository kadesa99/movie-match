
import React from 'react';

const MyLikesPage = ({ user, movies, userLikes, removeLike }) => {
  if (!user) {
    return <h3>Bitte wähle zuerst einen Nutzer auf der Startseite aus.</h3>;
  }

  return (
    <>
      <h2>💖 Deine Likes</h2>
      <div className="gallery">
        {userLikes.map(v => {
          const movie = movies.find(m => m.id === v.id);
          return movie ? (
            <div key={movie.id} className="gallery-item">
              <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.name} />
              <p>{movie.name}</p>
              <button onClick={() => removeLike(movie.id)}>🗑️ Entfernen</button>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
};

export default MyLikesPage;
