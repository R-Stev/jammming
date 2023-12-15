import {useState} from 'react';
import './Playlist.css';
import Track from '../Track/Track.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function Playlist({setConfirm, pl, setPlaylistTracks, setOldPlaylist}) {
    const [showDetails, setShowDetails] = useState(false);
    const toggleBtn = <button type="button" className={'btn btn-outline-light ' + (showDetails ? 'toggleOpen' : 'toggleClosed')} id="toggleDetails"
    aria-label="Toggle details" onClick={() => toggleDetails()}>
        <FontAwesomeIcon icon={showDetails ? faAngleDown : faAngleRight} />
    </button>;
    const trackSection = pl.tracks.map(item => {
        return (<Track
          key={item.id}
          track={item} />)
      });
    function toggleDetails() {
        setShowDetails(!showDetails);
    }
    function editPlaylist(pl) {
        console.log(pl);
        setPlaylistTracks(pl.tracks);
        setOldPlaylist({
            id: pl.id,
            name: pl.name,
            description: pl.description,
            public: pl.public,
            collaborative: pl.collaborative,
            tracks: pl.tracks
        });
    }
    function confirmDeletion(name, id){
        setConfirm({
            name: name,
            id: id
        })
        console.log(`delete ${name}, ${id}`);
    }
    return (
        <div className="my-2" data-testid={'SavedList ' + pl.name}>
            <div className="plItem row">
                <div className="px-3">{toggleBtn}</div>
                <div>{pl.name}</div>
                <div className="ml-auto mr-1">
                    <button type="button" className="btn btn-outline-light editPlaylist" aria-label="Edit playlist" onClick={() => editPlaylist(pl)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>
                <div className="mr-3">
                    <button type="button" className="btn btn-outline-light deletePlaylist" aria-label="Delete playlist" data-testid={'Delete ' + pl.name} onClick={() => confirmDeletion(pl.name, pl.id)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
            {showDetails ? trackSection : ''}
        </div>

    );
}
