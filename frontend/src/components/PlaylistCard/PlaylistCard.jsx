import { Link } from "react-router-dom";

/**
 * Renders a single playlist as a list item with a link to its detail page and a delete button.
 *
 * This component contains no business logic — it only displays data passed via props
 * and delegates actions upward.
 *
 * @param {Object} props
 * @param {Object} props.playlist - The playlist object to display.
 * @param {string} props.playlist._id - The unique identifier used for routing and deletion.
 * @param {string} props.playlist.title - The display name of the playlist.
 * @param {function(string): void} props.onDelete - Callback invoked with the playlist ID when Delete is clicked.
 * @returns {JSX.Element} A `<li>` element containing the playlist link and delete button.
 */
function PlaylistCard ({ playlist, onDelete }) {
    return (
        <li style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to={`/playlists/${playlist._id}`}>
                {playlist.title}
            </Link>

            <button 
            onClick={() => onDelete(playlist._id)}
            style= {{ marginLeft: "1rem"}}>
                Delete
            </button>
        </li>
    )
}

export default PlaylistCard;