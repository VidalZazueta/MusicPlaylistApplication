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

        const { data } = await axios.get(LASTFM_BASE_URL, { params })

        const tracks = data.tracks.track.map((track,index) => ({
            rank: index + 1,
            name: track.name,
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

        const { data } = await axios.get(LASTFM_BASE_URL, { params });

        const artists = data.artists.artist.map((artist, index) => ({
            rank: index + 1,
            name: artist.name,
            playcount: artist.playcount,
            listeners: artist.listeners
        }));

        res.json(artists);
    } catch (error){
        res.status(500).json({error : "Failed to get the top artists"})
    }


})

export default router;