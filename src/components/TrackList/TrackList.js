import React from "react";

import './TrackList.css';
import Track from '../Track/Track';

//Mapping through tracks by goig throug individual track and getting its information
function TrackList(props) {
    return(
        <div className="TrackList">
            {props.tracks.map((track) => {
                return (
                    <Track
                        track={track}
                        key={track.id}
                        onAdd={props.onAdd}
                        isRemoval={props.isRemoval}
                        onRemove={props.onRemove}/>
                );
            })}
        </div>
    );
};

export default TrackList;