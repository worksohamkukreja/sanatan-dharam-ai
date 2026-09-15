const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const userMessage = req.body?.message;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const response = await client.responses.create({

      model: "gpt-5.6-luna",

      instructions: `
You are Dharma AI, the study companion of a website about
Indian philosophy, Dharma, Hindu traditions, texts and sacred culture.

Provide clear, educational and tradition-aware answers.

Separate textual facts, traditional interpretations and modern
interpretations.

If different sampradayas or philosophical schools disagree,
identify the tradition.

Do not fabricate Sanskrit quotations, verse numbers, scripture
references, temple inscriptions or historical claims.

If you cannot verify an exact quotation, paraphrase it and say
that it is a paraphrase.

Explain difficult concepts in a beginner-friendly way while
preserving technical accuracy.

For ritual dates, Panchanga or regional practices, explain that
calculations can vary by location and calendar convention.

Do not claim certainty when evidence or tradition is disputed.

Do not unnecessarily preach. The purpose is education and study.

For simple greetings, respond naturally and briefly.
`,

      input: userMessage

    });

    return res.status(200).json({
      answer: response.output_text
    });

  } catch (error) {

    console.error("OpenAI API error:", error);

    return res.status(500).json({
      error: error.message || "The AI request failed."
    });

  }
};