import {useState} from 'react';
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function SearchBar({setSearchTerm, setSearchPage}) {
  const [showDetails, setShowDetails] = useState(false);
  const toggleBtn = <button type="button" className={'btn btn-outline-light ' + (showDetails ? 'toggleOpen' : 'toggleClosed')} id="toggleDetails"
  aria-label="Toggle details" onClick={() => toggleDetails()}>
      <FontAwesomeIcon icon={showDetails ? faAngleDown : faAngleRight} />
  </button>;
  const expandedSearch = <div>
    <div><input type="text" id="trackInput" onKeyDown={e => triggerSearch(e.key)} placeholder='Track (optional)' /></div>
    <div><input type="text" id="artistInput" onKeyDown={e => triggerSearch(e.key)} placeholder='Artist (optional)' /></div>
    <div><input type="text" id="albumInput" onKeyDown={e => triggerSearch(e.key)} placeholder='Album (optional)' /></div>
    <div><input type="text" id="yearInput" onKeyDown={e => triggerSearch(e.key)} placeholder='Year (optional)' /></div>
  </div>;

  function toggleDetails() {
    setShowDetails(!showDetails);
  }

  function triggerSearch(key) {
    if(key === 'Enter'){
      makeSearch()
    }
  }
  function makeSearch() {
    const generalTerm = document.getElementById('searchInput').value.trim();
    let trackTerm = document.getElementById('trackInput')?.value.trim();
    let artistTerm = document.getElementById('artistInput')?.value.trim();
    let albumTerm = document.getElementById('albumInput')?.value.trim();
    let yearTerm = document.getElementById('yearInput')?.value.trim();
    if(trackTerm?.length > 0){trackTerm = `track:${trackTerm}`}
    if(artistTerm?.length > 0){artistTerm = `artist:${artistTerm}`}
    if(albumTerm?.length > 0){albumTerm = `album:${albumTerm}`}
    if(yearTerm?.length > 0){yearTerm = `year:${yearTerm}`}
    const searchTerm = [generalTerm, trackTerm, artistTerm, albumTerm, yearTerm].filter(Boolean).join(" ").replaceAll(" ", "%20");
    if (searchTerm.length > 0){
      setSearchTerm(searchTerm);
      setSearchPage(1);
    }
  }
  function clearSearch() {
    document.getElementById('searchInput').value = '';
    if(showDetails){
      document.getElementById('trackInput').value = '';
      document.getElementById('artistInput').value = '';
      document.getElementById('albumInput').value = '';
      document.getElementById('yearInput').value = '';  
    }
  }
  return (
    <section className="searchBar col my-3">
        <div className="my-1 text-center">
          <div>
            {toggleBtn}
            <input type="text" id="searchInput" placeholder='Search'
            onKeyDown={e => triggerSearch(e.key)} />
          </div>
          {showDetails && expandedSearch}
        </div>
        <div className="my-1 text-center">
          <button type="button" className="btn btn-outline-light mx-1" aria-label='search'
          onClick={makeSearch}>Search</button>
          <button type="button" className="btn btn-outline-light mx-1" aria-label='clear'
          onClick={clearSearch}>Clear</button>
        </div>
    </section>
  );
}
