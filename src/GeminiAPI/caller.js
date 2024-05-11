const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});




async function simpleCycleTest(language, level) {
  // For text-only input, use the gemini-pro model
  
  const prompt1 = "please write a random short sentence, no longer than 7 words in " + language + " for language students in level " + level;
  const result = await model.generateContent(prompt1);
  const response = await result.response;
  const genText = response.text();
  console.log("generated text +" + genText);


  const promtp2 = "please translate following sentence from " + language + " to english:" + genText;
  const result2 = await model.generateContent(promtp2);
  const response2 = await result2.response;
  const trxText = response2.text();
  console.log("translated text: " + trxText);

  retObj =  {
    genText: genText, 
    translation: trxText
  };
  return retObj;

}


module.exports = {
    simpleCycleTest: simpleCycleTest
};