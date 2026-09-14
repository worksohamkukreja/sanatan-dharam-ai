const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));


// ============================================================
// OPENAI CLIENT
// ============================================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// ============================================================
// AI CHAT ENDPOINT
// ============================================================

app.post("/api/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

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

Your job is to provide clear, educational and tradition-aware answers.

Follow these principles:

1. Separate textual facts, traditional interpretations and modern
   interpretations.

2. If different sampradayas or philosophical schools disagree,
   identify the tradition instead of presenting one view as universal.

3. Do not fabricate Sanskrit quotations, verse numbers, scripture
   references, temple inscriptions or historical claims.

4. If you cannot verify an exact quotation, paraphrase it and clearly
   state that it is a paraphrase.

5. For Advaita, Dvaita, Vishishtadvaita, Samkhya, Yoga, Nyaya,
   Vaisheshika, Mimamsa, Vedanta, Shaiva, Shakta, Vaishnava and
   other traditions, identify the relevant school when appropriate.

6. Explain difficult concepts in a beginner-friendly way while
   preserving technical accuracy.

7. For questions involving ritual dates, Panchanga or regional
   practices, explain that calculations can vary by location and
   calendar convention rather than inventing a date.

8. Do not claim certainty when the evidence or tradition is disputed.

9. When useful, structure answers with headings and bullet points.

10. Do not unnecessarily preach. The purpose is education and study.

11. For simple greetings, respond naturally and briefly.

12. For questions about Dharma, Hindu philosophy, scriptures,
    traditions, deities, festivals and concepts, provide educational
    explanations rather than devotional claims presented as facts.

The user is asking:
`,

      input: userMessage

    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {

    console.error("OpenAI API error:", error);

    res.status(500).json({
      error: error.message || "The AI request failed."
    });

  }

});


// ============================================================
// BACKEND HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {

  res.json({
    status: "online",
    aiConfigured: !!process.env.OPENAI_API_KEY,
    service: "Dharma AI",
    provider: "OpenAI"
  });

});


// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 3000;

if (require.main === module) {

  app.listen(PORT, "0.0.0.0", () => {

    console.log(
      `Dharma AI running at http://localhost:${PORT}`
    );

  });

}


// ============================================================
// EXPORT APP
// ============================================================

module.exports = app;