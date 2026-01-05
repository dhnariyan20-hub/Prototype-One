# Prototype-One

Prototype-One is an experimental API server built with Node.js and Express. It showcases modular routing, static content serving, and integration with third-party AI services. Designed for flexibility and demonstration purposes, it dynamically loads route modules, offers basic API endpoints, and serves static HTML pages.

---

## Project Overview

- **Dynamic Routing:** Automatically loads route modules from the `routes` directory, exposing them as API endpoints.
- **Static Content:** Serves static HTML pages for homepage, documentation, and error handling.
- **AI Integration:** Includes an example route for AI image generation via Hugging Face's inference API.
- **Environment Support:** Uses `.env` for managing sensitive configuration like API keys.
- **Tech Stack:** Built with Node.js, Express.js, and ES module support.

---

## Features

- Modular Express.js server with ES module support
- Automatic route loading from a dedicated directory
- Centralized API information endpoint
- Static pages for home, documentation, and 404 errors
- Example AI image generation route connecting to Hugging Face
- Environment variable support via `dotenv`

---

## Example Implementation: AI Image Generation Route

```javascript
// Import dependencies
import express from "express";
import fetch from "node-fetch";

// Create an Express router
const router = express.Router();

// Load Hugging Face API key from environment variables
const HUGGING_FACE_ACCESS_TOKEN = `Bearer ${process.env.HF_API_KEY}`;

/**
 * Function to query Hugging Face inference API for image generation
 * @param {string} prompt - The text prompt for image creation
 * @returns {Blob} - Generated image data
 */
async function queryHuggingFace(prompt) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: HUGGING_FACE_ACCESS_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error("Error querying the model:", error);
    throw error;
  }
}

/**
 * GET /
 * Example: /?prompt=your+description
 */
router.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    return res.status(400).send("Prompt query parameter is required");
  }

  try {
    const imageBlob = await queryHuggingFace(prompt);
    res.setHeader("Content-Type", "image/png");
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error generating image");
  }
});

export default router;
```

---

## Project Status

I created this project around two years ago when I was still learning and exploring backend development concepts. From a current standpoint, parts of this project may be outdated, and it has not been maintained for the past two years. This repository is no longer actively developed, so please do not expect updates or support. It is an open-source project, so feel free to explore, modify, and use it responsibly in accordance with the license terms. Think of it as an old experimental gadget and enjoy exploring it.
---

## License

This project is open source. Please review and adhere to the license terms before use or redistribution.

---

## Author

**Redwan** — A learning prototype exploring backend development concepts.
