import express from "express";

async function queryHuggingFace(prompt) {
  const fetch = (await import("node-fetch")).default;
  const timeoutDuration = 120000; // 120 seconds (2 minutes)

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/fofr/flux-80s-cyberpunk",
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
        signal: controller.signal, // Add timeout signal
      }
    );

    clearTimeout(timeoutId); // Clear the timeout if the request completes successfully

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.blob();
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      throw new Error('Image generation timed out');
    } else {
      console.error("Error querying the model:", error);
      throw error;
    }
  }
}

const router = express.Router();

// Your API key for security
const API_KEY = "redwan";

// Route to handle image generation for Flux 80s Cyberpunk
router.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  const apiKey = req.query.apikey;

  if (!prompt) {
    return res.status(400).send("Prompt query parameter is required");
  }

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).send("Invalid API key");
  }

  try {
    const imageBlob = await queryHuggingFace(prompt);
    res.setHeader("Content-Type", "image/png");
    imageBlob.arrayBuffer().then((buffer) => {
      res.send(Buffer.from(buffer));
    });
  } catch (error) {
    if (error.message === 'Image generation timed out') {
      res.status(504).send("Image generation timed out. Please try a simpler prompt or try again later.");
    } else {
      res.status(500).send("Error generating image");
    }
  }
});

export default router; // Use ES module export syntax
