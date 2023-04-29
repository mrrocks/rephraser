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
      highlightedWords,
    } = req.body;

    const response = await axios.post(
      url,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
            As an expert writer, your task is to rephrase the given text by adhering to the instructions provided. For each variation, strictly follow these rules without any exceptions:

            1. Apply a ${tone} tone.
            2. Use ${format} format.
            3. ${
              maintainOriginalLength
                ? "Maintain the original length."
                : "Don't worry about the length."
            }
            4. Ensure ${readability} readability.
            5. Provide ${variations} variations.
            6. Use "---" as the only separator between variations. No other separators or formatting should be used.
            7. DO NOT title, number, or add headers to the variations. No lists, bullets, or numbers.
            8. Detect and use the original language of the text for the variations.

            ${
              highlightedWords
                ? `Include these words in all the variations: ${highlightedWords} \n`
                : ""
            }
            Text to rephrase: ${text}\n\n
            
            Follow the example format below without deviation:\n
            
            Rephrased text\n
            ---\n
            Rephrased text\n
            ---\n
            Rephrased text`,
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
