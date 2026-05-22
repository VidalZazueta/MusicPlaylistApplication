import PlaylistCard from "../PlaylistCard/PlaylistCard";
import "./PlaylistList.css";

/**
 * Renders a list of playlists using {@link PlaylistCard} for each item.
 *
 * Contains no business logic — all data and actions are passed in via props.
 * Renders a fallback message when the list is empty or not provided.
 *
 * @param {Object} props
 * @param {Array<Object>} props.playlists - Array of playlist objects to display.
 * @param {function(string): void} props.onDelete - Callback forwarded to each PlaylistCard, invoked with the playlist ID.
 * @returns {JSX.Element} An unordered list of PlaylistCard components, or a "No playlists found" message.
 */
function PlaylistList({ playlists, onDelete }) {

    if(!playlists || playlists.length === 0) {
        return <p>No playlists found</p>
    }

    return (
        <ul className = "playlist-list">
            {playlists.map((playlist) => (
                <PlaylistCard
                    key={playlist._id}
                    playlist={playlist}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

export default PlaylistList;
