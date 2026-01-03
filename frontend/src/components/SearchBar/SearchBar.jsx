/**
 * @description Controlled search input
 * @param {string} value - current search term
 * @param {Function} onChange - setter from parent
 */
function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search playlists..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "0.5rem",
        width: "100%",
        marginBottom: "1rem"
      }}
    />
  );
}

export default SearchBar;
