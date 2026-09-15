module.exports = (req, res) => {

  res.status(200).json({
    status: "online",
    aiConfigured: !!process.env.OPENAI_API_KEY,
    service: "Dharma AI",
    provider: "OpenAI"
  });

};