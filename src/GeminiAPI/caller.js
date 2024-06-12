const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)

const apiKey = process.env.API_KEY;
console.log(apiKey);
console.log(`apiKey = >>>${apiKey}<<<`);

const genAI = new GoogleGenerativeAI(apiKey);

console.log(`genAI = ${JSON.stringify(genAI)}`);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

console.log(`model = ${JSON.stringify(model)}`);



const level2text = {
    A1:"please write a random sentence in italian. this could be a descriptive sentence, a part of a conversation or a dialogue. the length of the sentence should be 6 to 10 words, and it should be very easy language for people who speak some italian at beginner-intermediate level"
}



async function simpleCycleTest(language, level, maxLen) {
    // For text-only input, use the gemini-pro model
    var genText = "gen text pre";
    var retObj = null; 

    const prompt1_v1 = "please write a random short sentence, no longer than 7 words in " + language + " for language students in level " + level +
        "please make sure to only include the generated text in " + language + " without translation";

    const prompt1 = prompter(level, language, maxLen);

    const result = await model.generateContent(prompt1);
    const response = await result.response;
    genText = response.text();
    console.log("generated text +" + genText);

    const promtp2 = "please translate following sentence from " + language + " to english:" + genText;
    const result2 = await model.generateContent(promtp2);
    const response2 = await result2.response;
    const trxText = response2.text();
    console.log("translated text: " + trxText);

    retObj = {
        genText: genText,
        translation: trxText
    };
    return retObj;

}


const themes = ["in and around the house", "at work", "in school", "at the university", " kids freinds conversation", 
    " women friends conversation", "man freinds conversation", " children playing ", " men hobbies and interest", 
    " womens hobbies and intrerests", " family dinner", "family vacation", " family reunion", " seniors life", 
    " grandma and or grandpa hanging with grandchildren", " in nature", " at the park", " in the garden", 
    " street life", "shopping", " at the market", " at the supermaket", " my hobbies", " my freinds", " sprots",
    " exercise", " food and drinks", " at the resturant", " in the bus or the bus stop", 
    " in the train or the train station ", " in the airplane or the airport", " different professions ", " at the office",
    " art ", " dance and theatre", " film and movies", "tv and streaming", " jokes and comedy", " sad events", 
    " exciting events", " happy events", " the party", " happy birthday", " the wedding", " the funural", 
    " reading and writing", " freindship", " love ", " wild animals", " pets", "plants and flowers", " the weather",
    " the landscape", " the city", " the street", " the village", " computers and technology", " crafts", 
    " healthcare and medicine", " the human body ", " clothing", " traveling", " mood and emotions", 
    " traditions and holidays"    
]


function randTheme(){
    const randomIndex = Math.floor(Math.random() * themes.length);
    // Access the element at the random index
    return themes[randomIndex];
}

const personProbabilites = {first: 0.4, second: 0.2, third: 0.4 }

function randPerson(){
   
    const randomNumber = Math.random();
   
    //in zone 1 
    if (randomNumber < personProbabilites['first']) {
        return "first";
    }
    // zone 2 or 3
    if (randomNumber >  (1.0 - personProbabilites['third'])){
        //zone 2 
        return "second";
    }
    //zone 3 
    return "third";
}




function levelDescription(level){
    var out;
    switch (level) {
        case "a1", "A1":
            out = ' 1 out of 5 ';;
            break;
        case "a2", "A2":
            out = ' 2 out of 5 ';
            break;
        case "b1", "B1":
            out = ' 3 out of 5 ';
            break;
        case "b2", "B2":
            out = '4 out of 5 ';
            break;
        case "c1", "C1":
            out = ' 5 out of 5';
            break;

        default:
            out = " medium well done";

    }
    return "the complexity of the text should match a proficiency of " + out; 
}

function levelDescription2(level){
    var out;
    switch (level) {
        case "a1", "A1":
            out = ' use only words from the list of 100 most frequent words in the language.';
            break;
        case "a2", "A2":
            out = ' use only words from the list of 200 most frequent words in the language.';
            break;
        case "b1", "B1":
            out = ' use only words from the list of 500 most frequent words in the language.';
            break;
        case "b2", "B2":
            out = ' use only words from the list of 1000 most frequent words in the language.';
            break;
        case "c1", "C1":
            out = ' Use words and grammar suitable for advanced learners of the language';
            break;

        default:
            out = " medium well done";

    }
    return out; 
}

function prompterUntilJune9(level, language, maxLen){
    const levelDesc = levelDescription(level);

    const prompt = `please write a random sentence in ${language}, at Proficiency level ${levelDesc}. it should be related somehow to the theme "${randTheme()}"
     and should be in ${randPerson()} person, and no longer than ${maxLen} words. 
     please do not include in your reply any comments or translation, just the raw 
     generated sentence  `;
     console.log(`prompt = ${prompt}`);
     return prompt;

 }

 function prompter(level, language, maxLen){
    //const levelDesc = levelDescription(level);
    const profPhrase = ` Use words and grammar suitable for Proficiency ${level}`;
    //const profPhrase = levelDescription2(level);

    const prompt = `please write a random practice sentence for ${language} learners. 
    ${profPhrase}.
     it should be related somehow to the theme "${randTheme()}", and should be in ${randPerson()} person, 
     and no longer than ${maxLen} words. 
     please do not include in your reply any comments or translation, just the raw 
     generated sentence  `;
     console.log(`prompt = ${prompt}`);
     return prompt;

 }


module.exports = {
    simpleCycleTest: simpleCycleTest, 
    prompter: prompter
};