import React, { useState, useCallback } from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist'
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify.js';

function App() {
  //Creating State for search, playlist name and playlist track
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  //The search funciton is triggered when the user types something into the seatch bar
  //we're using useCallBack here to avoid recreating the function on every re-render, unless something inside the component changes.
  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);
 
  //The addTrack function add a track to the playlist if it isn't already thre
  const addTrack = useCallback((track) =>{
    //the function checks if the track is already in the playlistTracks array by checking id of the track against saved tracks
    if(playlistTracks.some((savedTrack) => savedTrack.id === track.id))
      return;

    //If the track is not already in the playlist, it updates the playlistTracks state by adding new track to the existing list(prevTracks).
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
  
  }, [playlistTracks]);//we pass playlistTracks as dependency, to ensure its always usng most up-to-date verion of playlistTracks state.
 
  //The function removes a track from the playlist
  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
    //uses .filter method to remove the track by cheking if the id of the track is different from the track to be removed
    //The updated list of tracks is stored in playlistTracks
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
      );
  }, []); //we're using useCallBack here to avoid recreating the function on every re-render, unless something inside the component changes.
 
  //function updates the name of the playlist
  const updatePlaylistName=useCallback((name) => {
    //simply updates the state with new name passed as an argument
    setPlaylistName(name);
  }, []); //we're using useCallBack here to avoid recreating the function on every re-render, unless something inside the component changes.
  
  //the function saves the current playlist to Spotify
  const savePlaylist=useCallback(() =>{
    //first it creates array of track URI's(The resource identifier of, for example, an artist, album or track(trackUris)) from the playlistTracks state.
    const trackUris = playlistTracks.map((track) => track.uri);
    //then, it calls Spotify.savePlaylist(), passing the playlist name and track URi's to save the playlist on Spotify
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      //After successfully saving  the playlist, it resets the playlistName and clears the playlistTraacks to reset the state
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
    });
  }, [playlistName, playlistTracks]);//we pass playlistName and playlistTracks as dependency, to ensure its always usng most up-to-date verion of playlistTracks state.

  return(
    <div>
      <h1>SSS - Spotify Song Search</h1>
      <div className='App'>
        <SearchBar onSearch={search}/>
        <div className='App-playlist'>
          <SearchResults searchResults={searchResults} onAdd={addTrack}/>
          <Playlist 
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
          
        </div>
      </div>
    </div>
  );
}

export default App;
