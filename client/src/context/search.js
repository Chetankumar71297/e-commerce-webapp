import { useState, useContext, createContext } from "react";

const SearchResultsContext = createContext();
const SearchResultsProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchResultsContext.Provider value={[searchResults, setSearchResults]}>
      {children}
    </SearchResultsContext.Provider>
  );
};

// custom hook
const useSearchResults = () => useContext(SearchResultsContext);

export { useSearchResults, SearchResultsProvider };
