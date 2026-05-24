import { useState } from "react";
import "./SimilarTracksAndArtists.css";

const TABS = {
    TRACKS: "Similar Tracks",
    ARTISTS: "Similar Artists",
};

function SimilarTracksAndArtists() {
    const [activeTab, setActiveTab] = useState(TABS.TRACKS);

    const similarTracks = [];
    const similarArtists = [];

    const items = activeTab === TABS.TRACKS ? similarTracks : similarArtists;

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

            <ul className="tab-list">
                {items.length === 0 ? (
                    <p className="tab-empty">No {activeTab.toLowerCase()} to show.</p>
                ) : (
                    items.map((item, index) => (
                        <li key={index} className="tab-list-item">
                            {item.name}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default SimilarTracksAndArtists;