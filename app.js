require('dotenv').config(); // To load the environment variables
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function cleanJsonResponse(text) {
    try {
        // console.log('Raw AI response:', text);

        // Strip backticks and markdown-like formatting
        let cleanedText = text.replace(/```json|```/g, '').trim();

        // Find the position where the valid JSON ends
        const jsonEndIndex = cleanedText.lastIndexOf('}');
        if (jsonEndIndex === -1) {
            throw new Error('No valid JSON found in the response.');
        }

        // Keep only the valid JSON part
        cleanedText = cleanedText.slice(0, jsonEndIndex + 1);

        // Replace common issues: extra commas before closing brackets
        cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
        console.log("Cleaned json", JSON.parse(cleanedText))
        return JSON.parse(cleanedText);
    } catch (err) {
        throw new Error(`Invalid JSON format: ${err.message}`);
    }
}


// API route to generate 3 recipes and 3 exercises based on BMI
app.post('/generate-ai-health-tips', async (req, res) => {
    try {
        const { bmi } = req.body;

        if (!bmi) {
            return res.status(400).json({ error: 'BMI value is required' });
        }

        // The prompt to generate recipes and exercises for a specific BMI
        const prompt = `
            Generate 3 healthy recipes and 3 exercises in JSON format for a person with a BMI of ${bmi}.

            The response should follow this JSON schema:
            {
            "recipes": [
                {
                "recipeName": "string",
                "recipeItems": ["string"],
                "recipeCalories": "number",
                "recipeBenefits": "string"
                }
            ],
            "exercises": [
                {
                "exerciseName": "string",
                "exercisePerform": "string",
                "exerciseBenefits": "string"
                }
            ]
            }

            Provide a valid JSON format.
        `;


        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        // Clean and parse the response to JSON
        const recipesJson = cleanJsonResponse(rawText);

        res.json({
            bmi,
            data: recipesJson
        });
    } catch (error) {
        console.error('Error generating recipes:', error.message);
        res.status(500).json({ error: 'Failed to generate recipes' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
