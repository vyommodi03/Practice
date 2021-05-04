const {ipcRenderer} = require("electron")

const skipBtn = document.getElementById("skipBtn")

var strict_flg = false;
if (localStorage.getItem('strict')) {
    let strict_tmp = localStorage.getItem('strict');
    if (strict_tmp==="true") {
        strict_flg = true;
    }
    else {
        strict_flg = false;
    }
}

// skipBtn.innerHTML = strict_flg;

if (strict_flg===true) {
    skipBtn.style.display = "none";
}

skipBtn.addEventListener('click', () => {
    skipBtn.disabled = true;
    let skip_num = 0;
    if (localStorage.getItem('short_skipped')) {
        let skip_tmp = localStorage.getItem('short_skipped');
        skip_num = parseInt(skip_tmp);
    }
    skip_num = skip_num+1;
    localStorage.setItem('short_skipped', skip_num);
    ipcRenderer.send('Break-has-been-skipped')
})