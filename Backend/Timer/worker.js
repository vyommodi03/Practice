const { ipcRenderer, electron } = require('electron');
const path = require('path');
var val = 5, delay = 1;
var shortduration = val+delay+val;
var longduration = val+delay;
var shortfrequency = val+delay;
var longfrequency = val+delay;

const micTosec = 1000;
var skip = 0;
let updated = false;
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
	ipcRenderer.send(message, strict_flg);
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
                    // let msg = "Start Notif";
                    notif_done = true;
                    // resolve(sendMessage(msg));
                    if (notif_flg) {
                        console.log('reached inside of if')
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
async function createTimer() {

    // console.log(shortduration,shortfrequency,longduration,longfrequency);
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
})

window.onload = function() {
	createTimer();
};
ipcRenderer.on('schedule-has-been-changed',(event,arg)=>{
    skip=1;
    updated=true;
    shortfrequency=arg.shortfrequency;
    shortduration=arg.shortduration;
    longduration=arg.longduration;
    longfrequency=arg.longfrequency;
    strictmode=arg.strictmode;
    postduration=arg.postduration;
    postlimit=arg.postlimit;
});