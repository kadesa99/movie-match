
import React from 'react';

const GalleryPage = ({ user, matches, allUsers, filteredUsers, onFilterChange }) => {
  if (!user) {
    return <h3>Bitte wähle zuerst einen Nutzer auf der Startseite aus.</h3>;
  }

  return (
    <>
      <h2>🖼️ Gemeinsame Favoriten</h2>

      <div className="gallery-filter">
        <p>Übereinstimmungen anzeigen für:</p>
        <div className="user-checkboxes">
          {allUsers.map(u => (
            <label key={u}>
              <input 
                type="checkbox" 
                checked={filteredUsers.includes(u)}
                onChange={(e) => onFilterChange(u, e.target.checked)}
              />
              {u}
            </label>
          ))}
        </div>
      </div>

      <div className="gallery">
        {matches.length > 0 ? matches.map((m) => (
          <div key={m.id} className="gallery-item">
            <img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.name} />
            <p>{m.name}</p>
          </div>
        )) : <p>Keine Übereinstimmungen für die aktuelle Auswahl.</p>}
      </div>
    </>
  );
};

export default GalleryPage;
