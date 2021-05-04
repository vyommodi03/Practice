const { app, BrowserWindow, ipcMain } = require('electron')
const { localStorage, sessionStorage } = require('electron-browser-storage');
const electron = require('electron')
const path = require('path');
const Tray = electron.Tray
const iconPath = path.join(__dirname, 'images/App_logo.png')
const Menu = electron.Menu
const powerMonitor = electron.powerMonitor;

let win, worker = null, menu, tray, breakWin = null, flg, lockScreen
let template = [
    {
        label: 'Quit The App',
        click: function() {
            worker.close();
            worker = null;
            win.close();
        }
    }
]

app.on('ready', () => {
    win = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration:true,
            contextIsolation:false,
            devTools:true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('home/home.html');

    ipcMain.on('Start The Session', () => {
            tray = new Tray(iconPath);
            menu = Menu.buildFromTemplate(template);
            tray.setContextMenu(menu);
            tray.setToolTip('Time Break App');

            worker = new BrowserWindow({
                show: true,//updated
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                }
            })
            worker.loadFile('Timer/worker.html')

            ipcMain.on('End The Session', () => {
                if (worker) {
                    worker.close()
                    tray.destroy()
                    worker = null
                }
            })

            worker.on('closed',async ()=>{

                console.log("worker closing");
                    await localStorage.setItem('running_session',false);
                    
                    let prev_short_skipped = 0;
                    if(await localStorage.getItem('short_skipped'))
                    {
                        prev_short_skipped = parseInt(await localStorage.getItem('short_skipped')); 
                    }
                    let prev_long_skipped =  0;
                    if(await localStorage.getItem('long_skipped'))
                    {
                      prev_long_skipped = parseInt(await localStorage.getItem('long_skipped'));
                
                    }
                    let prev_startSession = Date.now();
                    if(await  localStorage.getItem('currstarttime'))
                    {
                        prev_startSession = parseInt(await localStorage.getItem('currstarttime'));
                    }
                    let prev_endSession = Date.now();
                    
                    let prev_totalshortbreak = 0;
                    if(await localStorage.getItem('currtotalshortbreak'))
                    {
                        prev_totalshortbreak = parseInt(await localStorage.getItem('currtotalshortbreak'));
                    }

                    let prev_totallongbreak = 0;
                    if(await localStorage.getItem('currtotallongbreak'))
                    {
                        prev_totallongbreak = parseInt(await localStorage.getItem('currtotallongbreak'));
                    }

                    await localStorage.setItem('prev_short_skipped',prev_short_skipped);
                    await localStorage.setItem('prev_long_skipped', prev_long_skipped);
                    await localStorage.setItem('prev_starttime',prev_startSession);
                    await localStorage.setItem('prev_endtime',prev_endSession);
                    await localStorage.setItem('prev_totalshortbreak',prev_totalshortbreak);
                    await localStorage.setItem('prev_totallongbreak',prev_totallongbreak);
                });

        ipcMain.on('your short break starts', (event, strict_flg)=>{
            flg = false;
            if (strict_flg === true) {
                flg = false;
            }
            else {
                flg = true;
            }
            breakWin = new BrowserWindow({
                // show: false,
                width: 1000,
                height: 600,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                },
                icon: null
            })
            breakWin.loadFile('breaks/shortBreak.html')
            breakWin.setFullScreen(true);
            breakWin.setSkipTaskbar(true);
        })
        ipcMain.on('Break-has-been-skipped', (event)=>{
            worker.webContents.send('Break-skipped-Main-to-worker');
        })
        ipcMain.on('your short break ends', ()=>{
            console.log("Window termination proc has been arrived in main");
            if (breakWin) {
                breakWin.close()
                breakWin = null
            }
        })

        ipcMain.on('your long break starts', (event, strict_flg)=>{
            breakWin = new BrowserWindow({
                // show: false,
                width: 1000,
                height: 600,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                },
                icon: null
            })
            breakWin.loadFile('breaks/longBreak.html')
            breakWin.setFullScreen(true);
            breakWin.setSkipTaskbar(true);
        })
        ipcMain.on('your long break ends', ()=>{
            if (breakWin) {
                breakWin.close()
                breakWin = null
            }
        })
    })
  
    powerMonitor.on('suspend', () => {
        console.log('The system is going to sleep');
        worker.close()
        // tray.destroy()
    });
    

    powerMonitor.on('lock-screen', () => {
        console.log('The system is about to be locked');
        lockScreen = 0;
        worker.webContents.send('system-lock');

        while (lockScreen===0) {}
        ipcMain.on('u-may-procedd-with-lock', ()=>{lockScreen = 1});
        if (worker) {
            worker.close()
            worker = null
        }
        console.log("storing-is-done-for-lockscreen");
        // tray.destroy()
    });
})
ipcMain.on('message-from-scheduler',(event,arg)=>{
    if (worker) {
        worker.webContents.send('scheduler-to-timer',arg);
    }
});

ipcMain.on('settings has been changed to Main',(event)=>{
    console.log("updated settings has arrived in main");
    if (worker) {
        worker.webContents.send('settings-has-been-changed-to-worker');
    }
});

