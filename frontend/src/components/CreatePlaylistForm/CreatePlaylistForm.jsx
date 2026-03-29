import { useState } from "react";
import "./CreatePlaylistForm.css";

/**
 * Controlled form for creating a new playlist.
 *
 * This component does not call the API directly — it validates the title input
 * and delegates the actual creation to the `onCreate` callback provided by the parent.
 * Shows a loading state while the parent's async operation is in progress.
 *
 * @param {Object} props
 * @param {function(string): Promise<void>} props.onCreate - Async callback invoked with the playlist title on submit.
 * @returns {JSX.Element} The create playlist form.
 */
function CreatePlaylistForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission. Validates that the title is not blank, then calls
   * `onCreate` with the trimmed title. Manages loading state around the async call.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Playlist title is required");
      return;
    }

    try {
      setLoading(true);
      await onCreate(title);
      setTitle("");
    } catch (error) { // Catch for debugging purposes
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-playlist-form">
      {error && <p className="create-playlist-form-error">{error}</p>}

      <input
        type="text"
        placeholder="New playlist title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Playlist"}
      </button>
    </form>
  );
}

export default CreatePlaylistForm;
