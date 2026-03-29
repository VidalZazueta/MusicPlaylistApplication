import mongoose from 'mongoose';

/**
 * @typedef {Object} Track
 * @property {string}  mbid   - The MusicBrainz ID, or a fallback `'artist|trackName'` string when no mbid is available.
 * @property {string}  name   - The track title.
 * @property {string}  artist - The artist name.
 * @property {string}  album  - The album title.
 * @property {string}  [image] - URL of the album art image (optional).
 */

/** Mongoose subdocument schema representing a single track entry inside a playlist. */
const TrackSchema = new mongoose.Schema({
    mbid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

/**
 * @typedef {Object} Playlist
 * @property {mongoose.Types.ObjectId} user_id - Reference to the owning {@link User} document.
 * @property {string}   title   - The playlist title (required, stored in lowercase).
 * @property {Track[]}  tracks  - Array of track subdocuments; defaults to an empty array.
 */

/** Mongoose schema representing a music playlist containing multiple tracks. */
const PlaylistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'title is required']
    },
    tracks: {
        type: [TrackSchema],
        default: []
    }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;
