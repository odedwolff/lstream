const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)

const apiKey = process.env.API_KEY;
console.log(apiKey);
console.log(`apiKey = >>>${apiKey}<<<`);

const genAI = new GoogleGenerativeAI(apiKey);

console.log(`genAI = ${JSON.stringify(genAI)}`);

//const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


console.log(`model = ${JSON.stringify(model)}`);




async function simpleCycleTest(language, level, maxLen) {
    // For text-only input, use the gemini-pro model
    var genText = "gen text pre";
    var retObj = null; 

   // const prompt1 = prompter(level, language, maxLen);
    const prompt1 = prompter2Themes(level, language, maxLen);

    
    

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

function targetLength(level){
    var range;
    switch (level) {
        case "a1", "A1":
            range = [3,5]
            break;
        case "a2", "A2":
            range = [3,6]
        case "b1", "B1":
            range = [4,7]
            break;
        case "b2", "B2":
            range = [5,7]
            break;
        case "c1", "C1":
            range = [5,8]
            break;

        default:
            range = [4,7];

    }
    const n2 = range[1];
    const n1 = range[0];
    return n1 + Math.floor(Math.random() * (n2 - n1 + 1));
}

function maxLength(level){
    var out;
    switch (level) {
        case "a1", "A1":
            out = 4;
            break;
        case "a2", "A2":
            out = 5; 
        case "b1", "B1":
            out = 6;
            break;
        case "b2", "B2":
            out = 7;
            break;
        case "c1", "C1":
            out = 9;
            break;

        default:
            out = 5;

    }
    return out; 
}


 function prompter(level, language, maxLen){
    const profPhrase = ` Use words and grammar suitable for Proficiency ${level}`;

    const prompt = `please write a random practice sentence for ${language} learners. 
    ${profPhrase}.
     it should be related somehow to the theme "${randTheme()}", and should be in ${randPerson()} person, 
     and no longer than ${maxLen} words. 
     please do not include in your reply any comments or translation, just the raw 
     generated sentence  `;
     console.log(`prompt = ${prompt}`);
     return prompt;

 }


 function letterRanomizaionPhrasse(language){
    ind1 = Math.floor(Math.random() * 25);
    ind2 = Math.floor(Math.random() * 25);
    return `the first word in the sentence should begin either with letter #${ind1} 
    in the ${language} alphabet, or with letter #${ind2} from the end in the ${language} alphabet. `

 }

 function prompter2Themes(level, language, maxLenArg){
    const profPhrase = ` Use words and grammar suitable for Proficiency ${level}`;

    var randTheme1 = randTheme();
    var randTheme2;
    do {
        randTheme2 = randTheme();
    }while(randTheme2 === randTheme1);

    const maxLenV = maxLength(level);


    const prompt = `please generate a simple sentence in ${language} suitable for ${level} proficiency level.
     it should be no longer than ${maxLenV} words. 
     \n ${initialPhras(language)} \n 
     it should be related somehow theme "${randTheme1}" and should be in ${randPerson()} person. 
     please do not include in your reply any comments or translation, just the raw 
     generated sentence  `;
     console.log(`prompt = ${prompt} \n\n`);
     return prompt;

 }


const commmonInitials = {
    'portuguese' : ['E', 'A', 'O', 'I', 'U', 'S', 'C', 'M', 'N', 'D', 'F'],
    'spanish' : ['A', 'E', 'O', 'I', 'U', 'S', 'C', 'P', 'H', 'L', 'R'],
    'italian' : ['A', 'E', 'I', 'O', 'U', 'F', 'L', 'M', 'N', 'P', 'R', 'S', 'T'], 
    'german' : ['E', 'N', 'I', 'S', 'B', 'F', 'D', 'M', 'K', 'L'], 
    'russian' : ['О', 'И', 'А', 'П', 'С', 'Н', 'В', 'Т', 'К', 'М']
}

const RANDOMIZE_BY_INITAL_RATE = 0.6;

function initialPhras(language){
    language = language.toLowerCase();
    if(!language in commmonInitials){
        console.log(`ERROR!! language ${language} not found in commmonInitials`);
        return "";
    }
    if(Math.random() > RANDOMIZE_BY_INITAL_RATE){
        console.log(`sentenced not randomized by initals`);
        return "";
    }
    const langComInits = commmonInitials[language];
    const randomIndex = Math.floor(Math.random() * langComInits.length);
    return `the sentence should start with a word whose first letter is ${langComInits[randomIndex]}`
}


module.exports = {
    simpleCycleTest: simpleCycleTest, 
    prompter: prompter
};