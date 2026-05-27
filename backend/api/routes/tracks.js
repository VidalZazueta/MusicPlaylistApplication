import axios from 'axios';
import express from 'express';
import { secondsToMinutesFormatted, millisecondsToMinutesFormatted } from '../util/utilities.js';

const router = express.Router();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Replaces spaces in a string with '+' characters for use in URL query parameters.
 *
 * @param {string} str - The input string to format.
 * @returns {string} The formatted string with spaces replaced by '+'.
 * @example
 * _plusjoin('arctic monkeys'); // 'arctic+monkeys'
 */
const _plusjoin = (str) => {
    return str.split(' ').join('+');
};
/**
 * @route   GET /tracks/search
 * @description Searches for music tracks using the Last.fm API and returns a minimal result set.
 * @access  Protected — requires `Authorization` header with a valid user ID.
 *
 * @queryparam {string}  track         - (Required) The name of the track to search for.
 * @queryparam {boolean} [fuzzy=false] - (Optional) When `true`, appends a wildcard `*` to broaden the search.
 *
 * @returns {Array<{artist: string, track: string, mbid: string}>} 200 - Array of minimal track objects.
 * @returns {Object} 400 - Error if the `track` query parameter is missing.
 * @returns {Object} 401 - Error if the Authorization header is absent.
 * @returns {Object} 500 - Error if the Last.fm API request fails.
 */
router.get('/search', async (req, res) => {
    const { track, fuzzy } = req.query;

    // optional (we could allow without Authorization)
    const userId = req.headers.authorization;
    if (!userId) {
        return res.status(401).json({ error: 'Authorization header not preset' });
    }

    if (!track) {
        return res.status(400).json({ error: 'Track query parameter is required.' });
    }

    try {
        const formatted = _plusjoin(track);
        const search = fuzzy === 'true' ? `${formatted}*` : formatted;

        const params = {
            method: 'track.search',
            track: search,
            api_key: LASTFM_API_KEY,
            format: 'json'
        };
        const { data } = await axios.get(LASTFM_BASE_URL, { params });

        const results = data?.results?.trackmatches?.track || [];

        const minimal = results.map((t) => {
            return {
                artist: t.artist,
                track: t.name,
                mbid: t.mbid || `${_plusjoin(t.artist)}|${_plusjoin(t.name)}` // optional fallback for a missing mbid
            };
        });

        res.json(minimal);
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: 'Failed to search tracks via Last.fm API' });
    }
});

/**
 * @route   GET /tracks/:mbid
 * @description Retrieves detailed information for a single track from the Last.fm API.
 * @access  Protected — requires `Authorization` header with a valid user ID.
 *
 * @param   {string} mbid - A MusicBrainz ID (mbid) or a fallback string formatted as `'artist|track'`.
 *
 * @returns {{mbid: string, name: string, artist: string, album: string, image: string}} 200 - Sanitized track details.
 * @returns {Object} 401 - Error if the Authorization header is absent.
 * @returns {Object} 500 - Error if the Last.fm API request fails or the track is not found.
 */
router.get('/:mbid', async (req, res) => {
    const { mbid } = req.params;

    // optional (we could allow without Authorization)
    const userId = req.headers.authorization;
    if (!userId) {
        return res.status(401).json({ error: 'Authorization header not preset' });
    }

    try {
        const params = {
            method: 'track.getInfo',
            api_key: LASTFM_API_KEY,
            format: 'json'
        };

        // check if the mbid is the fallback format 'artist|track'
        if (mbid.includes('|')) {
            const [artist, track] = mbid.split('|');
            params.artist = artist;
            params.track = track;
        } else {
            // else assume it's a standard mbid
            params.mbid = mbid;
        }

        const { data } = await axios.get(LASTFM_BASE_URL, { params });

        const image = data.track.album?.image?.find((img) => img.size === 'extralarge');
        const minimal = {
            mbid,
            name: data.track.name,
            artist: data.track.artist.name,
            album: data.track.album?.title,
            image: image['#text'],
            duration: data.track.duration ? millisecondsToMinutesFormatted(data.track.duration) : '--'
        };

        res.json(minimal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get track info from Last.fm API' });
    }
});

export default router;
