const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const url = "https://api.openai.com/v1/chat/completions";

async function rephrase(req, res) {
  try {
    const {
      text,
      tone,
      format,
      maintainOriginalLength,
      variations,
      readability,
    } = req.body;

    const response = await axios.post(
      url,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Rephrase the following text considering these guidelines: 
            1. Apply a ${tone} tone. 
            2. Use a ${format} format. 
            ${maintainOriginalLength ? "3. Maintain the original length." : ""}
            4. Ensure ${readability} readability. 
            
            Provide ${variations} variations, separating them with "|||". 
            Do not title or number the variations. 
            
            Text to rephrase: ${text}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    res.json(response.data.choices[0].message.content.trim());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  rephrase,
};
