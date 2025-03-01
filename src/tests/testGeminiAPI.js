const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {

  const generationConfig = {
    temperature: 2.0, // Set your desired temperature (range: 0.0 - 2.0 for gemini-1.5-flash)
    topP: 0.5,      // Optional: controls nucleus sampling
    topK: 30,        // Optional: controls top-k sampling
    maxOutputTokens: 8192, // Optional: limits the response length
  };


  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: generationConfig });

  //const prompt = "Write a story about a magic backpack."

  const promptOld = `please generate a simple sentence in German suitable for B1 proficiency level.
     it should be no longer than 6 words. 
     it should be related somehow theme " food and drinks" and should be in first person. 
     please do not include in your reply any comments or translation, just the raw 
     generated sentence `

  const prompt = `please generate a simple sentence in German suitable for B1 proficiency level.
     it should be related somehow theme " food and drinks. the first word should start with the letter r".
     please do not include in your reply any comments or translation, just the raw 
     generated sentence `

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}




run();