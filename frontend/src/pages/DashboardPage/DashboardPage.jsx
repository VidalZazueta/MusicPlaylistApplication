import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlaylists } from "../../services/playlistService";
import { logout } from "../../services/authService";
import PlaylistList from "../../components/PlaylistList/PlaylistList";
import SearchBar from "../../components/SearchBar/SearchBar";
import { createPlaylist } from "../../services/playlistService";
import CreatePlaylistForm from "../../components/CreatePlaylistForm/CreatePlaylistForm";



const API_BASE = "http://localhost:8888";

function DashboardPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle the user logging out
  const handleLogout = () => {
    //Calls the imported void function from authService
    logout();
    navigate("/login");
  }

  const handleCreatePlaylist = async (title) => {
    try {
      const newPlaylist = await createPlaylist(title);

      // Optimistic update (instant UI update)
      setPlaylists((prev) => [...prev, newPlaylist]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
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

      <CreatePlaylistForm onCreate={handleCreatePlaylist}/>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <PlaylistList playlists={filteredPlaylists}/>
    </div>
  );
}

export default DashboardPage;
