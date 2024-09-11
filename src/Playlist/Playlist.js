import {useState} from 'react';
import './Playlist.css';
import Track from '../Track/Track.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function Playlist({
    setConfirm, pl, setPlaylistTracks, setOldPlaylist, setPlaylistTrackReq, saveCounter, renamePlaylist, setRenamePlaylist
}) {
    const [showDetails, setShowDetails] = useState(false);
    const [prevCounter, setPrevCounter] = useState(saveCounter);
    if(saveCounter !== prevCounter) {
        setPrevCounter(saveCounter);
        if(showDetails) {
            toggleDetails();
        }
    }
    const [renPl, setRenPl] = useState(renamePlaylist);
    const [playlistName, setPlaylistName] = useState(pl?.name);
    if(renamePlaylist !== renPl) {
        setRenPl(renamePlaylist);
        if(renamePlaylist.id === pl.id && renamePlaylist.name !== pl.name){
            setPlaylistName(renamePlaylist.name);
        }
    }
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
        if(!showDetails && pl.tracks.length === 0){
            setPlaylistTrackReq(pl.href);
        }
    }

    //From https://stackoverflow.com/a/52652681/209794
    function waitFor(conditionFunction){
        const poll = resolve => {
            if(conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 400);
        }      
        return new Promise(poll);
    }      
    async function editPlaylist(pl) {
        if(pl.tracks.length === 0){
            setPlaylistTrackReq(pl.href);
        }
        // This will cause problens should playlists with 0 tracks be allowed later on
        await waitFor(_ => pl.tracks.length > 0);
        setPlaylistTracks(pl.tracks);
        setOldPlaylist({
            id: pl.id,
            name: playlistName,
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
    }
    return (
        <div className="my-2" data-testid={'SavedList ' + playlistName}>
            <div className="plItem row">
                <div className="px-3">{toggleBtn}</div>
                <div>{playlistName}</div>
                <div className="ml-auto mr-1">
                    <button type="button" className="btn btn-outline-light editPlaylist" aria-label="Edit playlist" onClick={() => editPlaylist(pl)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>
                <div className="ml-1 mr-3">
                    <button type="button" className="btn btn-outline-light deletePlaylist" aria-label="Delete playlist" data-testid={'Delete ' + playlistName} onClick={() => confirmDeletion(playlistName, pl.id)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
            {showDetails ? trackSection : ''}
        </div>

    );
}
