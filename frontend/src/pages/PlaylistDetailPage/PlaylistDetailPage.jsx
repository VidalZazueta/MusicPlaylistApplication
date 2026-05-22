import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById, addTrackToPlaylist } from "../../services/playlistService";
import { searchTracks, getTrackByMbid } from "../../services/trackService";
import "./PlaylistDetailPage.css";

function PlaylistDetailPage() {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [addingMbid, setAddingMbid] = useState(null);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const results = await searchTracks(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddTrack = async (result) => {
    setAddingMbid(result.mbid);

    try {
      const fullTrack = await getTrackByMbid(result.mbid);
      const updatedPlaylist = await addTrackToPlaylist(id, fullTrack);
      setPlaylist(updatedPlaylist);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setAddingMbid(null);
    }
  };

  if (loading) return <h2>Loading playlist...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="playlist-detail-container">
      <h1>{playlist.title}</h1>

      <h3>Tracks</h3>
      {playlist.tracks.length === 0 ? (
        <p>No tracks yet</p>
      ) : (
        <ul>
          {playlist.tracks.map((track, index) => (
            <li key={index}>{track.name} — {track.artist}</li>
          ))}
        </ul>
      )}

      <h3>Add a Track</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a track..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {searchError && <p>{searchError}</p>}

      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result) => (
            <li key={result.mbid}>
              {result.track} — {result.artist}
              <button
                onClick={() => handleAddTrack(result)}
                disabled={addingMbid === result.mbid}
              >
                {addingMbid === result.mbid ? "Adding..." : "Add"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaylistDetailPage;