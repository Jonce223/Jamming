import React, { useCallback } from "react";

import './Track.css';
//useCallback is used here to memoize the addTrack and removeTrack functions
//An object containing information about a song
function Track(props) {
    
    //on add function passed down from a parent component that adds the track to the playlist
    const addTrack= useCallback((e) => {
        props.onAdd(props.track);
    }, [props.onAdd, props.track]);
    
    //A function passed down from a parent that removes the track from the playlist
    const removeTrack = useCallback((e) => {
        props.onRemove(props.track);

    }, [props.onRemve, props.track]);
    

    //renderAction function determines wich button to display
    const renderAction = () => {
        //if props.isRemoval is true, then it renders the button with - and call removeTrack function when clicked
        if(props.isRemoval){
            return(
            <button className="Track-action" onClick={removeTrack}>
                -
            </button>
            );
        }
        //otherwise it renders button with + that will call the addTrack function
        return (
            <button className="Track-action" onClick={addTrack}>
                +
            </button>
        );
    };
    
    return (
        <div className="Track">
            <div className="Track-information">
                <h3>{props.track.name}</h3>
                <p>
                    {props.track.artist} | {props.track.album}
                </p>
            </div>
            {renderAction()}
        </div>
    );
};

export default Track;