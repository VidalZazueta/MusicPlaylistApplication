import mongoose from 'mongoose';

/**
 * track subdocument schema
 * represents a single track entry inside a playlist
 */
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
 * playlist schema
 * represents a music playlist containing multiple tracks
 */
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
