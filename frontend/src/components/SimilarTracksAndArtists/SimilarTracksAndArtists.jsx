import { useState, useEffect, useMemo } from "react";
import { getSimilarArtists, getSimilarTracks } from "../../services/lastFmService";
import "./SimilarTracksAndArtists.css";

// Tab labels used as keys and display text throughout the component.
const TABS = {
    TRACKS: "Similar Tracks",
    ARTISTS: "Similar Artists",
};

/**
 * Finds the artist that appears most frequently across all tracks in the user's playlists.
 * This artist is used as the seed for Last.fm similarity recommendations.
 *
 * @param {Array<{tracks: Array<{artist: string}>}>} playlists - The user's playlists.
 * @returns {string|null} The most frequent artist name, or null if there are no tracks.
 */
function getMostFrequentArtist(playlists) {
    const counts = {};

    for (const playlist of playlists) {
        for (const track of playlist.tracks) {
            counts[track.artist] = (counts[track.artist] || 0) + 1;
        }
    }

    // Sort descending by count and return the top artist name.
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

/**
 * Displays a tabbed card showing similar tracks and similar artists
 * personalized to the user's most-listened-to artist across their playlists.
 *
 * Recommendations are re-fetched automatically whenever the user's playlists change
 * and the most frequent artist shifts.
 *
 * @param {Object}  props
 * @param {Array}   props.playlists - The current user's playlists, passed down from DashboardPage.
 * @returns {JSX.Element}
 */
function SimilarTracksAndArtists({ playlists = [] }) {
    const [activeTab, setActiveTab] = useState(TABS.TRACKS);
    const [similarTracks, setSimilarTracks] = useState([]);
    const [similarArtists, setSimilarArtists] = useState([]);

    // Tracks which artist the current data was fetched for.
    // When seedArtist !== fetchedFor, a new fetch is in progress.
    const [fetchedFor, setFetchedFor] = useState(null);
    const [error, setError] = useState(null);

    // Re-compute the seed artist only when playlists change, not on every render.
    const seedArtist = useMemo(() => getMostFrequentArtist(playlists), [playlists]);

    // Derived loading state: true when there is a seed artist but the fetch
    // for that artist hasn't completed yet. Avoids calling setState synchronously
    // inside the effect, which would cause cascading renders.
    const loading = !!seedArtist && fetchedFor !== seedArtist && !error;

    /**
     * Fetches similar artists and tracks from the Last.fm API whenever the
     * seed artist changes. Both requests run in parallel via Promise.all.
     *
     * - If a seed track by the seed artist exists in the user's playlists, it
     *   is used to seed track.getSimilar for more relevant results.
     * - setFetchedFor is called in both .then() and .catch() to ensure the
     *   loading state always clears, regardless of success or failure.
     */
    useEffect(() => {
        // Nothing to fetch if the user has no tracks in their playlists.
        if (!seedArtist) return;

        // Find a track by the seed artist to use as the track seed.
        const allTracks = playlists.flatMap((p) => p.tracks);
        const seedTrack = allTracks.find((t) => t.artist === seedArtist);

        // Fire both API calls simultaneously and wait for both to resolve.
        Promise.all([
            getSimilarArtists(seedArtist),
            seedTrack ? getSimilarTracks(seedTrack.name, seedArtist) : Promise.resolve([]),
        ])
            .then(([artists, tracks]) => {
                setSimilarArtists(artists);
                setSimilarTracks(tracks);
                setError(null);
                // Mark fetch as complete for this artist so loading clears.
                setFetchedFor(seedArtist);
            })
            .catch(() => {
                setError("Failed to load recommendations");
                // Still mark fetchedFor so the loading spinner doesn't hang.
                setFetchedFor(seedArtist);
            });
    }, [seedArtist, playlists]);

    // Pick the active list based on which tab is selected.
    const items = activeTab === TABS.TRACKS ? similarTracks : similarArtists;

    if (loading) return <div className="card-container"><p className="tab-empty">Loading recommendations...</p></div>;

    return (
        <div className="card-container">
            {/* Tab buttons to switch between Similar Tracks and Similar Artists */}
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

            {/* Show which artist the recommendations are based on */}
            {seedArtist && <p className="tab-seed">Based on: <strong>{seedArtist}</strong></p>}

            {/* Show error, empty state, or the list of recommendations */}
            {error ? (
                <p className="tab-empty">{error}</p>
            ) : items.length === 0 ? (
                <p className="tab-empty">
                    {playlists.flatMap((p) => p.tracks).length === 0
                        ? "Add tracks to your playlists to get recommendations."
                        : `No ${activeTab.toLowerCase()} to show.`}
                </p>
            ) : (
                <>
                    <div className="tab-metrics-header">
                        <span>#</span>
                        <span>{activeTab === TABS.TRACKS ? "Title" : "Artist"}</span>
                        {activeTab === TABS.TRACKS ? (
                            <>
                                <span>Playcount</span>
                                <span>Duration</span>
                            </>
                        ) : (
                            <span>Match</span>
                        )}
                    </div>
                    <ul className="tab-list">
                        {items.map((item) => (
                            <li key={item.rank} className={`tab-list-item ${activeTab === TABS.TRACKS ? "tab-list-item--track" : "tab-list-item--artist"}`}>
                                <span className="tab-list-rank">{item.rank}</span>
                                {activeTab === TABS.TRACKS ? (
                                    <>
                                        <div className="tab-track-info">
                                            <span className="tab-track-name">{item.name}</span>
                                            <span className="tab-track-artist">{item.artist}</span>
                                        </div>
                                        <span>{Number(item.playcount).toLocaleString()}</span>
                                        <span>{item.duration}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{item.name}</span>
                                        <span>{Number(item.match * 100).toFixed(0)}%</span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default SimilarTracksAndArtists;