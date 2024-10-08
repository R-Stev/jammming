import secrets from '../secrets.json';
import PopupWindow from './PopupWindow.js';
import {useEffect, useState} from 'react';

const redirectUri = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    ? 'http://localhost:3000/'
    : 'https://spotify-playlist-manage.netlify.app/';

const CLIENT_ID = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    ? secrets.CLIENT_ID
    : await fetch('/.netlify/functions/getKey').then((res) => res.json()).then((res) => res.CLIENT_ID);

export default function Spotify({
    loggedIn,
    setLoggedIn,
    term,
    searchPage,
    playlistPage,
    setSearchTerm,
    setSearchResults,
    playlistDetails,
    setPlaylistDetails,
    savedPlaylists,
    setSavedPlaylists,
    trackUris,
    setTrackUris,
    playlistToDelete,
    setPlaylistToDelete,
    setSearchLength,
    setPlaylistLength,
    oldPlaylist,
    setOldPlaylist,
    playlistTrackReq,
    setPlaylistTrackReq,
    setRenamePlaylist
}) {

    const [prevTerm, setPrevTerm] = useState(term);
    const [prevSearchPage, setPrevSearchPage] = useState(searchPage);
    if (term !== prevTerm || searchPage !== prevSearchPage) {
        setPrevTerm(term);
        setPrevSearchPage(searchPage);
        const fetchSearchResult = async () => {
            if(term){
                const result = await search(term, searchPage);
                if(result){
                    setSearchResults(result);
                }
            }    
        }
        fetchSearchResult();
    }

    const [prevPlaylistPage, setPrevPlaylistPage] = useState(playlistPage);
    if (playlistPage !== prevPlaylistPage) {
        setPrevPlaylistPage(playlistPage);
        const fetchPlaylistResult = async () => {
            const result = await readPlaylists(playlistPage);
            if(result){
                setSavedPlaylists(result);
            }
        }
        fetchPlaylistResult();
    }

    const [prevDetails, setPrevDetails] = useState(playlistDetails);
    const [prevUris, setPrevUris] = useState(trackUris);
    if (playlistDetails !== prevDetails || trackUris !== prevUris) {
        setPrevDetails(playlistDetails);
        setPrevUris(trackUris);
        const playlistEdits = async () => {
            if(playlistDetails){
                if(oldPlaylist){
                    await savePlaylist(playlistDetails, trackUris, oldPlaylist)
                } else {await savePlaylist(playlistDetails, trackUris)}
                setPlaylistDetails(null);
                setTrackUris([]);
                refreshPlaylists();
            }
        }
        playlistEdits();
    }

    const [prevLogin, setPrevLogin] = useState(false);
    if (loggedIn !== prevLogin) {
      setPrevLogin(loggedIn);
      refreshPlaylists();
    }

    useEffect(() => {
        if(playlistToDelete){
            deletePlaylist(playlistToDelete);
            setPlaylistToDelete(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistToDelete]);

    const [prevPlReq, setPrevPlReq] = useState(playlistTrackReq)
    if(playlistTrackReq !== prevPlReq) {
        const playlistRequest = async () => {
            setPrevPlReq(playlistTrackReq);
            if(playlistTrackReq){
                const accessToken = await getAccessToken();
                const plTrackRes = await readPlaylistTracks(playlistTrackReq, accessToken);
                let plCopy = savedPlaylists;
                let plIndex = savedPlaylists.findIndex(pl => pl.href === playlistTrackReq);
                plCopy[plIndex].tracks = plTrackRes;
                setSavedPlaylists(plCopy);
                setPlaylistTrackReq(null);
            }
        }
        playlistRequest();
    }

    // Authorization Code with PKCE Flow
    function redirectToSpotifyAuth() {
        let codeVerifier = generateRandomString(128);
        
        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'playlist-modify-private playlist-modify-public playlist-read-collaborative playlist-read-private';
        
            sessionStorage.setItem('code_verifier', codeVerifier);
        
            let args = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
            });
        
            // window.location = 'https://accounts.spotify.com/authorize?' + args;

            const popup = PopupWindow.open(
                'spotify-authorization',
                `https://accounts.spotify.com/authorize?${args}`,
                "height=1000,width=600"
              );
          
            //   this.onRequest();
              popup.then(
                data => onSuccess(data),
                error => onFailure(error)
            );
          
        });
    }
    function generateRandomString(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    async function generateCodeChallenge(codeVerifier) {
        function base64encode(string) {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        }
        
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        
        return base64encode(digest);
    }
    function onSuccess(code) {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: CLIENT_ID,
            code_verifier: sessionStorage.getItem('code_verifier')
        });
        exchangeToken(body);
    }
    function onFailure(error) {
        console.log('error: ', error);
    }
    async function exchangeToken(body) {
        return fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })
        .then(response => {
            if(handleResponse(response)) {
                return response.json();
            }
        })
        .then(data => {
            const t = new Date();
            const expires_at = t.setSeconds(t.getSeconds() + data.expires_in);
            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('expires_at', expires_at);
            localStorage.setItem('refresh_token', data.refresh_token);
            setLoggedIn(true);
            return(data.access_token);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    async function getAccessToken() {
        let expires_at = sessionStorage.getItem('expires_at');
        let expired = (Number(new Date()) - expires_at) >= 0;
        let token = sessionStorage.getItem('access_token');
        if(token === null || expires_at === null || expired){
            const refreshToken = localStorage.getItem('refresh_token');
            if(refreshToken){
                const body = new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: CLIENT_ID
                });
        
                token = await exchangeToken(body);
            } else {
                throw new Error('User not logged in.');
            }
        }
        return token;
    }
    
    async function search(term, searchPage) {
        // setSearchTerm(null);
        const accessToken = await getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}&offset=${(searchPage-1)*20}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            if(handleResponse(response)) {
                return response.json();
            }
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            setSearchLength(jsonResponse.tracks.total);
            return jsonResponse.tracks.items.map(track => ({
                key: track.id,
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    }
    function playlistDetailsChanged(oldpl, newpl) {
        return (oldpl.name !== newpl.name) || (oldpl.description !== newpl.description)
         || (oldpl.public !== newpl.public) || (oldpl.collaborative !== newpl.collaborative)
    }
    function handleResponse(response) {
        if(response.ok) {
            return response.ok;
        } else {
            return response.json().then(jsonResponse => {
                throw new Error(`HTTP status ${jsonResponse.error.status}, ${jsonResponse.error.message}`);
            });
        }
    }
    async function savePlaylist(details, trackUris, oldPlaylist = null) {
        if (!details.name || !trackUris.length) {
            return;
        }

        const accessToken = await getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        if(!oldPlaylist){
            let userId;
            return fetch('https://api.spotify.com/v1/me', {headers: headers}
            ).then(response => response.json()
            ).then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify(details)
                }).then(response => response.json()
                ).then(jsonResponse => {
                    let playlistId = jsonResponse.id;
                    return savePlaylistTracks(playlistId, trackUris, headers);
                });
            });
        } else if(oldPlaylist.id) {
            if(playlistDetailsChanged(oldPlaylist, details)) {
                const result = await savePlaylistDetails(oldPlaylist.id, headers, details);
                if(result && oldPlaylist.name !== details.name) {
                    setRenamePlaylist({name: details.name, id: oldPlaylist.id});
                }
            }
            if(oldPlaylist.tracks !== trackUris) {
                await savePlaylistTracks(oldPlaylist.id, trackUris, headers);
            }
            setOldPlaylist(null);
        }
    }
    async function savePlaylistTracks(playlistId, trackUris, headers) {
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify({uris: trackUris})
        }).then(response => handleResponse(response));
    }
    async function savePlaylistDetails(playlistId, headers, details) {
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify(details)
        }).then(response => handleResponse(response));
    }
    async function readPlaylists(playlistPage) {
        const accessToken = await getAccessToken();
        let playlists = await fetch(`https://api.spotify.com/v1/me/playlists?offset=${(playlistPage-1)*10}&limit=10`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.items) {
                return [];
            }
            setPlaylistLength(jsonResponse.total);
            return jsonResponse.items.map(item => ({
                key: item.id,
                id: item.id,
                name: item.name,
                description: item.description,
                public: item.public,
                collaborative: item.collaborative,
                href: item.href,
                tracks: []
            }));
        });
        // for(let i in playlists){
        //     const tracks = await readPlaylistTracks(playlists[i].href, accessToken);
        //     playlists[i].tracks = tracks;
        // }
        return playlists;
    }
    async function readPlaylistTracks(href, accessToken){
        let tracklist = await fetch(`${href}/tracks`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.items) {
                return [];
            }
            return jsonResponse.items.map(item => ({
                key: item.track.id,
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri
            }));
        });
        return tracklist;
    }
    async function deletePlaylist(id){
        const accessToken = await getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        fetch(`https://api.spotify.com/v1/playlists/${id}/followers`, {
            headers: headers,
            method: 'DELETE'
        }).then(response => {
            if(handleResponse(response)) {
                refreshPlaylists();
            }
        });
    }
    async function refreshPlaylists(){
        if(loggedIn){
            const result = await readPlaylists(1);
            setSavedPlaylists(result);
        }
    }
    function logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }

    const loginButton = <button type="button" className="btn btn-outline-light mr-3"
            onClick={redirectToSpotifyAuth}>Login</button>;
    const logoutButton = <button type="button" className="btn btn-outline-light mr-3"
            onClick={logout}>Logout</button>;
return (
    <div>
        {loggedIn ? logoutButton : loginButton}
    </div>
      );
    }
