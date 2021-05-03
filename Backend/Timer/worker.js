const { ipcRenderer, electron } = require('electron');
const path = require('path');
var shortduration = 10;    // time of Short break duration 
var longduration = 10;     // time of long break duration
var shortfrequency = 10;   // time of short break frequency
var longfrequency = 10;    // time of long break frequency

const micTosec = 1000;  // convert microsecond to second 
var skip = 0;           // intialize skip with zero 
let updated = false;    // intialize updated varibale to false
let noOfSkips = 0;     // Total number of skip during this session

var startSession = -1;
var endSession = -1;

let t1 = 5*micTosec, t2 = 2*micTosec;

var notif_flg = false, donot_flg = false, strict_flg = false;

if (window.localStorage.getItem('notifi') !== undefined) {
    notif_flg = window.localStorage.getItem('notifi');
}
if (window.localStorage.getItem('donot') !== undefined) {
    donot_flg = window.localStorage.getItem('donot');
}
if (window.localStorage.getItem('strict') !== undefined) {
    strict_flg = window.localStorage.getItem('strict');
}

function sendMessage(message) {
    // Send appropriate break message to main function
	ipcRenderer.send(message,strict_flg);
}

function mytimer(message, duration) {

    let startTime = Date.now();
    let endTime  = startTime+duration;
    let flg = ((message==="your short break ends") || (message==="your long break ends")) && skip;
    let flg1 = (message==="your short break starts") || (message==="your long break starts");
    let notif_done = false, terminated = false;

    return new Promise((resolve) => {
        let tmp = setInterval(()=>{
            let notification;
            // if (!donot_flg) {
                if (Date.now()>=endTime-t1 && flg1 && !notif_done)
                {
                    console.log("notification start")
                    // let msg = "Start Notif";
                    notif_done = true;
                    // resolve(sendMessage(msg));
                    if (notif_flg) {
                        notification = new Notification('Break Reminder', {
                            body: 'Your Next break will start in 5 seconds',
                        })
                    }
                }
                if (Date.now()>=endTime-t2 && flg1 && notif_done && !terminated)
                {

                    // let msg = "Terminate Notif";
                    terminated = true;
                    // resolve(sendMessage(msg));
                    // notification.close();
                }
                if(Date.now()>=endTime || flg || updated)
                {
                    resolve(sendMessage(message));
                    clearInterval(tmp);
                }
            // }
        },100);
    });
}
function checkForUpdate()
{
    return updated;   
}
// Timer function which generate one long break after every two short break
async function createTimer() {

    // Set duration and frequency value from local storage 
    if(localStorage.getItem('shortfrequency'))
    {
        shortfrequency = localStorage.getItem('shortfrequency');
    }
    else
    {
        shortfrequency = 10;
    }
    if(localStorage.getItem('shortduration'))
    {
        shortduration = localStorage.getItem('shortduration');
    }
    else
    {
        shortduration = 10;
    }
    if(localStorage.getItem('longduration'))
    {
        longduration = localStorage.getItem('longduration');
    }
    else{
        longfrequency = 10;
    }
    if(localStorage.getItem('longfrequency'))
    {
        longfrequency = localStorage.getItem('longfrequency');
    }
    else
    {
        longfrequency = 10;
    }
    console.log(localStorage.getItem('shortfrequency'));
    console.log(localStorage.getItem('shortduration'));
    console.log(localStorage.getItem('longduration'));
    console.log(localStorage.getItem('longfrequency'));
    console.log(shortduration,shortfrequency,longduration,longfrequency);

    updated=false;
	while (1) {
		await mytimer('your short break starts', shortfrequency * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your short break ends', shortduration * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your short break starts', shortfrequency * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your short break ends', shortduration * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
        await mytimer('your long break starts', longfrequency * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your long break ends', longduration * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
	}
    createTimer();
}
ipcRenderer.on('Break-skipped-Main-to-worker', ()=>{
    // breakWin.hide()
    skip = 1;
    noOfSkips = noOfSkips + 1; 
})
function closing() {
    // Skip the current break and update no of skip variable;
    noOfSkips = noOfSkips + 1; 
    skip=1;
}
window.onload = function() {
    // Initialize variable with default value
    noOfSkips = 0;  
    skip = 0 ;
    updated = false;

    startSession = Date.now();
    // create Timer function on load of the window 
	createTimer();
};

ipcRenderer.on('end-session',(event,arg)=>{
    endSession = Date.now();
    localStorage.setItem('startsession' , startSession);    
    localStorage.setItem('endsession',endSession);
        
});

// Update message from the scheduler to update frequency and duration of short and long break
ipcRenderer.on('scheduler-to-timer',(event,arg)=>{
    localStorage.setItem('shortfrequency' , arg.shortfrequency);
    localStorage.setItem('shortduration' , arg.shortduration);
    localStorage.setItem('longduration' , arg.longduration);
    localStorage.setItem('longfrequency' , arg.longfrequency);    
    
    skip=1;          // to break the current running timer  
    updated=true;    // Set update variable to true 

    // update all duration and frequency with new values
    shortfrequency=arg.shortfrequency;
    shortduration=arg.shortduration;
    longduration=arg.longduration;
    longfrequency=arg.longfrequency;

});
