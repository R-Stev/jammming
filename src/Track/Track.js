import './Track.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function Track({onAdd, onRemove, track, mode}) {
  function addTrack() {
    onAdd(track);
  }
  function removeTrack() {
    onRemove(track);
  }

  const trackAdd = <button type="button" className="btn btn-outline-light trackBtn"
  onClick={addTrack} aria-label="Add"><FontAwesomeIcon icon={faPlus} /></button>;
  const trackRemove = <button type="button" className="btn btn-outline-light trackBtn"
  onClick={removeTrack} aria-label="Remove"
  ><FontAwesomeIcon icon={faMinus} /></button>;
  return (
      <div className="track row justify-content-between">
        <div className={'pl-3 trackText' + (mode ? 'Btn' : '')}>
          <p data-testid="trackName">{track.name}</p>
          <p className="albumName">{`${track.artist} | ${track.album}`}</p>
        </div>
        <div className="pr-3 my-auto">
          {mode === 'remove' ? trackRemove : (mode === 'add' ? trackAdd : '')}
        </div>
      </div>
  );
}
