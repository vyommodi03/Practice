const { Main } = require('electron');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
// const Store = require('electron-settings');

var notifi_tmp = localStorage.getItem('notifi');
var donot_tmp = localStorage.getItem('donot');
var strict_tmp = localStorage.getItem('strict');

// let MainWindow = remote.getCurrentWindow()

console.log("notification=>" , typeof(notifi_tmp), notifi_tmp)
console.log("notification=>" , typeof(donot_tmp), donot_tmp)
console.log("notification=>" , typeof(strict_tmp), strict_tmp)

var notifi=true, donot=false,strict=false;

if(notifi_tmp)
{
    if(notifi_tmp === "true")
    {
        notifi= true;
    }
    else{
        notifi = false;
    }
}
if(donot_tmp)
{
    if(donot_tmp === "true")
    {
        donot= true;
    }
    else{
        donot = false;
    }
}
if(strict_tmp)
{
    if(strict_tmp === "true")
    {
        strict= true;
    }
    else{
        strict = false;
    }
}

function byDefault() {

    if (notifi === true) {
        document.getElementById("notification").setAttribute('checked', 'checked');
    } else {
        document.getElementById("notification").removeAttribute('checked');
    }

    if (donot === true) {
        document.getElementById("doNot").setAttribute('checked', 'checked');
    } else {
        document.getElementById("doNot").removeAttribute('checked');
    }

    if (strict === true) {
        document.getElementById("strictMode").setAttribute('checked', 'checked');
    } else {
        document.getElementById("strictMode").removeAttribute('checked');
    }

}
byDefault();

var notifBtn = document.getElementById("notification");
var doNotBtn = document.getElementById("doNot");
var strictBtn = document.getElementById("strictMode");
var flg = 0;

notifBtn.addEventListener('click', () => {
    notifi = !notifi;
    localStorage.setItem('notifi', notifi);
    // MainWindow.reload();
    ipcRenderer.send('settings has been changed to Main');
})

doNotBtn.addEventListener('click', () => {
    donot = !donot;
    localStorage.setItem('donot', donot);
    // MainWindow.reload();
    ipcRenderer.send('settings has been changed to Main');
})

strictBtn.addEventListener('click', () => {
    strict = !strict;
    localStorage.setItem('strict', strict);
    // MainWindow.reload();
    ipcRenderer.send('settings has been changed to Main');
})