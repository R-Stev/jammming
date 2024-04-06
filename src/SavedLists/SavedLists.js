import './SavedLists.css';
import Playlist from '../Playlist/Playlist.js'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function SavedLists({setConfirm, playlistPage, setPlaylistPage, playlistLength, savedPlaylists, setPlaylistTracks, setOldPlaylist}) {
  const [prevPageDisabled, setPrevPageDisabled] = useState(true);
  const [nextPageDisabled, setNextPageDisabled] = useState(true);
  const pageMax = Math.max(Math.ceil(playlistLength / 10),1);
  useEffect(() => {
    setPrevPageDisabled(playlistPage == 1);
    setNextPageDisabled(playlistPage == pageMax);
  }, [playlistPage, pageMax]);
  function changePage(dir) {
    let newPage = (dir === 'prev' ? playlistPage - 1 : playlistPage + 1);
    if(newPage >= 1 && newPage <= pageMax){
      setPlaylistPage(newPage);
    }
  }
  return (
    <section className="savedlists col my-3 pb-2" data-testid="savedlists">
      <p className="my-2">Saved Playlists</p>

      {savedPlaylists.map(item => {
        return (<Playlist
        setConfirm={setConfirm}
        key={item.id}
        pl={item}
        setPlaylistTracks={setPlaylistTracks}
        setOldPlaylist={setOldPlaylist} />)
      })}
      <div className="row justify-content-center my-3" id="page-nav">
        <button type="button" className="btn btn-outline-light" id="prevPage"
          disabled={prevPageDisabled} aria-label="Previous page" onClick={() => changePage('prev')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="px-3 my-auto">{playlistPage}</div>
        <button type="button" className="btn btn-outline-light" id="nextPage"
          disabled={nextPageDisabled} aria-label="Next page" onClick={() => changePage('next')}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </section>
  );
}
