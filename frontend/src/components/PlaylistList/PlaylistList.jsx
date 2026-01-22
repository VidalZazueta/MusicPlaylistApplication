import PlaylistCard from "../PlaylistCard/PlaylistCard";

/**
 * @description Display the playlist in a UI card, Handles no business logic as it accepts data via props
 * @param {Object} playlist - Playlist data passed as a prop
 * @param {}
 * @returns Unordered bullet list of a playlist
 */
function PlaylistList({ playlists, onDelete }) {

    if(!playlists || playlists.length === 0) {
        return <p>No playlists found</p>
    }

    return (
        <ul>
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
