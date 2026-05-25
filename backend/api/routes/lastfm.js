import express from 'express';
import axios from 'axios';

const router = express.Router()


const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';


/**
 * Converts a duration in seconds to a human-readable `M:SS` string.
 *
 * @param {number} duration - Track duration in seconds.
 * @returns {string} Formatted time string (e.g. `3:07`).
 */
function secondsToMinutesFormatted(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = String(duration % 60).padStart(2, '0');

    const formattedTime = `${minutes}:${seconds}`;
    return formattedTime;
}

/**
 * @route   GET /lastfm/top-tracks
 * @description Returns the top 10 globally charting tracks from the Last.fm API.
 *
 * @returns {Array<{rank: number, name: string, duration: string, playcount: string, listeners: string}>} 200 - Ranked list of top tracks.
 * @returns {Object} 500 - Error if the Last.fm API request fails.
 */
router.get("/top-tracks" , async(req, res) => {

    try {

        const params = {
            method: 'chart.getTopTracks',
            api_key: LASTFM_API_KEY,
            limit: '10',
            format: 'json'
        }

        // Create the API call and get the response data
        const { data } = await axios.get(LASTFM_BASE_URL, { params })

        // From the data extract the rank, name, duration, playcount, and listeners
        const tracks = data.tracks.track.map((track,index) => ({
            rank: index + 1,
            name: track.name,
            artist: track.artist.name,
            duration: secondsToMinutesFormatted(track.duration),
            playcount: track.playcount,
            listeners: track.listeners

        }));

        res.json(tracks)
    } catch (error) {
        res.status(500).json({error : "Failed to get the top tracks"})
    }

})

/**
 * @route   GET /lastfm/top-artists
 * @description Returns the top 10 globally charting artists from the Last.fm API.
 *
 * @returns {Array<{rank: number, name: string, playcount: string, listeners: string}>} 200 - Ranked list of top artists.
 * @returns {Object} 500 - Error if the Last.fm API request fails.
 */
router.get("/top-artists" , async (req, res) => {
    try {

        const params = {
            method: 'chart.getTopArtists',
            api_key: LASTFM_API_KEY,
            limit: '10',
            format: 'json'
        }

        // Create the API call and get the response data
        const { data } = await axios.get(LASTFM_BASE_URL, { params });

        // From the data only get the neccessary data such as rank, name, playcount, listeners
        const artists = data.artists.artist.map((artist, index) => ({
            rank: index + 1,
            name: artist.name,
            playcount: artist.playcount,
            listeners: artist.listeners
        }));

        // Return to json format
        res.json(artists);
    } catch (error){
        res.status(500).json({error : "Failed to get the top artists"})
    }


})

/**
 * @route   GET /lastfm/similar-artists
 * @description Returns up to 10 artists similar to the given artist using the Last.fm API.
 *
 * @queryparam {string} artist - (Required) The artist name to find similar artists for.
 *
 * @returns {Array<{name: string, match: string}>} 200 - List of similar artists with match score.
 * @returns {Object} 400 - Error if the `artist` query parameter is missing.
 * @returns {Object} 500 - Error if the Last.fm API request fails.
 */
router.get("/similar-artists", async (req, res) => {
    const { artist } = req.query;

    if (!artist) {
        return res.status(400).json({ error: 'artist query parameter is required' });
    }

    try {
        const params = {
            method: 'artist.getSimilar',
            artist,
            limit: 10,
            api_key: LASTFM_API_KEY,
            format: 'json'
        };

        const { data } = await axios.get(LASTFM_BASE_URL, { params });

        const artists = (data.similarartists?.artist || []).map((artist,index) => ({
            rank: index + 1,
            name: artist.name,
            match: artist.match
        }));

        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get similar artists' });
    }
});

/**
 * @route   GET /lastfm/similar-tracks
 * @description Returns up to 10 tracks similar to the given track using the Last.fm API.
 *
 * @queryparam {string} track  - (Required) The track name to find similar tracks for.
 * @queryparam {string} artist - (Required) The artist name of the track.
 *
 * @returns {Array<{name: string, artist: string, match: string}>} 200 - List of similar tracks with match score.
 * @returns {Object} 400 - Error if `track` or `artist` query parameters are missing.
 * @returns {Object} 500 - Error if the Last.fm API request fails.
 */
router.get("/similar-tracks", async (req, res) => {
    const { track, artist } = req.query;

    if (!track || !artist) {
        return res.status(400).json({ error: 'track and artist query parameters are required' });
    }

    try {
        const params = {
            method: 'track.getSimilar',
            track,
            artist,
            limit: 10,
            api_key: LASTFM_API_KEY,
            format: 'json'
        };

        const { data } = await axios.get(LASTFM_BASE_URL, { params });

        const tracks = (data.similartracks?.track || []).map((track,index) => ({
            rank: index + 1,
            name: track.name,
            artist: track.artist.name,
            match: track.match
        }));

        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get similar tracks' });
    }
});



export default router;