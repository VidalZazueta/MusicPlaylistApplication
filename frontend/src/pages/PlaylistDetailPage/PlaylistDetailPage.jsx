import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../../services/playlistService";

/**
 * Page component that displays the details of a single playlist.
 *
 * Reads the playlist `id` from the URL params, fetches the playlist on mount,
 * and renders its title and track list. Shows loading and error states as needed.
 *
 * @returns {JSX.Element} The playlist detail view, or a loading/error state.
 */
function PlaylistDetailPage() {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the playlist by ID from the backend and stores it in state.
     * Re-runs whenever the `id` URL param changes.
     *
     * @async
     * @returns {Promise<void>}
     */
    const loadPlaylist = async () => {
      try {
        const data = await getPlaylistById(id);
        setPlaylist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  if (loading) return <h2>Loading playlist...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{playlist.title}</h1>

      <h3>Tracks</h3>
      {playlist.tracks.length === 0 ? (
        <p>No tracks yet</p>
      ) : (
        <ul>
          {playlist.tracks.map((track, index) => (
            <li key={index}>{track.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaylistDetailPage;
