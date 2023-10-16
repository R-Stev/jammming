import './DeleteModal.css';

export default function DeleteModal({ pl, onClose, onConfirm }) {
    return (
        <div id="overlay">
            <div className="row modal">
                <div>Delete {pl.name} from your library?</div>
                <div>
                    <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-light" onClick={onConfirm} data-testid="Confirm delete">Delete</button>
                </div>
            </div>
        </div>
    );
  }
  