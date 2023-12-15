import './App.css';
import '../utils/fontawesome-svg-core-styles.css';
import NewPlaylist from '../NewPlaylist/NewPlaylist.js';
import SavedLists from '../SavedLists/SavedLists.js';
import SearchBar from '../SearchBar/SearchBar.js'
import SearchResults from '../SearchResults/SearchResults.js'
import Spotify from '../utils/Spotify.js'
import DeleteModal from '../utils/DeleteModal.js'
import {useState} from 'react';
// Background image sourced from https://unsplash.com/photos/64xuU5SvR0s

/* Todo:
  add playlist pages, similar to the search results
  get the list of tracks in a playlist only on request?
  add handling for HTTP 429 rate limiting?
  convert to using redux?
  more tests?
 */

export default function App() {
  const [mobileOption, setMobileOption] = useState('Results'); // Determines which pane is displayed in mobile view
  const [searchTerm, setSearchTerm] = useState(null); // The search term used in SearchBar
  const [searchResults, setSearchResults] = useState([]); // The search results displayed in SearchResults
  const [playlistTracks, setPlaylistTracks] = useState([]); // The list of tracks displayed in NewPlaylist
  const [playlistDetails, setPlaylistDetails] = useState(null); // The play list name used in NewPlaylist
  const [savedPlaylists, setSavedPlaylists] = useState([]); // The list of playlists displayed in SavedLists
  const [page, setPage] = useState(1); // The page number used in SearchResults
  const [trackUris, setTrackUris] = useState([]); // The list of track URIs from NewPlaylist
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('refresh_token') !== null);
  const [playlistToConfirm, setPlaylistToConfirm] = useState(null); // The playlist ID to confirm deletion
  const [playlistToDelete, setPlaylistToDelete] = useState(null); // The playlist ID to be deleted
  const [searchLength, setSearchLength] = useState(0); // The length of the Spotify search results, used in SearchResults
  const [oldPlaylist, setOldPlaylist] = useState(null); // The initial playlist details for comparison if an existing playlist is edited

  function addToPlaylist(item) {
    let items = [...playlistTracks];
    if (items.find(newItem => newItem.id === item.id)) {
      return;
    } else {
      items.push(item);
      setPlaylistTracks(items);
    }
  }
  function removeFromPlaylist(item) {
    setPlaylistTracks(
      playlistTracks.filter(newItem => newItem.id !== item.id)
    );
  }
  function changeOptions() {
    var selected = document.querySelector('input[name="options"]:checked')?.value;
    if(selected){
      setMobileOption(selected);
    }
  }

  const resultsPane = <SearchResults results={searchResults}
        onAdd={addToPlaylist}
        page={page}
        setPage={setPage}
        searchLength={searchLength} />;
  const newPlaylistPane = <NewPlaylist tracks={playlistTracks}
        onRemove={removeFromPlaylist}
        setPlaylistTracks={setPlaylistTracks}
        setPlaylistDetails={setPlaylistDetails}
        oldPlaylist={oldPlaylist}
        setOldPlaylist = {setOldPlaylist}
        setTrackUris={setTrackUris}
        playlistDetails={playlistDetails} />;
  const savedPlaylistPane = <SavedLists setConfirm={setPlaylistToConfirm} savedPlaylists={savedPlaylists}
        setPlaylistTracks={setPlaylistTracks} setOldPlaylist={setOldPlaylist} />;

  const userLoggedIn = <main className="appBody">
    <div className="row m-3 justify-content-center">
      <SearchBar setSearchTerm={setSearchTerm} setPage={setPage} />
    </div>
    <div className="btn-toolbar justify-content-center mobileView py-3" role="toolbar">
      <div className="btn-group btn-group-toggle btn-group-sm" data-toggle="buttons" role="group">
        <label className="btn btn-light active">
          <input type="radio" name="options" id="option1" value="Results" onChange={changeOptions} />Search Results
        </label>
        <label className="btn btn-light">
          <input type="radio" name="options" id="option2" value="New list" onChange={changeOptions} />New Playlist ({playlistTracks.length})
        </label>
        <label className="btn btn-light">
          <input type="radio" name="options" id="option3" value="Saved lists" onChange={changeOptions} />Saved Playlists
        </label>
      </div>
    </div>
    <div className="row justify-content-center mx-3 mobileView">
      { mobileOption === 'Results' && resultsPane}
      { mobileOption === 'New list' && newPlaylistPane}
      { mobileOption === 'Saved lists' && savedPlaylistPane}
    </div>
    <div className="row mx-3 justify-content-center desktopView">
      {resultsPane}
      {newPlaylistPane}
    </div>
    <div className="row mx-3 justify-content-center desktopView">
      {savedPlaylistPane}
    </div>
    <div>
      {playlistToConfirm !== null && 
      <DeleteModal
        pl={playlistToConfirm}
        onClose={() => setPlaylistToConfirm(null)}
        onConfirm={() => {
          setPlaylistToDelete(playlistToConfirm.id)
          setPlaylistToConfirm(null)
          if(oldPlaylist){
            setOldPlaylist('clear');
          }
        }} />}
      </div>
  </main>;

  return (
    <div className="App">
      <header className="appHeader">
        <div className="headerTitle">Jamming</div>
        <Spotify loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        term={searchTerm}
        setSearchTerm={setSearchTerm}
        setSearchResults={setSearchResults}
        savedPlaylists={savedPlaylists}
        setSavedPlaylists={setSavedPlaylists}
        playlistDetails={playlistDetails}
        setPlaylistDetails={setPlaylistDetails}
        trackUris={trackUris}
        setTrackUris={setTrackUris}
        playlistToDelete={playlistToDelete}
        setPlaylistToDelete={setPlaylistToDelete}
        page={page}
        setSearchLength={setSearchLength}
        oldPlaylist={oldPlaylist}
        setOldPlaylist={setOldPlaylist} />
      </header>
      {loggedIn && userLoggedIn}
    </div>
  );
}