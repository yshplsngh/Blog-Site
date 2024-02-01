

const { GoogleGenerativeAI } = require("@google/generative-ai");
const {config} = require("../config/config");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(config.GEMINI_AI);

async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = "explain deep start-ups or provide some fact and number"+"for group discussion"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();