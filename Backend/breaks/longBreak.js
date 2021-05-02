const {ipcRenderer} = require("electron")

const skipBtn = document.getElementById("skipBtn")

var strict_flg = false;
if (window.localStorage.getItem('strict') !== undefined) {
    strict_flg = window.localStorage.getItem('strict');
}

if (strict_flg) {
    skipBtn.style.display = "none";
}

skipBtn.addEventListener('click', () => {
    ipcRenderer.send('Break-has-been-skipped')
})