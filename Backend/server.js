import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './src/db/dbconnection.js';




// Initialize the application
const initialize = async () => {
  try {
    // Get the port from environment variables or default to 3000
    const port = process.env.PORT || 3000;

    // Connect to the database
    await connectDB();

    // Start the Express server
    app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
    });
  } catch (error) {
    // Log the error details if something goes wrong
    console.error('Error initializing the application:', error.message);
    console.error(error.stack); // Provide stack trace for debugging
    process.exit(1); // Exit the process with failure code
  }
};

// Call the initialize function to start the application
initialize();
