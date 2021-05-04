const Break = {
    
    totalDuration : localStorage.getItem('a'),
    shortBreakSkipped : localStorage.getItem('b'),
    shortBreakAttended : localStorage.getItem('c'),
    longBreakSkipped : localStorage.getItem('d'),
    longBreakAttended : localStorage.getItem('e')
}
if(Break.totalDuration==undefined)
{
    Break.totalDuration = 0;
}
if(Break.shortBreakSkipped==undefined)
{
    Break.shortBreakSkipped = 0;
}
if(Break.shortBreakAttended==undefined)
{
    Break.shortBreakAttended = 0;
}
if(Break.longBreakSkipped==undefined)
{
    Break.longBreakSkipped = 0;
}
if(Break.longBreakAttended==undefined)
{
    Break.longBreakAttended = 0;
}

function showTotalDuration()
{
    document.getElementById('addTxt1').innerHTML = `${Break.totalDuration}`;
}
function showShortBreakSkipped()
{
    document.getElementById('addTxt2').innerHTML = `${Break.shortBreakSkipped}`;
}
function showShortBreakAttended()
{
    document.getElementById('addTxt3').innerHTML = `${Break.shortBreakAttended}`;
}
function showLongBreakSkipped()
{
    document.getElementById('addTxt4').innerHTML = `${Break.longBreakSkipped}`;
}
function showLongBreakAttended()
{
    document.getElementById('addTxt5').innerHTML = `${Break.longBreakAttended}`;
}

function showPercentageOfShortBreakTime()
{
    
    let totalTime = Break.shortBreakAttended + Break.shortBreakSkipped;
    let breakTime = Break.shortBreakAttended;
    let percentageOfBreakTime = 100;

    if(totalTime!==0)
    percentageOfBreakTime = (breakTime/totalTime)*100;

    percentageOfBreakTime = percentageOfBreakTime.toFixed(2);
    // if(percentageOfBreakTime>=75)
    // {
    //     document.getElementById('addTxt6').value = `Congratulation!! You took ${percentageOfBreakTime}% of short break.`;
    // }
    // else
    // {
    //     document.getElementById('addTxt6').value = `Oops!! You took ${percentageOfBreakTime}% of short break. You should not skip much short break.`;
    // }
    document.getElementById('addTxt6').innerHTML = `${percentageOfBreakTime}%`;
    
}
function showPercentageOfLongBreakTime()
{
    let totalTime = Break.longBreakAttended + Break.longBreakSkipped;
    let breakTime = Break.longBreakAttended;
    let percentageOfBreakTime = 100;

    if(totalTime!==0)
    percentageOfBreakTime = (breakTime/totalTime)*100;

    percentageOfBreakTime = percentageOfBreakTime.toFixed(2);
    // if(percentageOfBreakTime>=75)
    // {
    //     document.getElementById('addTxt7').value = `Congratulation!! You took ${percentageOfBreakTime}% of long break.`;
    // }
    // else
    // {
    //     document.getElementById('addTxt7').value = `Oops!! You took ${percentageOfBreakTime}% of long break. You should not skip much long break.`;
    // }
    document.getElementById('addTxt7').innerHTML = `${percentageOfBreakTime}%`;
}

showTotalDuration();
showShortBreakSkipped();
showShortBreakAttended();
showLongBreakSkipped();
showLongBreakAttended();
showPercentageOfShortBreakTime();
showPercentageOfLongBreakTime();