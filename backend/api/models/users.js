import mongoose from 'mongoose';

/**
 * @typedef {Object} User
 * @property {string} username         - The user's unique login name (stored in lowercase).
 * @property {string} password         - The bcrypt-hashed password (never returned in API responses).
 * @property {number} [registrationDate] - Unix timestamp (ms) of when the account was created.
 * @property {Playlist[]} [playlists]  - Virtual field populated on demand; not stored in the document.
 */

/** Mongoose schema representing a registered user account. */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true, // ensures no two users can have the same username
        lowercase: true // converts input to lowercase before saving
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    registrationDate: {
        type: Number,
        default: () => Date.now(),
        required: false
    }
});

/**
 * Virtual field that populates all Playlist documents where `playlist.user_id` matches this user's `_id`.
 * Not stored in MongoDB — only included when `.populate('playlists')` is called on a query.
 */
UserSchema.virtual('playlists', {
    ref: 'Playlist', // referenced model
    localField: '_id', // matches user _id
    foreignField: 'user_id', // playlist field that stores user ref
    justOne: false // array of playlists associated to user
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema);

export default User;
