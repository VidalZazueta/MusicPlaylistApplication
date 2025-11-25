import mongoose from 'mongoose';

/**
 * user schema
 * represents a user account
 */
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
 * virtual field: playlists
 * populates the playlists that reference this user
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
