import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: Number,
        required: false,
    },
      profilePic: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    confirmPassword: {
        type: String,
        required: false,
    }
})

const User = mongoose.model("User", UserSchema)

export default User