import { Link } from "react-router-dom";

/**
 * @description Render one playlist with no data fetching
 * @returns A list item - playlist
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