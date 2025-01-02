import mongoose, { Schema, Document, model } from "mongoose";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

// Define the user interface
export interface IUser extends Document {
    user_id: string; // uuid for user
    username: string;
    email: string;
    password: string;
    profile_picture?: string;
    favorite_movie?: FavoriteMovie[];
    isAdmin: boolean;
}

interface FavoriteMovie {
    movie: {
        movie_id: string;
        title: string;
        poster_path?: string;
        rate: Number;
    };
}

// Define the user schema
const userSchema: Schema<IUser> = new Schema({
    user_id: { type: String, default: uuid },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    profile_picture: { type: String, default: "https://i.pinimg.com/736x/99/d0/7f/99d07f72ea74f29fe21833964704cdc9.jpg"},
    favorite_movie: [
        {
            movie: {
                movie_id: { type: String, required: true },
                title: { type: String, required: true },
                poster_path: { type: String },
                rate: { type: Number, required: true }
            },
            _id: false
        }
    ],
    isAdmin: { type: Boolean, default: false },
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static login method
userSchema.statics.login = async function(email, password) {
    if (!email || password) {
        throw Error("All fields must be filled")
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error("Invalid email")
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error("Invalid password")
    }
    return user
};

const userModel = model<IUser>('User', userSchema);
export default userModel;