import { useState } from "react";

export default function PointFieldSearch(props){

  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (event) => {
    props.resetSearchData()
    setSearchTerm(event.target.value);
  };


  function handleSearchClick(){
    props.searchFetcher.submit({ searchTerm: searchTerm,
                                 featureId: props.featureId },
                               {method: "get",
                                action: "utils/search-feature-requests"})
  }

  return (
    <div className="discoverySearchBarWrapper">
      <input
        className="discoverySearchBar"
        style={{flex: 1, alignItems: 'center'}}
        type="text"
        name="searchString"
        value = {searchTerm}
        placeholder={"Enter a Feature Description"}
        onChange={handleInput}
      />

      {searchTerm.length > 0 && (
        <button
          className="discoverySearchBarSubmit"
          type="submit"
          onClick={handleSearchClick}
          >
          {props.searchFetcher.state === 'submitting' ? "Searching..." : "Search"}
        </button>
      )}
    </div>
  )
}
