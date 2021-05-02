const { app, BrowserWindow, ipcMain } = require('electron')
const electron = require('electron')
const path = require('path');
const Tray = electron.Tray
const iconPath = path.join(__dirname, 'images/App_logo.png')
const Menu = electron.Menu
const powerMonitor = electron.powerMonitor;

let win, worker = null, menu, tray, breakWin = null, flg
let template = [
    {
        label: 'Quit The App',
        click: function() {
            worker.close()
        }
    },
    {
        label: 'other Options',
        submenu: [
            {
                label: 'Option1'
            },
            {
                label: 'Option2'
            },
            {
                label: 'Option3'
            }
        ]
    }
]

app.on('ready', () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration:true,
            contextIsolation:false,
            devTools:true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('home/home.html');

    ipcMain.on('Start The Session', () => {
        // if (!donot_flg) {
            tray = new Tray(iconPath);
            menu = Menu.buildFromTemplate(template);
            tray.setContextMenu(menu);
            tray.setToolTip('Time Break App');

            worker = new BrowserWindow({
                show: false,
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
                worker.close()
                tray.destroy()
                worker = null
            })
        // }

        ipcMain.on('your short break starts', (event, strict_flg)=>{
            console.log(strict_flg);
            if (strict_flg===true) flg = false
            else flg = true
            breakWin = new BrowserWindow({
                // show: false,
                width: 1000,
                height: 600,
                frame: flg,
                alwaysOnTop: true,
                // frame: true,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                }
            })
            breakWin.loadFile('breaks/shortBreak.html')
        })
        ipcMain.on('Break-has-been-skipped', (event)=>{
            breakWin.hide()
            event.sender.send('Break-skipped-Main-to-worker');
        })
        ipcMain.on('your short break ends', ()=>{
            breakWin.hide()
        })

        ipcMain.on('your long break starts', (event, strict_flg)=>{
            breakWin = new BrowserWindow({
                // show: false,
                width: 1000,
                height: 600,
                frame: !strict_flg,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                }
            })
            breakWin.loadFile('breaks/longBreak.html')
        })
        ipcMain.on('your long break ends', ()=>{
            breakWin.hide()
        })
    })
  
    powerMonitor.on('suspend', () => {
        console.log('The system is going to sleep');
        worker.close()
        // tray.destroy()
    });
    
    powerMonitor.on('resume', () => {
        console.log('The system is resuming');
        worker = new BrowserWindow({
            show: false,
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
    });
    
    powerMonitor.on('shutdown', () => {
        console.log('The system is Shutting Down');
        if (worker!==null) {
            worker.close()
            worker = null
        }
        // tray.destroy()
    });
    
    powerMonitor.on('lock-screen', () => {
        console.log('The system is about to be locked');
        if (worker!==null) {
            worker.close()
            worker = null
        }
        // tray.destroy()
    });
    
    powerMonitor.on('unlock-screen', () => {
        console.log('The system is unlocked');
        worker = new BrowserWindow({
            show: false,
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
    });
})

ipcMain.on('message-from-scheduler',(event,arg)=>{
    timerWindow.webContents.send('scheduler-to-timer',arg);
});