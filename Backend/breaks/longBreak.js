const {ipcRenderer} = require("electron")

const skipBtn = document.getElementById("skipBtn")
skipBtn.disabled = false;
skipBtn.style.display = "none";

let tmp_totallongbreak = localStorage.getItem('currtotallongbreak');
let currtotallongbreak = 0;
if(tmp_totallongbreak)
{
    currtotallongbreak = parseInt(tmp_totallongbreak);
}
currtotallongbreak = currtotallongbreak +1;
localStorage.setItem('currtotallongbreak',currtotallongbreak);

skipBtn.style.display = "block";
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

if (strict_flg===true) {
    skipBtn.style.display = "none";
}

skipBtn.addEventListener('click', () => {
    skipBtn.disabled = true;
    skipBtn.style.display = 'none';
    let long_skip_num = 0;
    if (localStorage.getItem('long_skipped')) {
        let long_skip_tmp = localStorage.getItem('long_skipped');
        long_skip_num = parseInt(long_skip_tmp);
    }
    long_skip_num = long_skip_num+1;
    localStorage.setItem('long_skipped', long_skip_num);
    ipcRenderer.send('Break-has-been-skipped')
})