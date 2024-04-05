import './SearchResults.css';
import Tracklist from '../Tracklist/Tracklist.js'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function SearchResults({onAdd, results, page, setPage, searchLength}) {
  const [prevPageDisabled, setPrevPageDisabled] = useState(true);
  const [nextPageDisabled, setNextPageDisabled] = useState(true);
  const pageMax = Math.max(Math.ceil(searchLength / 20),1);
  useEffect(() => {
    console.log(`Searchresults page effect: ${page} ${pageMax}`);
    setPrevPageDisabled(page == 1);
    setNextPageDisabled(page == pageMax);
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
          <button type="button" className="btn btn-outline-light" id="prevPage"
          disabled={prevPageDisabled} aria-label="Previous page" onClick={() => changePage('prev')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="px-3 my-auto">{page}</div>
          <button type="button" className="btn btn-outline-light" id="nextPage"
          disabled={nextPageDisabled} aria-label="Next page" onClick={() => changePage('next')}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
    </section>
  );
}
