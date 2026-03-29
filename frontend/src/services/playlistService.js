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

/**
 * @returns Return the token stored locally
 */
function getToken() {
    return localStorage.getItem("token");
}

/**
 * @description Remove the token from local storage, effectively logging the user out
 */
function removeToken() {
    localStorage.removeItem("token");
}

/**
 * Fetches all playlists belonging to the authenticated user.
 *
 * Reads the JWT from localStorage and sends it as a Bearer token. Throws if
 * the user is not logged in, the session has expired (401), or the request fails.
 *
 * @async
 * @returns {Promise<Array<Object>>} Resolves to the array of playlist objects returned by the API.
 * @throws {Error} If not authenticated, session expired, or the fetch fails.
 */
export async function getPlaylists() {
    const token = getToken();

    if(!token) {
        throw new Error("Not logged in. Please log in");
    }

    const response = await fetch(`${API_BASE}/playlists`, {
        headers: {
            Authorization: `Bearer ${token}` // JWT
        }
    });

    if(response.status === 401) {
        removeToken();
        throw new Error("Session expired. Please log in again")
    }

    // Check if response is successful
    if(!response.ok) {
        throw new Error(`Failed to fetch playlists: ${response.status}`);
    }

    return response.json();

}

/**
 * Creates a new playlist with the given title for the authenticated user.
 *
 * Sends an authenticated POST request to `/playlists`. Throws if the user
 * is unauthenticated, the session has expired (401), or the request fails.
 *
 * @async
 * @param {string} title - The title for the new playlist.
 * @returns {Promise<Object>} Resolves to the newly created playlist object.
 * @throws {Error} If not authenticated, session expired, or creation fails.
 */
export async function createPlaylist(title) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("http://localhost:8888/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create playlist");
  }

  return response.json();
}

/**
 * Deletes a playlist by its ID.
 *
 * Sends an authenticated DELETE request to `/playlists/:playlistId`. Throws if
 * the user is unauthenticated, the session has expired (401), or deletion fails.
 *
 * @async
 * @param {string} playlistId - The `_id` of the playlist to delete.
 * @returns {Promise<Object>} Resolves to the JSON response from the server.
 * @throws {Error} If not authenticated, session expired, or deletion fails.
 */
export async function deletePlaylist(playlistId) {
  const token = getToken();

  if(!token) {
    throw new Error("Not Authenticated");
  }

  const response = await fetch ( 
    `http://localhost:8888/playlists/${playlistId}` ,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if(response.status === 401) {
    removeToken();
    throw new Error("Session expired. Please log in again");
  }

  if(!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete playlist");
  }

  return response.json();

}

/**
 * Fetches a single playlist by its ID.
 *
 * Sends an authenticated GET request to `/playlists/:id`. Throws if the user
 * is unauthenticated, the session has expired (401), or the playlist is not found.
 *
 * @async
 * @param {string} id - The `_id` of the playlist to retrieve.
 * @returns {Promise<Object>} Resolves to the playlist object returned by the API.
 * @throws {Error} If not authenticated, session expired, or the playlist is not found.
 */
export async function getPlaylistById(id) {
  const token = getToken();

  if(!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `http://localhost:8888/playlists/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if(response.status === 401) {
    removeToken();
    throw new Error("Session expired");
  }

  if(!response.ok) {
    throw new Error("Playlist not found");
  }

  return response.json();
}