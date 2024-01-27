

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyAYolgaBU6wQCR6AgBrSBiggGbmBEDXlBQ");

async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `convert this given code into TypeScript and also tell me the error and fix those code` +
    `import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-api.onrender.com',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", \`Bearer \${token}\`);
        }
        return headers;
    }
});`+"fix this code and convert this code to typescript"


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();