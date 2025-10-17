import User from "../models/Auth.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

const { sign } = jwt
const { hash, compare } = bcrypt
dotenv.config()

export const signup = async (req, res) => {
    try {
        const {userName, email, password } = req.body

        // Check if username already exists
        const existingUserName = await User.findOne({ userName })
        if (existingUserName) {
            return res.status(409).json({
                status: false,
                message: "UserName already taken",
            })
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(409).json({
                status: false,
                message: "Email already Taken",
            })
        }

        // Password length check
        if (!password || password.length < 8) {
            return res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long",
            })
        }

        // Hash password
        const hashPassword = await hash(password, 10)

        // Create and save new user
        const newUser = new User({
            firstName: '',
            lastName: '',
            description: '',
            phoneNumber: '',
            location: '',
            profilePic: '',
            gender: '',
            userName,
            email,
            password: hashPassword
        })

        const savedUser = await newUser.save()

        return res.status(200).json({
            status: true,
            message: "User registered successfully",
            userData: savedUser,
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (password.length < 8) {
            res.status(404).json({
                "status": false,
                "message": "password should be 8 characters long"
            })
        }

        const users = await User.find()
        const isUserExist = users.find((user) => {
            return user.email === email
        })

        if (!isUserExist) {
            return res.status(404).json({
                "status": false,
                "message": "invalid credential"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, isUserExist.password)

        if (!isPasswordMatch) {
            return res.status(404).json({
                "status": false,
                "message": "invalid credential"
            })
        }

        const { _id } = isUserExist

        const token = sign({ _id, email },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
        )

        res.status(200).json({
            "status": true,
            "message": "user logged in successfully",
            "user": isUserExist,
            "token": token
        })
    } catch (error) {
        res.status(400).json({
            "status": false,
            "message": "something went wrong",
            "error": error.message
        })
    }

}

export const getUser = async (req, res)=> {
try {
const {id} = req.params;
// console.log(id)
 if (!id) {
      return res.status(400).json({
        status: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id)

   if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      user,
    });

} catch (error) {
      res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
}
}

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId)

    const updateData = {};
    const fields = [
      "firstName",
      "lastName",
      "mobileNumber",
      "location",
      "profilePic",
      "gender",
      "description"
    ];

    
    fields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== "") {
            updateData[field] = req.body[field];
        }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    const { password, ...otherDetails } = updatedUser._doc;
    
    // console.log(otherDetails, "User Data")
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: otherDetails
    });

  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
