import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const HUGGING_FACE_ACCESS_TOKEN = 'Bearer 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';

async function queryHuggingFace(prompt) {
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

    const result = await response.blob();
    return result;
  } catch (error) {
    console.error('Error querying the model:', error);
    throw error;
  }
}

router.get('/', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).send('Prompt query parameter is required');
  }

  try {
    const imageBlob = await queryHuggingFace(prompt);
    res.setHeader('Content-Type', 'image/png');
    imageBlob.arrayBuffer().then((buffer) => {
      res.send(Buffer.from(buffer));
    });
  } catch (error) {
    res.status(500).send('Error generating image');
  }
});

module.exports = router;
