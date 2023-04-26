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
            content: `
              Rephrase the following text considering these instructions:\n\n
              - Apply a ${tone} tone.\n
              - Use a ${format} format.\n
              - ${
                maintainOriginalLength ? "Maintain the original length." : ""
              }\n
              - Ensure ${readability} readability.\n
              - Provide ${variations} variations.\n
              - IMPORTANT: Use "|||" as a separator between variations.\n
              - DONT title the variations or add any headers. 
              - DONT numberize the variations, no lists bullets or numbers.\n
              \n \n
              Please strictly follow the formatting instructions for each variation.\n\n
              Example:\n
              Rephrased text ||| Rephrased text ||| Rephrased text \n
              \n \n
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
