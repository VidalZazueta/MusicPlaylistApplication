import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlaylists } from "../../services/playlistService";
import PlaylistList from "../../components/PlaylistList/PlaylistList";
import SearchBar from "../../components/SearchBar/SearchBar";


const API_BASE = "http://localhost:8888";

function DashboardPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

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
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link> 
          </nav>
      </header>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <PlaylistList playlists={filteredPlaylists}/>
    </div>
  );
}

export default DashboardPage;
