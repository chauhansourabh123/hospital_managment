import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'; // Ensure the correct file extension and path

// Asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Build the MongoDB URI from environment variables and constants
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        const uri = `${mongoURI}/${DB_NAME}`;

        // Connect to MongoDB
        const connection = await mongoose.connect(uri);

        // Log connection details
        console.log(`Database connected successfully: ${connection.connection.host}`);

    } catch (error) {
        // Log detailed error information
        console.error('Error connecting to the database:', error.message);
        console.error(error.stack);
        process.exit(1); // Exit the process with failure code
    }
};

export default connectDB;
