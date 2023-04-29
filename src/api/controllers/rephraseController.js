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
      markedWords,
    } = req.body;

    const response = await axios.post(
      url,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
              You are an expert writter. Rephrase the following text considering these instructions:
              \n\n

              - Apply a ${tone} tone.\n
              - Use ${format} format.\n
              ${
                maintainOriginalLength
                  ? "- Maintain the original length.\n"
                  : ""
              }
              - Ensure ${readability} readability.\n
              - Provide ${variations} variations.\n
              - IMPORTANT: Use "---" as a separator between variations.\n
              - DONT title the variations or add any headers.\n
              - DONT number the variations: no lists, bullets, or numbers.\n
              - Detect text's original languange and use it for the variations.\n\n
              
              Strictly follow the formatting instructions for each variation.\n\n
              
              Example:\n\n
              
              Rephrased text\n
              ---\n
              Rephrased text\n
              ---\n
              Rephrased text
              \n\n
              
              ${
                markedWords
                  ? `Include these words in all the variations: ${markedWords} \n`
                  : ""
              }
              Text to rephrase: ${text}`,
          },
        ],
        temperature: 0.2,
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
    if (error.response) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  rephrase,
};
