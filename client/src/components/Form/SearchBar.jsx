import React from "react";
import { useSearchResults } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchResults, setSearchResults] = useSearchResults();
  const navigate = useNavigate();
  const getSearchedProducts = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${searchResults.keyword}`
      );
      setSearchResults({ ...searchResults, results: data.products });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form className="d-flex" role="search" onSubmit={getSearchedProducts}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchResults.keyword}
          onChange={(e) =>
            setSearchResults({ ...searchResults, keyword: e.target.value })
          }
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
