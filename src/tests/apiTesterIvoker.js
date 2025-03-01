const caller = require('../GeminiAPI/caller');



//Received data: { lang: 'Italian', level: 'A1' }

var retObj = caller.talkWithAPIs("spoken palestinian arabic", "b1")
retObj.then(
    function (inRet) {
       // res.send(JSON.stringify(inRet));
       console.log(`RET: ${JSON.stringify(inRet)}`);

    },
    function (err) {
        console.log(`ERROR: ${err}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }

);