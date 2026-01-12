/*
Services so the pages in the front end dont know the URLs or HTTP details
We create our function to get the data, so when the pages request the data,
they only send a request to get the data and don't know the process

Current Architecture
**Layer** **Responsibility**
Page : State + rendering
Service: HTTP + backend
Backend: Data + rules
*/

// URL parameter to insert in other services
const API_BASE = 'http://localhost:8888';

// Get the token stored locally
function getToken() {
    return localStorage.getItem("token");
}

/**
 * Return the playlist data in a JSON format
 */
export async function getPlaylists() {
    const token = getToken();

    if(!token) {
        throw new Error("Not logged in. Please log in");
    }

    const response = await fetch(`${API_BASE}/playlists`, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}` // JWT
        }
    });

    // Check if response is successful
    if(!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Failed to fetch playlists: ${response.status}`);
    }

    return response.json();

}