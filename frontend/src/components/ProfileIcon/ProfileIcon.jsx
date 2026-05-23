import { useState } from "react";
import "./ProfileIcon.css";

/**
 * Circular profile icon that toggles a dropdown menu on click.
 *
 * @param {Object} props
 * @param {function(): void} props.onLogout - Callback invoked when the user clicks Logout.
 * @returns {JSX.Element} A circular avatar button with a dropdown containing a logout option.
 */
function ProfileIcon({ onLogout }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="profile-icon-container">
            <button
                className="profile-icon-button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Profile menu"
            >
                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
            </button>

            {open && (
                <div className="profile-icon-dropdown">
                    <button onClick={() => { setOpen(false); onLogout(); }}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileIcon;