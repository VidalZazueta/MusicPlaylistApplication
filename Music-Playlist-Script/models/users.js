import mongoose from "mongoose";

/**
 * User Schema
 * 
 */

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        registrationDate: {
            type: Date,
            default: () => Date.now(),
        },
        playlists: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Playlist',
            }

        ]
    },

    {
        timestamps: true,
    }

);

const User = mongoose.model('User', UserSchema);
export default User;