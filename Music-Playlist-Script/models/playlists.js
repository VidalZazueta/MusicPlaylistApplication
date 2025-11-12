import mongoose from 'mongoose';

/**
 * Playlist sub-document schema
 * Represents a playlist within a user's collection
 * 
 */

const TrackSchema = new mongoose.Schema({
    track: {
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
    mbid: {
        type: String,
        required: true,
        unique: false,
    },
    image : {
        type: String,
        required: false,
    }

});

/**
 *  Playlist Schema
 * Represents a user's playlist containing multiple tracks
 */
const PlaylistSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            lowercase: true,
            required: true,
            trim: true,
        },
        
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        tracks: {
            type: [TrackSchema],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist;

