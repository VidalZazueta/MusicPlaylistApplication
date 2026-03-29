/**
 * Controlled text input for filtering playlists by name.
 *
 * This component is stateless — the parent owns the search term state and
 * passes it down via props.
 *
 * @param {Object} props
 * @param {string} props.value - The current search term.
 * @param {function(string): void} props.onChange - Callback invoked with the new value on each keystroke.
 * @returns {JSX.Element} A styled text input element.
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
