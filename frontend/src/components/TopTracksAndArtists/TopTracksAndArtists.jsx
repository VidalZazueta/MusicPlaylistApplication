import { useState, useEffect } from "react";
import { getTopTracks, getTopArtists } from "../../services/lastFmService";
import "./TopTracksAndArtists.css"

const TABS = {
    TRACKS: "Top Tracks",
    ARTISTS: "Top Artists"
};

function TopTracksAndArtists() {
    const [activeTab, setActiveTab] = useState(TABS.TRACKS);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

    const items = activeTab === TABS.TRACKS ? topTracks : topArtists;

    if (loading) return <div className="card-container"><p className="tab-empty">Loading...</p></div>;

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

            {error ? (
                <p className="tab-empty">{error}</p>
            ) : (
                <ul className="tab-list">
                    {items.map((item) => (
                        <li key={item.rank} className="tab-list-item">
                            <span className="tab-list-rank">{item.rank}.</span>
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