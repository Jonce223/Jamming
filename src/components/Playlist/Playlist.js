import React, {useCallback} from "react";

import TrackList from "../TrackList/TrackList";

function Playlist(props){
    const handleNameChange = useCallback((e) => {
        props.onNameChane(e.target.value);
    },[props.onNameChane]);

    return (
        <div className="Playlist">
            <input onChange={handleNameChange} defaultValue={'New Playlist'} />
            <TrackList
                tracks={props.playlistTracks}
                isRemoval={true}
                onRemove={props.onRemove}
            />
            <button className="Playlist-save" onClick={props.onSave}>
                SAVE TO SPOTIFY
            </button>
        </div>
    );
};

export default Playlist;