import { TextField } from "@mui/material"
import { useRef, useState } from "react"
import SearchChats from "./searchChats"

function SearchBar() {
    const [searchText, setSearchText] = useState('')

    return (
        <div className="SearchBarContainer">
            <TextField id="outlined-basic" label="Search" variant="outlined" size="small" onChange={(e) => setSearchText(e.target.value)}/>
            {searchText === '' ? <div>NormalChats</div> : <SearchChats searchedUser={searchText}/>}
        </div>
    )
}

export default SearchBar