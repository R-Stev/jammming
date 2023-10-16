import './SearchResults.css';
import Tracklist from '../Tracklist/Tracklist.js'
import {useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function SearchResults({onAdd, results, page, setPage, searchLength}) {
  const pageMax = Math.ceil(searchLength / 20);
  useEffect(() => {
    console.log('Searchresults results effect');
    document.getElementById('page-nav').style.display = (results.length > 0 ? 'flex' : 'none');
  }, [results]);
  useEffect(() => {
    console.log('Searchresults page effect');
    if(page === 1){
      document.getElementById('prevPage').disabled = true;
    } else {
      document.getElementById('prevPage').disabled = false;
    }
    if(page === pageMax){
      document.getElementById('nextPage').disabled = true;
    } else {
      document.getElementById('nextPage').disabled = false;
    }
  }, [page, pageMax]);
  function changePage(dir) {
    let newPage = (dir === 'prev' ? page - 1 : page + 1);
    if(newPage >= 1 && newPage <= pageMax){
      setPage(newPage);
    }
  }
  return (
    <section className="searchresults col my-3" data-testid="searchResults">
        <p className="my-2">Results</p>
        <Tracklist tracklist={results}
        onAdd={onAdd}
        mode='add' />
        <div className="row justify-content-center my-3" id="page-nav">
          <button type="button"className="btn btn-outline-light" id="prevPage"
          aria-label="Previous page" onClick={() => changePage('prev')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="px-3 my-auto">{page}</div>
          <button type="button" className="btn btn-outline-light" id="nextPage"
          aria-label="Next page" onClick={() => changePage('next')}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
    </section>
  );
}
