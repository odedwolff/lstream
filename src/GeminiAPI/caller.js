const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});



const level2text = {
    A1:"please write a random sentence in italian. this could be a descriptive sentence, a part of a conversation or a dialogue. the length of the sentence should be 6 to 10 words, and it should be very easy language for people who speak some italian at beginner-intermediate level"
}



async function simpleCycleTest(language, level) {
  // For text-only input, use the gemini-pro model
  
  const prompt1_v1 = "please write a random short sentence, no longer than 7 words in " + language + " for language students in level " + level +
   "please make sure to only include the generated text in " + language + " without translation";

  const prompt1 = prompter(level, language);
    
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


function prompter(level, language){
      
    const part1 = `please write a random sentence in ${language}. this could be a descriptive sentence,
    a part of a conversation or of a dialogue.`
    var part2; 
    switch (level) {

        case "a0", "A0":
            part2 = ` the length of the sentence should be 3 to 5 words, 
            and it should be very easy language for people who just started learning ${language}.`;
            break;
        case "a1", "A1":
            part2 = ` the length of the sentence should be 3 to 6 words, 
            and it should be very easy language for people who speak very litte ${language}.`;
            break;
        case "a2", "A2":
           part2 = ` the length of the sentence should be 4 to 8 words, 
           and it should be easy language for people who speak only litte ${language}.`;
           break;
        case "b1", "B1":
            part2 = ` the length of the sentence should be 4 to 8 words, 
            and it should be simple language for people who speak intermediate ${language}.`;
            break;
        case "b2", "B2":
             part2 = ` the length of the sentence should be 5 to 10 words, 
            and it should be normal language for people who speak intermediate ${language}.`;
             break;
        case "c1", "C1":
            part2 = ` the length of the sentence should be 5 to 13 words, 
            and it should be normal language for people who speak good ${language}, but bellow native level`;
            break;

        default:
          resultString = "Default string (if no case matches)";
   
     }

     const part3 = " the response should only contain the generate text, with no added comments or a translation. ";
     const prompt = part1 + part2 + part3;
     console.log(`prompt = ${prompt}`);
     return prompt;
}


module.exports = {
    simpleCycleTest: simpleCycleTest, 
    prompter: prompter
};