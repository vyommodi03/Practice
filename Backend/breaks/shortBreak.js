const {ipcRenderer} = require("electron")

const skipBtn = document.getElementById("skipBtn")

var strict_flg;
if (window.localStorage.getItem('strict') !== undefined) {
    strict_flg = window.localStorage.getItem('strict');
}

// skipBtn.innerHTML = strict_flg;

if (strict_flg===true) {
    skipBtn.style.display = "none";
}

skipBtn.addEventListener('click', () => {
    ipcRenderer.send('Break-has-been-skipped')
})