const { Main } = require('electron');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
// const Store = require('electron-settings');

var notifi = localStorage.getItem('notifi');
var donot = localStorage.getItem('donot');
var strict = localStorage.getItem('strict');
// let MainWindow = remote.getCurrentWindow()


function byDefault() {

    if (notifi === "true") {
        document.getElementById("notification").setAttribute('checked', 'checked');
    } else {
        document.getElementById("notification").removeAttribute('checked');
    }

    if (donot === "true") {
        document.getElementById("doNot").setAttribute('checked', 'checked');
    } else {
        document.getElementById("doNot").removeAttribute('checked');
    }

    if (strict === "true") {
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