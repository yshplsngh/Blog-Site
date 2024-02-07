

const { GoogleGenerativeAI } = require("@google/generative-ai");
const {config} = require("../config/config");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(config.GEMINI_AI);

async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `
    Suppose you have built a neural network. You decide to initialize the weights and biases to be zero. Which of the following statements is True?
    
    (A) Each neuron in the first hidden layer will perform the same computation. So, even after multiple iterations of gradient descent, each neuron in the layer will be computing the same thing as other neurons.
    
    (B) Each neuron in the first hidden layer will perform the same computation in the first iteration. But after one iteration of gradient descent, they will learn to compute different things because we have “broken symmetry”.
    
    (C) Each neuron in the first hidden layer will compute the same thing, but neurons in different layers will compute different things; thus, we have accomplished “symmetry breaking” as described in the lecture.   
    
    (D) The first hidden layer’s neurons will perform different computations from each other even in the first iteration; their parameters will thus keep evolving in their own way.`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();