/**
 * @description Render one playlist with no data fetching
 * @returns A list item - playlist
 */
function PlaylistCard ({ playlist }) {
    return (
        <li>
            {playlist.title}
        </li>
    )
}

export default PlaylistCard;