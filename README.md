# AI Health Tips Generator

This is an Express-based API that generates healthy recipes and exercises based on a person's BMI using Google's Generative AI (Gemini 1.5 model). The API processes requests to generate 3 healthy recipes and 3 exercises for a given BMI value and returns the result in JSON format.

## Features

- Generate personalized health tips based on BMI.
- Provides a clean JSON response with 3 healthy recipes and 3 exercises.
- Utilizes Google's Generative AI model `gemini-1.5-flash` for content generation.

## Prerequisites

- **Node.js** (version 12 or higher)
- **Google Generative AI API Key**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-health-tips-generator.git
   cd ai-health-tips-generator
   npm install

2. Create `.env` file:
   ```bash
   API_KEY=your-google-api-key
