import React, {useState, useCallback} from "react";

function SearchBar(props){
    const [term, setTerm] = useState('');

    //Handles changes made in the search box when someone types in it
    const handleTermChange = useCallback((e) =>{
        setTerm(e.target.value);
    },[]);

    const search = useCallback(() => {
        props.onSearch(term);
    }, [props.onSearch, term]);
    

    return (
        <div>
            <input
                placeholder='Search for a song'
                onChange = {handleTermChange}
            />
            <button className="SearchButton" onClick={search}>SEARCH</button>
        </div>
    );
};

export default SearchBar;


