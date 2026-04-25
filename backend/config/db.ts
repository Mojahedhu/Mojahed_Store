import mongoose from "mongoose"
import dotenv from "dotenv"
// Load environment variables from .env file
dotenv.config();
const connectDB = async () => {
console.log("MONGO_URI:", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Successfully connected to DB 👍")
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log("❌ Field to connect to DB", message)
        process.exit(1)
    }

}
export { connectDB };
