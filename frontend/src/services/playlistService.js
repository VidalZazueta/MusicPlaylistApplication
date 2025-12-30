/*
Services so the pages in the front end dont know the URLs or HTTP details
We create our function to get the data, so when the pages request the data,
they only send a request to get the data and don't know the process
*/

// URL parameter to insert in other services
const API_BASE = 'http://localhost:8888';

/**
 * Return the playlist data in a JSON format
 */
export async function getPlaylists() {

    const response = await fetch(`${API_BASE}/playlists`);

    // Check if response is successful
    if(!response.ok) {
        throw new Error(`Failed to fetch playlists: ${response.status}`);
    }

    return response.json();

}