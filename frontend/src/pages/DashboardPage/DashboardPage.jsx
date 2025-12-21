import { useEffect, useState } from "react";

function DashboardPage() {

    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchPlaylists = async () => {
            try {
                const response = await fetch("/api/playlists");

                if(!response.ok) {
                    throw new Error("Failed to fetch playlists");
                }

                const data = await response.json();
                setPlaylists(data);
            } catch(error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();

    }, []);

    if(loading) {
        return <h2>Loading playlists...</h2>;
    }

    if (error) {
        return <h2>Error: {error}</h2>
    }


    return (
        <div>
            <h1> Dashboard</h1>

            <p>Playlists returned from backend:</p>

            <ul>
                {playlists.map((playlist) => (
                    <li key={playlist._id || playlist.id}>
                        {playlist.title}
                    </li>

                ))}
            </ul>
        </div>
    );
}


export default DashboardPage;