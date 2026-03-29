import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlaylists } from "../../services/playlistService";
import { logout } from "../../services/authService";
import PlaylistList from "../../components/PlaylistList/PlaylistList";
import SearchBar from "../../components/SearchBar/SearchBar";
import { createPlaylist, deletePlaylist } from "../../services/playlistService";
import CreatePlaylistForm from "../../components/CreatePlaylistForm/CreatePlaylistForm";



const API_BASE = "http://localhost:8888";

/**
 * Main dashboard page showing the user's playlists.
 *
 * Fetches all playlists on mount and provides controls to create, delete,
 * and search playlists. Also handles user logout.
 *
 * @returns {JSX.Element} The dashboard page UI, or a loading/error state.
 */
function DashboardPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /**
   * Logs the user out by clearing the stored token and redirecting to `/login`.
   */
  const handleLogout = () => {
    //Calls the imported void function from authService
    logout();
    navigate("/login");
  }

  /**
   * Calls the playlist service to create a new playlist and immediately appends
   * the returned playlist object to the local state so the UI updates without a refetch.
   *
   * @async
   * @param {string} title - The title for the new playlist.
   * @returns {Promise<void>}
   */
  const handleCreatePlaylist = async (title) => {
    try {

      //Clear previous errors
      setError(null);

      const newPlaylist = await createPlaylist(title);

      // Update UI immediately
      setPlaylists((prev) => [...prev, newPlaylist]);
    } catch (err) {
      setError(err.message || "Failed to create playlist");
    }
  };

  /**
   * Prompts the user for confirmation, then calls the playlist service to delete
   * the specified playlist. Removes it from local state on success.
   *
   * @async
   * @param {string} playlistId - The `_id` of the playlist to delete.
   * @returns {Promise<void>}
   */
  const handleDeletePlaylist = async (playlistId) => {
    //User confirmation to delete
    const confirmed = window.confirm("Are you sure you want to delete this playlist?");

    if(!confirmed) {
      return;
    }

    try {
      setError(null);

      await deletePlaylist(playlistId);

      setPlaylists((prev) =>
        prev.filter((playlist) => playlist._id !== playlistId)
      );

    } catch(error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    /**
     * Fetches all playlists for the authenticated user from the backend
     * and stores them in state. Runs once on component mount.
     *
     * @async
     * @returns {Promise<void>}
     */
    const loadPlaylists = async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  if (loading) {
    return <h2>Loading playlists...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  // filter the playlists based on the search bar input
  const filteredPlaylists = playlists.filter((playlist) =>
  playlist.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "1rem"}}>
        <h1>DashBoard</h1>

          <nav style={{ display: "flex", gap: "1rem "}}>
            <button onClick={handleLogout}>Logout</button>
          </nav>
      </header>

      
      {error && (<div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>)}

      <CreatePlaylistForm onCreate={handleCreatePlaylist}/>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <PlaylistList playlists={filteredPlaylists} onDelete={handleDeletePlaylist}/>
    </div>
  );
}

export default DashboardPage;
