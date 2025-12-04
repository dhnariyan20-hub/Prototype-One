import express from "express";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();

const API_KEY = "redwan";

async function generateMagicStudioImage(prompt) {
  try {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "bytes");
    form.append("user_profile_id", "null");
    form.append("anonymous_user_id", "e7fb49c6-04b0-4fd3-9d27-2ca696a8322e");
    form.append("request_timestamp", Date.now().toString());
    form.append("user_is_subscribed", "false");
    form.append("client_id", "pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o");

    const response = await axios.post(
      "https://ai-api.magicstudio.com/api/ai-art-generator",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "origin": "https://magicstudio.com",
          "priority": "u=1, i",
          "referer": "https://magicstudio.com/ai-art-generator/",
          "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
        },
        responseType: "arraybuffer"
      }
    );

    return response.data;

  } catch (error) {
    console.error("Magic Studio image generation failed:", error?.response?.data || error.message);
    throw error;
  }
}

router.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  const apikey = req.query.apikey;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt query parameter is required' });
  }

  if (!apikey || apikey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  try {
    const imageBuffer = await generateMagicStudioImage(prompt);
    res.setHeader("Content-Type", "image/jpeg");
    res.end(imageBuffer);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate image" });
  }
});

export default router;
