import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { fetchPopularMovies, fetchPopularSeries } from './api/tmdb';
import SwipePage from './pages/SwipePage';
import GalleryPage from './pages/GalleryPage';
import MyLikesPage from './pages/MyLikesPage';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem('movieIndex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(() => localStorage.getItem('movieUser') || null);
  const [contentType, setContentType] = useState('movie'); // 'movie' or 'series'

  // Reset state when content type changes
  useEffect(() => {
    setMovies([]);
    setIndex(0);
    setPage(1);
  }, [contentType]);

  // 💾 Benutzer speichern
  useEffect(() => {
    if (user) {
      localStorage.setItem('movieUser', user);
    } else {
      localStorage.removeItem('movieUser');
    }
  }, [user]);

  const defaultVotes = { Karen: [], Tom: [], Thalia: [] };
  const [votes, setVotes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('movieVotes'));
      return saved ? { ...defaultVotes, ...saved } : defaultVotes;
    } catch {
      return defaultVotes;
    }
  });
  const [galleryFilterUsers, setGalleryFilterUsers] = useState(Object.keys(defaultVotes));

  const handleGalleryFilterChange = (user, isChecked) => {
    setGalleryFilterUsers(prev => 
      isChecked ? [...prev, user] : prev.filter(u => u !== user)
    );
  };

  // 🌙 Theme setzen

  // 🌙 Theme setzen
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const [page, setPage] = useState(1);

  // 🎯 Nur noch nicht bewertete Filme
  const alreadyRated = votes[user]?.map(v => v.id) || [];
  const remainingMovies = movies.filter(m => !alreadyRated.includes(m.id));
  const currentMovie = remainingMovies.length > index ? remainingMovies[index] : null;

  // 🎬 Filme laden & nachladen
  useEffect(() => {
    const loadContent = async (loadPage) => {
      let data = [];
      if (contentType === 'movie') {
        data = await fetchPopularMovies(loadPage);
      } else {
        data = await fetchPopularSeries(loadPage);
      }

      const combined = data.map(item => ({
        ...item,
        type: item.title ? 'movie' : 'series',
        name: item.title || item.name,
      }));

      setMovies(prev => [...prev, ...combined]);
    };

    loadContent(page);
  }, [page, contentType]);

  // Mehr laden, wenn das Ende der Liste fast erreicht ist
  useEffect(() => {
    if (remainingMovies.length > 0 && remainingMovies.length - index < 5) {
      setPage(prev => prev + 1);
    }
  }, [index, remainingMovies.length]);
  

  // 💾 Fortschritt speichern
  useEffect(() => {
    localStorage.setItem('movieIndex', index.toString());
  }, [index]);

  // 💾 Bewertungen speichern
  useEffect(() => {
    localStorage.setItem('movieVotes', JSON.stringify(votes));
  }, [votes]);

  const findMatches = (usersToMatch) => {
    if (!usersToMatch || usersToMatch.length === 0) return [];

    // Finde die Likes des ersten ausgewählten Nutzers
    const firstUserLikes = votes[usersToMatch[0]]?.filter(v => v.liked).map(v => v.id) || [];

    // Filtere diese Liste, um nur die IDs zu behalten, die von ALLEN anderen ausgewählten Nutzern auch geliked wurden
    const likedBySelected = firstUserLikes.filter(id =>
      usersToMatch.slice(1).every(user => 
        votes[user]?.some(v => v.id === id && v.liked)
      )
    );

    return movies.filter(m => likedBySelected.includes(m.id));
  };

  // 🧹 Entfernen aus Likes
  const removeLike = (id) => {
    const updated = votes[user].filter(v => v.id !== id);
    setVotes({ ...votes, [user]: updated });
  };

  // 🧠 Index zurücksetzen, wenn alle Filme bewertet
  useEffect(() => {
    if (remainingMovies.length <= index) {
      setIndex(0);
    }
  }, [remainingMovies, index]);

  // 👍👎 Bewertung speichern
  const handleVote = (liked) => {
    const current = remainingMovies[index];
    const userVotes = votes[user] || [];
    const updated = [...userVotes, { id: current.id, liked }];
    setVotes({ ...votes, [user]: updated });
    setIndex(index + 1);
  };

  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              🌗
            </button>
            <Link to="/">🎬 Swipen</Link>
            <Link to="/galerie">🖼️ Galerie</Link>
            <Link to="/meine-likes">💖 Meine Likes</Link>
            {user && <button onClick={() => setUser(null)}>👤</button>}
          </nav>
          <div className="contentTypeToggle">
            <button onClick={() => setContentType('movie')} className={contentType === 'movie' ? 'active' : ''}>Filme</button>
            <button onClick={() => setContentType('series')} className={contentType === 'series' ? 'active' : ''}>Serien</button>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={<SwipePage user={user} setUser={setUser} currentMovie={currentMovie} handleVote={handleVote} />}
          />
          <Route
            path="/galerie"
            element={
              <GalleryPage 
                user={user} 
                matches={findMatches(galleryFilterUsers)}
                allUsers={Object.keys(defaultVotes)}
                filteredUsers={galleryFilterUsers}
                onFilterChange={handleGalleryFilterChange}
              />
            }
          />
          <Route
            path="/meine-likes"
            element={
              <MyLikesPage
                user={user}
                movies={movies}
                userLikes={user ? votes[user].filter(v => v.liked) : []}
                removeLike={removeLike}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
