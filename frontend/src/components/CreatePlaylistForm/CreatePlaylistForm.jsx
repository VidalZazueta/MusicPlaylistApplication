import { useState } from "react";

/**
 * @description - Simple controlled form to create a playlist
 * @param {Command} onCreate - Creates a playlist on user input
 * @Note - This component does not call the API, It emits intent upward
 */
function CreatePlaylistForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Playlist title is required");
      return;
    }

    onCreate(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="New playlist title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button type="submit">Create Playlist</button>
    </form>
  );
}

export default CreatePlaylistForm;
