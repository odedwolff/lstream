var level = 'A1';
        var langInfo = {langName: 'italian', langCode: 'it-IT'};
        var inverse = false; 
        var answerLatency = 3000;
        var maxLen = 5;
        var shouldRepeat = false;
        var repeatsLeft = 1; 
        


        function updateSelectionMaxLen(dropdown) {
            maxLen = dropdown.value;
        }
        function updateSelectionLang(dropdown) {
            const jsonObj = dropdown.value
            langInfo = JSON.parse(jsonObj);
        }

        function updateSelectionLevel(dropdown) {
            level = dropdown.value;
        }

        function updateSelectionLatency(dropdown) {
            answerLatency = parseInt(dropdown.value);
        }

        function speak(textToSpeak, desiredLanguage, doAfter){
            /* const textToSpeak = 'This is some text to be spoken.';
            const desiredLanguage = 'en-US'; // Example language code (English - US) */

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
                doAfter();
                // Perform any actions after speech finishes
            };   

            // Speak the utterance
            speechSynthesis.speak(utterance);
        }

        //with a promse 
        function SpeakP(textToSpeak, desiredLanguage){
            return new Promise((resolve, reject) => {
                /* const textToSpeak = 'This is some text to be spoken.';
                const desiredLanguage = 'en-US'; // Example language code (English - US) */

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
                    //doAfter();
                    resolve();
                    // Perform any actions after speech finishes
                };   

                // Speak the utterance
                speechSynthesis.speak(utterance);
            });
        }



        /**a cyclet for the format: stay questiotn, wait, say answer**/
        function talkCycle(text1, text2, lang1, lang2, waitMs, atComplete){
            SpeakP(text1, lang1).
            then(()=>{
                setTimeout(
                ()=>{
                    //SpeakP(text2,lang2).then(atComplete)
                    SpeakP(text2,lang2).then(
                        ()=>{
                            if(shouldRepeat && repeatsLeft > 0 ){
                                repeatsLeft--;
                                talkCycle(text1, text2, lang1, lang2, waitMs, atComplete);
                            }else{
                                atComplete();
                            }
                        }
                    )
                }, waitMs 
             )}
            ); 
        }

        

        function startSeq(){
            console.log("click start");
            document.getElementById("startSeq").setAttribute("disabled", true);
            document.getElementById("endSeq").removeAttribute("disabled");

           /*  document.getElementById("startSeq").classList.add("disabled-button");
            document.getElementById("endSeq").classList.remove("disabled-button"); */
            seqOn = true;
            nextCycle();
        }
        function endSeq(){
            console.log("click end");
            document.getElementById("endSeq").setAttribute("disabled", true);
            seqOn = false;
        }
        
        function handleAPIResponse(response, afterCallBack){
            var resObj = JSON.parse(response);
            const genText = resObj['genText'];
            const translation = resObj['translation'];
            //talkCycle(genText, translation, 'it-IT', 'en-US', 3000, afterCallBack);
            if(inverse){
                talkCycle(translation, genText, 'en-US', langInfo.langCode, answerLatency, afterCallBack);

            }else{
                talkCycle(genText, translation, langInfo.langCode, 'en-US', answerLatency, afterCallBack);
            }
        }
        
        
        function cycle(after) {
            const xhr = new XMLHttpRequest();
            const data = {lang:langInfo.langName, level:level, maxLen: maxLen};
            xhr.open('POST', '/simpleCycle', true); // Replace with your actual endpoint
            xhr.setRequestHeader("Content-Type", "application/json"); // Set header for JSON data

            xhr.onload = function () {
                if (xhr.status === 200) {
                    //responseDiv.textContent = xhr.responseText;
                    console.log(xhr.responseText);
                    handleAPIResponse(xhr.responseText, after);
                    //after();
                } else {
                    //responseDiv.textContent = 'Error: ' + xhr.statusText;
                    console.log( 'Error: ' + xhr.statusText);
                    console.log( 'skipping to next cycle');
                    nextCycle();
                }
            };
            xhr.send(JSON.stringify(data));
        }

        function nextCycle(){
            repeatsLeft = 1;
            if(seqOn){
                    console.log("----");
                    setTimeout(cycle.bind(null, nextCycle), 200);
            }else{
                document.getElementById("startSeq").removeAttribute("disabled");
            }
           
        }

        const checkbox = document.getElementById("inverseCheckBox");
        checkbox.addEventListener("change", function() {
            inverse = checkbox.checked;
            console.log("Inverse new state: " + inverse);
            // Perform actions based on the checkbox state (isActive)
        });

        const checkboxRepeat = document.getElementById("repeatCheckBox");
        checkboxRepeat.addEventListener("change", function() {
            shouldRepeat = checkboxRepeat.checked;
            console.log("should repeat new state: " + inverse);
            // Perform actions based on the checkbox state (isActive)
        });
