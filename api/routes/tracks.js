import axios from 'axios';
import express from 'express';

const router = express.Router();

// Getting the API key from environment variables and the url to make the API calls
const API_KEY = process.env.API_KEY;
const API_URL = 'http://ws.audioscrobbler.com/2.0/';

/** 
 @route GET /tracks/search
 @desc Search for a track by name using the Last.fm API
 @queryparam {string} name (required) search API for a track by name
 @queryparam {string} fuzzy (optional) fuzzy search using *
 @returns {Object} JSON response from Last.fm API returning a track with a mbid
* */
router.get('/search', async (req, res) => {

    let { track, fuzzy } = req.query;

    if(!track) {
        return res.status(400).json({ error: 'Missing query parameter: track' });
    }

    //Check if fuzzy search is requested or not
    // Lowercase the string and compare to true, anything else is false
    //This way we can handle different types of the input 'true'
    const isFuzzy = String(fuzzy).toLowerCase() === 'true';

    //If fuzzy search is requested, add * to the beginning and end of the name
    if(isFuzzy) {
        track = `${track}*`;
    }   

    //Try catch block to handle errors
    try {

        // Define the parameters for the API call
        const params = {
            method: 'track.search',
            track: track,
            api_key: API_KEY,
            format: 'json',
        };

        //Get the data from the API using axios
        const { data } = await axios.get(API_URL, { params });


        // Get the relevant data from the response
        const minimal = data.results.trackmatches.track.map(t => ({
            name: t.name,
            artist: t.artist,
            mbid: t.mbid,
            url: t.url,
        }));

        // Filter out tracks without a valid mbid
        const validTracks = minimal.filter(track => track.mbid && track.mbid !== '');


        res.json({ tracks: validTracks });
    
    } catch (error) {
        console.error('Error searching for track:', error);
        res.status(500).json({ error: 'An error occurred while searching for the track.' });
    }
});

/**
 * @route GET /tracks/:mbid
 * @description Get detailed information about a track usings its mbid
 * @param {string} mbid (required) The MusicBrainz ID of the track
 * @returns {Object} JSON response from Last.fm API returning detailed track information
 * @test Test with the following url in postman: http://localhost:8888/tracks/b1a9c0e9-d987-4042-ae91-78d6a3267d69
 */

router.get("/:mbid", async (req, res) => {
    const { mbid } = req.params;

    // Check if the API call has the required parameter
    if (!mbid) {
        return res.status(400).json({ error: "Missing parameter: mbid" });
    }

    try {

        // Define the parameters for the API call
        const params = { 
            method: 'track.getInfo',
            mbid: mbid,
            api_key: API_KEY,
            format: 'json',
        };

        const { data } = await axios.get(API_URL, { params });
        
        const metadata = data.track;

        // Check if we get a track with a given mbid
        if(!metadata) {
            return res.status(404).json({ error: 'Track not found with given mbid' });
        }
        
        // Get the following metadata of the track
        const minimal = {
            name: metadata.name,
            artist: metadata.artist,
            album: metadata.album,
            duration: metadata.duration,
            listeners: metadata.listeners,
            playcount: metadata.playcount,
            url: metadata.url,
            mbid: metadata.mbid,
        };

        res.json(minimal);

    } catch (error) {
        console.error('Error fetching track metadata:', error);
        res.status(500).json({ error: 'An error occurred while fetching track metadata.', details: error.message });
    }

});


export default router;