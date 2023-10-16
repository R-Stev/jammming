// import './Tracklist.css';
import Track from '../Track/Track.js'

export default function Tracklist({tracklist, onAdd, onRemove, mode}) {
  return (<div>
    {tracklist.map(item => {
      return (<Track
        key={item.id}
        track={item}
        onAdd={onAdd}
        onRemove={onRemove}
        mode={mode} />)
    })}
    </div>
  );
}
