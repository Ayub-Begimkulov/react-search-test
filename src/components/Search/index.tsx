import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { connect } from "react-redux";
import { clearSearch, searchByQuery, setSearchQuery } from "store/actions";
import { IAppState } from "store";
import { Highlight } from "components/Highlight";
import { ISearchResult } from "api/search";
import { debounce } from "utils";

import SearchIcon from "assets/images/search.svg";
import CloseIcon from "assets/images/close.svg";
import "./index.scss";

interface ISearchProps {
  query: string;
  results: ISearchResult[];
  searchByQuery: (query: string) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const Search = ({
  query,
  results,
  searchByQuery,
  setSearchQuery,
  clearSearch,
}: ISearchProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounceUpdateSearch(value.trim());
  };

  // using useMemo instead of useCallback here
  // to prevent unnecessary calls to debounce
  const debounceUpdateSearch = useMemo(
    () =>
      // use debounce to reduce number of requests
      debounce(200, (value: string) => {
        if (value.length === 0) {
          clearSearch();
        } else {
          searchByQuery(value);
        }
      }),
    [searchByQuery, clearSearch]
  );

  const onDocumentClick = useCallback(
    (e: Event) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    },
    [setShowSuggestions]
  );

  useEffect(() => {
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [onDocumentClick]);

  const onFocus = () => {
    setShowSuggestions(true);
  };

  const onClearSearch = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="search">
      <img
        className="search__icon search__icon--search"
        src={SearchIcon}
        alt="search-icon"
      />

      {query.length > 0 && (
        <div className="search__clear-wrap" onClick={onClearSearch}>
          <div className="search__clear-btn">
            <img
              className="search__clear-btn-icon"
              src={CloseIcon}
              alt="clear"
            />
          </div>
        </div>
      )}

      <input
        className="search__input"
        ref={inputRef}
        type="text"
        placeholder="Поиск по магазину"
        onFocus={onFocus}
        onChange={onChange}
        value={query}
      />

      <ul
        className="search__suggestions-list"
        style={{ display: showSuggestions ? "block" : "none" }}
      >
        {results.map(item => (
          <li className="search__suggestions-item" key={item.id}>
            <Highlight text={item.name} highlight={query} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => {
  return {
    query: state.search.query,
    results: state.search.results,
  };
};

const mapDispatchToProps = {
  searchByQuery,
  setSearchQuery,
  clearSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
