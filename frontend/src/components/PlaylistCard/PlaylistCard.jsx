import { Link } from "react-router-dom";
import "./PlaylistCard.css";

/**
 * Renders a single playlist as a list item with a link to its detail page, a delete button,
 * and an inline list of track sub-cards.
 *
 * This component contains no business logic — all data and actions are passed in via props.
 *
 * @param {Object} props
 * @param {Object} props.playlist - The playlist object to display.
 * @param {string} props.playlist._id - The unique identifier used for routing and deletion.
 * @param {string} props.playlist.title - The display name of the playlist.
 * @param {Array<Object>} props.playlist.tracks - Array of track objects belonging to the playlist.
 * @param {string} props.playlist.tracks[].name - The track title.
 * @param {string} props.playlist.tracks[].artist - The artist name.
 * @param {function(string): void} props.onDelete - Callback invoked with the playlist ID when Delete is clicked.
 * @returns {JSX.Element} A `<li>` element containing the playlist header and track sub-cards.
 */
function PlaylistCard ({ playlist, onDelete }) {
    return (
        <li className="playlist-card">
            <div className="playlist-card-header">
                <Link to={`/playlists/${playlist._id}`}>
                    {playlist.title}
                </Link>
                <button
                    onClick={() => onDelete(playlist._id)}
                    className="playlist-card-delete">
                    Delete
                </button>
            </div>

            
            <div className="playlist-metrics">
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <span>Date Added</span>
                <span>Length</span>
            </div>

            {playlist.tracks && playlist.tracks.length > 0 && (
                <ul className="playlist-card-tracks">
                    {playlist.tracks.map((track, index) => (
                        <li key={index} className="track-card">
                            <span className="track-name">{track.name}</span>
                            <span className="track-artist">{track.artist}</span>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

export default PlaylistCard;
