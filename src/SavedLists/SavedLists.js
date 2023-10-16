import './SavedLists.css';
import Playlist from '../Playlist/Playlist.js'

export default function SavedLists({setConfirm, savedPlaylists, setPlaylistTracks, setOldPlaylist}) {
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
        </section>
      );
    }
