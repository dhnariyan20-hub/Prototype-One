#Prototype-One

Prototype-One is a Node.js and Express-based experimental API server designed to dynamically load route modules and serve both API endpoints and static HTML pages. This project demonstrates modular routing, basic API security, and integration with third-party services.
#Project Overview
The server automatically loads route files from a dedicated routes directory and exposes them as endpoints. It also serves static HTML pages for the homepage, documentation, and error handling.

One of the example routes included is an image generation API that connects to a Hugging Face-hosted DALL·E-style model.

#Features

Express.js server with ES module support

Dynamic route loading from the routes directory

Centralized API information endpoint

Static HTML pages for home, documentation, and 404 handling

Example AI image generation route using Hugging Face Inference API

Environment variable support via dotenv

#Example Code
```javascript

// Import Express to create routes and handle HTTP requests
import express from "express";

// Import node-fetch so we can make HTTP requests to external APIs
import fetch from "node-fetch";

// Create a new Express Router instance
// This router will be exported and mounted in server.js
const router = express.Router();

// Hugging Face API token
// IMPORTANT: This token should come from the .env file for security reasons
// Example in .env: HF_API_KEY=your_huggingface_token_here
const HUGGING_FACE_ACCESS_TOKEN = `Bearer ${process.env.HF_API_KEY}`;

/**
 * Function to send a prompt to the Hugging Face Inference API
 * and receive an image response from the model.
 *
 * @param {string} prompt - The text prompt for image generation
 * @returns {Blob} - Image data returned by the API
 */
async function queryHuggingFace(prompt) {
  try {
    // Make a POST request to the Hugging Face inference endpoint
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",

        // Headers tell Hugging Face who we are and what data we are sending
        headers: {
          Authorization: HUGGING_FACE_ACCESS_TOKEN, // API authentication
          "Content-Type": "application/json"         // Request body format
        },

        // The request body contains the prompt text
        // Hugging Face expects it inside an "inputs" field
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    // If Hugging Face responds with an error status (not 200–299)
    // throw an error so it can be handled properly
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convert the response into a Blob
    // The API returns image binary data
    const result = await response.blob();

    // Return the image blob to the caller
    return result;

  } catch (error) {
    // Log the error on the server for debugging
    console.error("Error querying the model:", error);

    // Re-throw the error so the route handler can respond properly
    throw error;
  }
}

/**
 * GET /
 * Example request:
 * /dalle?prompt=a futuristic city at sunset
 */
router.get("/", async (req, res) => {
  // Read the prompt from query parameters
  // Example: ?prompt=hello
  const prompt = req.query.prompt;

  // Validate input
  // If no prompt is provided, return a 400 Bad Request
  if (!prompt) {
    return res.status(400).send("Prompt query parameter is required");
  }

  try {
    // Call the Hugging Face API with the user's prompt
    const imageBlob = await queryHuggingFace(prompt);

    // Set the response content type so the browser knows it's an image
    res.setHeader("Content-Type", "image/png");

    // Convert Blob to ArrayBuffer, then to Node.js Buffer
    // This is required before sending binary data in Express
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // Send the image back to the client
    res.send(buffer);

  } catch (error) {
    // If anything goes wrong, return a generic server error
    res.status(500).send("Error generating image");
  }
});

// Export the router so it can be used in server.js
export default router;
```

#Project Status

I created this project around two years ago when I was still learning and exploring backend development concepts. From a current standpoint, parts of this project may be outdated, and it has not been maintained for the past two years. This repository is no longer actively developed, so please do not expect updates or support. It is an open-source project, so feel free to explore, modify, and use it responsibly in accordance with the license terms. Think of it as an old experimental gadget and enjoy exploring it.
License

This project is open source. Please review and follow the license terms before using or redistributing the code.

#Author

Developed By Redwan as a learning prototype.
