const clientId= 'fb9905607bdb494db10434807b808236'; //Our clientId
const redirectUri= 'http://localhost:3000/'; //Where API should redirect
let accessToken; //created a variable for the access token
// Created a Spotify object, with its methods
const Spotify = {
    /* The purpose of this is checking if the app already has an access token(stored in the accessToken var.),
    and if not, it will extract it from the URL after the user has be redirected from spotify's authorization page.*/
    getAccessToken(){
        //Checking if accessToken is already set
        if(accessToken){
            return accessToken;
        }

        //Extract the access token and expirations from the URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        //If both parameters are found in the URL,
        //the accessToken variable is set to the value access_token
        if(accessTokenMatch && expiresInMatch){
            accessToken= accessTokenMatch[1];
            //The expiresIin variable is set to the expiration time(in seconds)
            //for the token
            const expiresIn= Number(expiresInMatch[1]);

            /*Set a timeout cleatr the token after it expires
            The token will be cleared form the accessToken variable after the expiration time
            has passed. We do this using setTimeout()*/
            window.setTimeout(() => accessToken = '', expiresIn * 1000);

            //Update the URL to remove the access token:
            //This updates browser's history by removing the access_token and expires_in
            //parameters from the URL so they don't persist after the token is obtained
            window.history.pushState('Access Token', null, '/');   
                    
            //returns access token
            return accessToken;
        } else {
            //If no access token is found in the URL, redirect the user to Spotify's authorization page
            const accessUrl= `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
            /*If no token is found, the function will redirect the user to Spotify's authorization page where they will log in and grant the necessary permissions.
             The URL is constructed dynamically using the clientId and redirectUri (which should be defined elsewhere in the code). */
        }
    },
    //This function allows user to search for tracks on Spotify using a given search term(term)
    search(term){
        //retrieving the access token:
        const accessToken = Spotify.getAccessToken();
        //Search request to Spotify:
        /*It Sends a GET request to Spotify endpoint /v1/search with the search term(term)
        and the Authorization header containing the access token.*/
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        /*//Handles the response, when response is received, it is parsed as JSON*/
        .then(response => {
            return response.json(); 
        })
        /*Checks if the response contains tracks:
        - if there are no tracks in the response(jsonResponse.tracks), an empty array is returned
        -Otherwise, it maps over the tracks in the response and extracts details like:
        id, name, artist, album, and uri*/
        .then(jsonRespone =>{
            if(!jsonRespone.tracks){
                return [];
            }
            return jsonRespone.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },
    //this methods purpose is to create new playlist and add a list of track URI's to it.
    savePlaylist(name, trackUris) {
        //Checking if the playlis tname and track URi's are valid
        //If no name is provided or trackUris array is empty, the function returns early and does absolutely nothing.
        if(!name || !trackUris){
            return;
        }
        //retrieving access Token:
        const accessToken = Spotify.getAccessToken();
        //Define headers for the request:
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
        //Fetching the user's profile:
        //It makes a request to api.spotify.com/v1/me to get cuttent user's data
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        //Create the playlist:
        ).then(jsonRespone => {
        //We're getting users id from the response(jsonResponse), and a requesr is made to create a new playlost for the user with the provided name 
        userId = jsonRespone.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
        }).then(respone => respone.json()
        //Add tracks to the playlist
        /* Once the playlist is created, the tracks(trackUri) are added tot he newly created playlist using another request*/
        ).then(jsonRespone => {
                const playlistId = jsonRespone.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                });
            });
        });    
    }
};



export default Spotify;