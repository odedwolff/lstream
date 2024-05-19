function testTTS() {
    /* const textToSpeak = 'This is some text to be spoken.';
    const desiredLanguage = 'en-US'; // Example language code (English - US) */

    const textToSpeak = 'Здесь вкусный кофе';
    const desiredLanguage = "ru-RU"

    var seqOn = false;

    // Create a SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = textToSpeak;
    utterance.lang = desiredLanguage;

    // Optionally set other properties like pitch, rate, and voice
    // utterance.pitch = 1; // Adjust pitch (1 is default)
    // utterance.rate = 1; // Adjust speaking rate (1 is default)

    // Get available voices (optional)
    const voices = speechSynthesis.getVoices();
   // console.log('Available voices:', voices); // You can choose a specific voice here

    utterance.onend = function(event) {
        console.log('Speech completed!');
        // Perform any actions after speech finishes
    };   

    // Speak the utterance
    speechSynthesis.speak(utterance);
}

function testTTS2(){
    speak('same as it ever was, there is always the sun', 'en-US',
        ()=>{consoe.log("call back called back");}
    );
}

function testTTS3(){
    SpeakP('same as it ever was, there is always the sun', 'en-US')
    .then(()=>{console.log("THENED")});
}

function testTalkCycle(){
    talkCycle("text number one", "text number two", 'en-US', 'en-US', 1200, 
    ()=>{console.log("talkCycleComplete")});
}

function testSendAjax() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/ajaxTest'); // Replace with your actual endpoint
    xhr.onload = function () {
        if (xhr.status === 200) {
            //responseDiv.textContent = xhr.responseText;
            console.log(xhr.responseText);
        } else {
            //responseDiv.textContent = 'Error: ' + xhr.statusText;
            console.log( 'Error: ' + xhr.statusText);
        }
    };
    xhr.send();
}


function testSendPost(){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/postTest', true); // Replace with your actual endpoint
    const jsonData = { param1: "value1", param2: "value2" };
    xhr.setRequestHeader("Content-Type", "application/json"); // Set header for JSON data

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText); // Process successful response
        } else {
            console.error(xhr.statusText); // Handle errors
        }
    };

    xhr.send(JSON.stringify(jsonData)); // Convert object to JSON string
}

function testSendPost2(){
    const url = "/postTest";
    const jsonData = { param1: "value1", param2: "value2" };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json()) // Parse the JSON response data
    .then(data => {
        console.log(data); // Process the response data
    })
    .catch(error => {
        console.error(error); // Handle errors
     });

}