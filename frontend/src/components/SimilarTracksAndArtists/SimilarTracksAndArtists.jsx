import { useState, useEffect, useMemo } from "react";
import { getSimilarArtists, getSimilarTracks } from "../../services/lastFmService";
import "./SimilarTracksAndArtists.css";

const TABS = {
    TRACKS: "Similar Tracks",
    ARTISTS: "Similar Artists",
};

// Returns the most frequently occurring artist across all playlist tracks.
function getMostFrequentArtist(playlists) {
    const counts = {};
    for (const playlist of playlists) {
        for (const track of playlist.tracks) {
            counts[track.artist] = (counts[track.artist] || 0) + 1;
        }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function SimilarTracksAndArtists({ playlists = [] }) {
    const [activeTab, setActiveTab] = useState(TABS.TRACKS);
    const [similarTracks, setSimilarTracks] = useState([]);
    const [similarArtists, setSimilarArtists] = useState([]);
    const [fetchedFor, setFetchedFor] = useState(null);
    const [error, setError] = useState(null);

    const seedArtist = useMemo(() => getMostFrequentArtist(playlists), [playlists]);

    // Derived: loading when a seed exists but we haven't finished fetching for it yet
    const loading = !!seedArtist && fetchedFor !== seedArtist && !error;

    useEffect(() => {
        if (!seedArtist) return;

        const allTracks = playlists.flatMap((p) => p.tracks);
        const seedTrack = allTracks.find((t) => t.artist === seedArtist);

        Promise.all([
            getSimilarArtists(seedArtist),
            seedTrack ? getSimilarTracks(seedTrack.name, seedArtist) : Promise.resolve([]),
        ])
            .then(([artists, tracks]) => {
                setSimilarArtists(artists);
                setSimilarTracks(tracks);
                setError(null);
                setFetchedFor(seedArtist);
            })
            .catch(() => {
                setError("Failed to load recommendations");
                setFetchedFor(seedArtist);
            });
    }, [seedArtist, playlists]);

    const items = activeTab === TABS.TRACKS ? similarTracks : similarArtists;

    if (loading) return <div className="card-container"><p className="tab-empty">Loading recommendations...</p></div>;

    return (
        <div className="card-container">
            <div className="tab-header">
                {Object.values(TABS).map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? "tab-button--active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {seedArtist && <p className="tab-seed">Based on: <strong>{seedArtist}</strong></p>}

            {error ? (
                <p className="tab-empty">{error}</p>
            ) : (
                <ul className="tab-list">
                    {items.length === 0 ? (
                        <p className="tab-empty">
                            {playlists.flatMap((p) => p.tracks).length === 0
                                ? "Add tracks to your playlists to get recommendations."
                                : `No ${activeTab.toLowerCase()} to show.`}
                        </p>
                    ) : (
                        items.map((item) => (
                            <li key={item.rank} className="tab-list-item">
                                <span className="tab-list-rank">{item.rank}.</span>
                                {activeTab === TABS.TRACKS
                                    ? `${item.name} — ${item.artist}`
                                    : item.name}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default SimilarTracksAndArtists;