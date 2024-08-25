const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Ensure node-fetch is installed

const app = express();
const PORT = 3000;

// Your Hugging Face API token
const HUGGING_FACE_ACCESS_TOKEN = 'Bearer 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';

// Function to query the FLUX.1-schnell model
async function queryflux_1_schnell(prompt) {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        headers: {
          Authorization: HUGGING_FACE_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.blob(); // Use blob if response is an image
    return result;
  } catch (error) {
    console.error('Error querying the model:', error);
    throw error;
  }
}

// Function to query the FLUX.1-dev model
async function queryflux_1_dev(prompt) {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
      {
        headers: {
          Authorization: HUGGING_FACE_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.blob(); // Use blob if response is an image
    return result;
  } catch (error) {
    console.error('Error querying the model:', error);
    throw error;
  }
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint for the 'flux_1_schnell' model
app.get('/flux_1_schnell', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).send('Prompt query parameter is required');
  }

  try {
    const imageBlob = await queryflux_1_schnell(prompt);
    res.setHeader('Content-Type', 'image/png');
    imageBlob.arrayBuffer().then((buffer) => {
      res.send(Buffer.from(buffer));
    });
  } catch (error) {
    res.status(500).send('Error generating image');
  }
});

// Endpoint for the 'flux_1_dev' model
app.get('/flux_1_dev', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).send('Prompt query parameter is required');
  }

  try {
    const imageBlob = await queryflux_1_dev(prompt);
    res.setHeader('Content-Type', 'image/png');
    imageBlob.arrayBuffer().then((buffer) => {
      res.send(Buffer.from(buffer));
    });
  } catch (error) {
    res.status(500).send('Error generating image');
  }
});

// Serve the index.html file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});