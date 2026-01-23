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

function removeToken() {
    localStorage.removeItem("token");
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
 * @description Create a playlist with a specified title
 * @param {String} title - The name of the title for the playlist
 * @returns 
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
 * @description - Deletes a playlist
 * @param {*} playlistId - the specific ID of the playlist
 * @returns {Object} json response 
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