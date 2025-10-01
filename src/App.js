import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Brightness4, Brightness7, Logout, Theaters, Tv, Favorite } from '@mui/icons-material';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

import { lightTheme, darkTheme } from './theme';
import { fetchPopularMovies, fetchPopularSeries } from './api/tmdb';
import SwipePage from './pages/SwipePage';
import GalleryPage from './pages/GalleryPage';
import MyLikesPage from './pages/MyLikesPage';
import UserSelectionPage from './pages/UserSelectionPage';

// Die Haupt-App, die nur für eingeloggte Benutzer sichtbar ist
const MainApp = ({ user, setUser, movies, votes, findMatches, defaultVotes, handleGalleryFilterChange, galleryFilterUsers, removeLike, remainingMovies, currentMovie, handleVote, theme, setTheme, setContentType, contentType }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Match
        </Typography>
        <Typography sx={{ mr: 2 }}>Hallo, {user}</Typography>
        <IconButton color="inherit" component={RouterLink} to="/"><Theaters /></IconButton>
        <IconButton color="inherit" component={RouterLink} to="/galerie"><Tv /></IconButton>
        <IconButton color="inherit" component={RouterLink} to="/meine-likes"><Favorite /></IconButton>
        <IconButton color="inherit" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        {user && <IconButton color="inherit" onClick={() => setUser(null)}><Logout /></IconButton>}
      </Toolbar>
    </AppBar>
    
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <ToggleButtonGroup
        value={contentType}
        exclusive
        onChange={(e, newType) => newType && setContentType(newType)}
        aria-label="content type"
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="movie">Filme</ToggleButton>
        <ToggleButton value="series">Serien</ToggleButton>
      </ToggleButtonGroup>

      <Routes>
        <Route
          path="/"
          element={<SwipePage user={user} currentMovie={currentMovie} handleVote={handleVote} />}
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  </Box>
);

const defaultVotes = { Karen: [], Tom: [], Thalia: [] };

function App() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem('movieIndex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  // 💾 Theme speichern
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const [user, setUser] = useState(() => localStorage.getItem('movieUser') || null);
  const [contentType, setContentType] = useState('movie'); // 'movie' or 'series'

  const [votes, setVotes] = useState(defaultVotes);

  // Reset state when content type changes
  useEffect(() => {
    setMovies([]);
    setIndex(0);
    setPage(1);
  }, [contentType]);

  // ☁️ Firestore Real-time Listener für Votes
  useEffect(() => {
    // Erstelle Listener für jeden bekannten Benutzer
    const unsubscribers = Object.keys(defaultVotes).map(userName => {
      const docRef = doc(db, "votes", userName);
      return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setVotes(prev => ({
            ...prev,
            [userName]: doc.data().votes || []
          }));
        }
      });
    });

    // Aufräumen, wenn die Komponente unmounted wird
    return () => unsubscribers.forEach(unsub => unsub());
  }, []); // Läuft nur einmal


  // 💾 Benutzer speichern
  useEffect(() => {
    if (user) {
      localStorage.setItem('movieUser', user);
    } else {
      // Beim Ausloggen alles zurücksetzen
      localStorage.removeItem('movieUser');
    }
  }, [user]);

  const [galleryFilterUsers, setGalleryFilterUsers] = useState(Object.keys(defaultVotes));

  const handleGalleryFilterChange = (user, isChecked) => {
    setGalleryFilterUsers(prev => 
      isChecked ? [...prev, user] : prev.filter(u => u !== user)
    );
  };

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

      setMovies(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newMovies = combined.filter(m => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
    };

    loadContent(page);
  }, [page, contentType]);

  // Mehr laden, wenn das Ende der Liste fast erreicht ist
  useEffect(() => {
    if (remainingMovies.length > 0 && remainingMovies.length - index < 5) {
      setPage(prev => prev + 1);
    }
  }, [index, remainingMovies.length]);

  // 💾 Fortschritt speichern (movieIndex bleibt lokal, da es gerätespezifisch ist)
  useEffect(() => {
    localStorage.setItem('movieIndex', index.toString());
  }, [index]);

  // 🧠 Matching-Logik (bleibt gleich)
  const findMatches = (usersToMatch) => {
    if (!usersToMatch || usersToMatch.length === 0) return [];

    const firstUserLikes = votes[usersToMatch[0]]?.filter(v => v.liked).map(v => v.id) || [];

    const likedBySelected = firstUserLikes.filter(id =>
      usersToMatch.slice(1).every(user => 
        votes[user]?.some(v => v.id === id && v.liked)
      )
    );

    return movies.filter(m => likedBySelected.includes(m.id));
  };

  // 🧹 Entfernen aus Likes -> Schreibt jetzt in Firestore
  const removeLike = async (movieId) => {
    if (!user) return;
    const docRef = doc(db, "votes", user);
    const movieToRemove = votes[user].find(v => v.id === movieId);
    if (movieToRemove) {
      await updateDoc(docRef, {
        votes: arrayRemove(movieToRemove)
      });
    }
  };

  // 🧠 Index zurücksetzen, wenn alle Filme bewertet
  useEffect(() => {
    if (remainingMovies.length <= index) {
      setIndex(0);
    }
  }, [remainingMovies, index]);

  // 👍👎 Bewertung speichern -> Schreibt jetzt in Firestore
  const handleVote = async (liked) => {
    if (!user || !currentMovie) return;

    const voteData = {
      id: currentMovie.id,
      liked: liked,
      name: currentMovie.name,
      poster_path: currentMovie.poster_path,
      type: currentMovie.type
    };

    const docRef = doc(db, "votes", user);

    try {
      // Fügt das neue Votum zum Array hinzu. Erstellt das Dokument, falls es nicht existiert.
      await updateDoc(docRef, {
        votes: arrayUnion(voteData)
      });
    } catch (e) {
      // Wenn das Dokument nicht existiert, erstelle es
      await setDoc(docRef, { votes: [voteData] });
    }

    setIndex(index + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user ? (
          <MainApp {...{ user, setUser, movies, votes, findMatches, defaultVotes, handleGalleryFilterChange, galleryFilterUsers, removeLike, remainingMovies, currentMovie, handleVote, theme: themeMode, setTheme: setThemeMode, setContentType, contentType }} />
        ) : (
          <UserSelectionPage setUser={setUser} />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;