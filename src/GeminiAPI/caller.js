const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)

const apiKey = process.env.API_KEY;
console.log(apiKey);
console.log(`apiKey = >>>${apiKey}<<<`);

const genAI = new GoogleGenerativeAI(apiKey);

console.log(`genAI = ${JSON.stringify(genAI)}`);


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


console.log(`model = ${JSON.stringify(model)}`);

//the rate of sentences with randomized initials condition  
const RANDOMIZE_BY_INITAL_RATE = 1.0;


//the maxLen argument is not used for now, the length is derived from the proficiancy leve
async function talkWithAPIs(language, level) {

    var genText = "gen text pre";
    var retObj = null; 

   // const prompt1 = prompter(level, language, maxLen);
    const prompt1 = composePrompt(level, language);

    const result = await model.generateContent(prompt1);
    const response = await result.response;
    genText = response.text();
    console.log("generated text +" + genText);

    
     const promtp2 = "Translate the following sentence from " + language + " to English: '" + genText + "'. (End of text to translate) Provide only a single translation, with no additional options, caveats, or metadata—just the translation that seems most likely to you.";


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
    " traditions and holidays",   
    " at the care repair", " job search", "decision making", " straggling", "hope", "dreams", "childhood", " fear", 
    " courage", " philosophy", " pyhsics", " chimestry", " biology", " stars", "the sky", " the earath", " the mountains", 
    " clocks", " spirituality", " rock music", "pop music", " understanding", " cooking", " disappointment", " beliefe", 
    " doubt", " beurocracy", " dogs", " cats", " birds", "buildings", " phones", "cars", " traffic", "the weather", " the climate",
    " sports events", " languages", " cultures", " professions", " history", " literature", " psychology", " loss", " victory",
    "memories", "hopes", "dreaming", "talent", "sickness", "surprises", "inner design", "cleaning the house", "going on a diet", 
    "life on the farm", "traditions of folks", "tasty dishes", "clothing", "moving", "the news", "religions", "traditions",
     "at the hospital", "a visit to the doctor", "babies and theirs parents", "games", "toys", "the kindergarten", "the forest",
      "the picnic", "the river", "the desert", "on the highway", "hiking", "camping", "playing", "singing", "at the office",
       "different trades", "different blue collar jobs", "proverbs and adages", "different mythologies", "folk traditions",
        "countries and cities of the world", "construction", "engineering", "bridges", "parking lots", "elevators", "birds", "pubs", 
        "restaurants", "the moon", "the different colors", "different types of furniture", "a sports hall", "the street life", 
        "the city square", "Emergency medical services", "going to the mountains"
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



 function composePrompt(level, language){
    console.log(`entering composePrompt(${level}, ${language})`);

    var randTheme1 = randTheme();
    
    const prompt = `please generate a simple sentence in ${language} suitable for ${level} proficiency level. 
    ${initialConditionPhrase(language)} 
    it should be related somehow theme "${randTheme1}". 
    please do not include in your reply any comments or translation, just the raw generated sentence  `;
    console.log(`prompt = ${prompt} \n\n`);
     return prompt;

 }


const commmonInitials = {
    'Spanish' : ['A', 'E', 'O', 'I', 'U', 'S', 'C', 'P', 'H', 'L', 'R'],
    'Italian' : ['A', 'E', 'I', 'O', 'U', 'F', 'L', 'M', 'N', 'P', 'R', 'S', 'T'], 
    'German' : ['E', 'N', 'I', 'S', 'B', 'F', 'D', 'M', 'K', 'L'], 
    'Russian' : ['О', 'И', 'А', 'П', 'С', 'Н', 'В', 'Т', 'К', 'М'],
    'French' : ['L', 'D', 'P', 'C', 'A', 'S', 'E', 'J', 'M', 'T', 'F'], 
    'spoken palestinian arabic' : ['ا', 'ل', 'ب', 'م', 'ف', 'ك', 'ت', 'س', 'ع', 'ح', 'و']
    
}





function initialConditionPhrase(language){
    console.log(`entering initialConditionPhrase(${language})`)
    //language = language.toLowerCase();
    if(!language in commmonInitials){
        console.log(`ERROR!! language ${language} not found in commmonInitials`);
        return "";
    }
    if(Math.random() > RANDOMIZE_BY_INITAL_RATE){
        console.log(`sentence not randomized by initals (random var under thresh)`);
        return "";
    }
    const langComInits = commmonInitials[language];
    const randomIndex = Math.floor(Math.random() * langComInits.length);
    //return ` the sentence should start with a word whose first letter is ${langComInits[randomIndex]}. `
    return ` the sentence should contain a common noun whose first letter is ${langComInits[randomIndex]}. `

}


module.exports = {
    talkWithAPIs: talkWithAPIs
};