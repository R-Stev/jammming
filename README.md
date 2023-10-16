# Spotify playlist management

This project is a client for managing your Spotify playlists, created using React, and uses [Authorization Code with PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) to obtain the access token.

Project features:
- searching for tracks (with advanced options)
- create, read, update, and delete playlists
- uses refresh_token to obtain a new access_token, if expired

A client_id value is required, and needs to be provided in src/secrets.json.

```
{
    "CLIENT_ID": "specify value here"
}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  This opens [http://localhost:3000](http://localhost:3000) in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.  The tests cover saving and then deleting a test playlist, and require values for access_token and refresh_token to be successful.

### `npm run build`

Builds the app for production to the `build` folder.

