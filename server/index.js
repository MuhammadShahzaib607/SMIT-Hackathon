import express from "express"
import authRoute from "./routes/authRoute.js"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())
app.use("/auth", authRoute)

const connectDB = async ()=> {
    try {
       await mongoose.connect(process.env.MONGO_URI)
       console.log("DB Connected Successfully")
    } catch (error) {
        console.log(error.message, "<<=== Error")
    }
}

connectDB()

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;