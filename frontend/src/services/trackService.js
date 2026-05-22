const API_BASE = 'http://localhost:8888';

function getToken() {
    return localStorage.getItem("token");
}

export async function searchTracks(query) {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE}/tracks/search?track=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to search tracks");
    return response.json();
}

export async function getTrackByMbid(mbid) {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE}/tracks/${encodeURIComponent(mbid)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to get track details");
    return response.json();
}
