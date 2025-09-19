
const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const GoogleGenAi = require("@google/generative-ai");

dotenv.config();
router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Validate input
        if (!prompt) {
            return res.status(400).json({
                error: 'Missing required parameter: prompt'
            });
        }

        if (typeof prompt !== 'string' || prompt.trim().length === 0) {
            return res.status(400).json({
                error: 'Prompt must be a non-empty string'
            });
        }

        console.log("api key", process.env.GOOGLE_API_KEY)
        const genAI = new GoogleGenAi.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        const promptPrefix = "Assume you are a chatbot model for a rainwater prediction project. You should only give short responses maximum 50 words. The responses should be in simple terms and easy for people to understand. Now with the above considerations, answer the below question: "
        const finalPrompt = promptPrefix + prompt;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(finalPrompt);
        const response = result.response;
        const generatedText = response.text();

        // Return successful response
        res.json({
            success: true,
            prompt: prompt.trim(),
            response: generatedText,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating content:', error);

        // Handle specific error types
        if (error.message.includes('API key')) {
            return res.status(401).json({
                error: 'Invalid or missing API key'
            });
        }

        if (error.message.includes('quota')) {
            return res.status(429).json({
                error: 'API quota exceeded'
            });
        }

        // Generic server error
        res.status(500).json({
            error: 'Failed to generate content',
            details: error.message
        });
    }
});

module.exports = router;