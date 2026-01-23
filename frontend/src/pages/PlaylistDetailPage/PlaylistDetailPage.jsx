import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../../services/playlistService";

function PlaylistDetailPage() {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
