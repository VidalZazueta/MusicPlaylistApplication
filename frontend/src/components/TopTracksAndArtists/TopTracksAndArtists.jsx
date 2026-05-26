import { useState, useEffect } from "react";
import { getTopTracks, getTopArtists } from "../../services/lastFmService";
import "./TopTracksAndArtists.css"

// Tab labels used as keys and display text throughout the component.
const TABS = {
    TRACKS: "Top Tracks",
    ARTISTS: "Top Artists"
};

/**
 * Displays a tabbed card showing the top 10 globally charting tracks
 * and artists fetched from the Last.fm API on mount.
 *
 * Data is fetched once and never re-fetched since global charts don't
 * depend on any user-specific state or props.
 *
 * @returns {JSX.Element}
 */
function TopTracksAndArtists() {
    const [activeTab, setActiveTab] = useState(TABS.TRACKS);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);

    // Initialized as true because a fetch is always in progress on first render.
    // Only set to false inside async callbacks, avoiding synchronous setState in the effect.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches the global top tracks and top artists from the Last.fm API
     * simultaneously on mount. The empty dependency array ensures this
     * runs only once for the lifetime of the component.
     */
    useEffect(() => {
        // Fire both requests in parallel and wait for both to resolve.
        Promise.all([getTopTracks(), getTopArtists()])
            .then(([tracks, artists]) => {
                setTopTracks(tracks);
                setTopArtists(artists);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load top tracks and artists");
                setLoading(false);
            });
    }, []);

    // Pick the active list based on which tab is selected.
    const items = activeTab === TABS.TRACKS ? topTracks : topArtists;

    if (loading) return <div className="card-container"><p className="tab-empty">Loading...</p></div>;

    return (
        <div className="card-container">
            {/* Tab buttons to switch between Top Tracks and Top Artists */}
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

            {/* Show error or the ranked list */}
            {error ? (
                <p className="tab-empty">{error}</p>
            ) : (
                <ul className="tab-list">
                    {items.map((item) => (
                        <li key={item.rank} className="tab-list-item">
                            <span className="tab-list-rank">{item.rank}.</span>
                            {/* Tracks include the artist name; artists only have a name */}
                            {activeTab === TABS.TRACKS
                                ? `${item.name} — ${item.artist || ""}`
                                : item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TopTracksAndArtists;