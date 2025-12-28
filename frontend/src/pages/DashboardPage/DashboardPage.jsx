import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:8888";

function DashboardPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`${API_BASE}/playlists`);

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        setPlaylists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return <h2>Loading playlists...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "1rem"}}>
        <h1>DashBoard</h1>
          <nav style={{ display: "flex", gap: "1rem "}}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link> 
          </nav>
      </header>

      {playlists.length === 0 ?(
        <p>No playlist found</p>
      ) : (
        <ul>
          {playlists.map((p) => (
            <li key = {p._id}>{p.title}</li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default DashboardPage;
