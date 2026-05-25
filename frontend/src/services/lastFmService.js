const API_BASE = 'http://localhost:8888';

/**
 * Fetches up to 10 artists similar to the given artist.
 *
 * @async
 * @param {string} artist - The artist name to seed the recommendation.
 * @returns {Promise<Array<{rank: number, name: string, match: string}>>}
 * @throws {Error} If the request fails.
 */
export async function getSimilarArtists(artist) {
    const response = await fetch(`${API_BASE}/lastfm/similar-artists?artist=${encodeURIComponent(artist)}`);
    if (!response.ok) throw new Error("Failed to get similar artists");
    return response.json();
}

/**
 * Fetches up to 10 tracks similar to the given track.
 *
 * @async
 * @param {string} track  - The track name to seed the recommendation.
 * @param {string} artist - The artist name of that track.
 * @returns {Promise<Array<{rank: number, name: string, artist: string, match: string}>>}
 * @throws {Error} If the request fails.
 */
export async function getSimilarTracks(track, artist) {
    const response = await fetch(`${API_BASE}/lastfm/similar-tracks?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`);
    if (!response.ok) throw new Error("Failed to get similar tracks");
    return response.json();
}

/**
 * 
 */
export async function getTopArtists() {
    const response = await fetch(`${API_BASE}/lastfm/top-artists`);

    if(!response.ok) throw new Error("Failed to get top artists");
    return response.json();

}

/**
 * 
 */
export async function getTopTracks() {
    const response = await fetch(`${API_BASE}/lastfm/top-tracks`);

    if(!response.ok) throw new Error("Failed to get top tracks");
    return response.json();
}