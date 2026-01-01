import PlaylistCard from "../PlaylistList/PlaylistList";

/**
 * @description Display the playlist in a UI card, Handles no business logic as it accepts data via props
 * @params {playlists} - Playlist data passed as a prop
 * @returns Unordered bullet list of a playlist
 */
function PlaylistList({ playlists}) {

    if(!playlists || playlists.length === 0) {
        return <p>No playlists found</p>
    }

    return (
        <ul>
            {playlists.map((playlist) => (
                <PlaylistCard
                    key={playlist._id}
                    playlist={playlist}
                />
            ))}
        </ul>
    );
}

export default PlaylistList;