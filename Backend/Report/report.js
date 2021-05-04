let prev_starttime = localStorage.getItem('prev_starttime');
let prev_endtime = localStorage.getItem('prev_endtime');
if(prev_starttime==undefined)
{
  prev_starttime = 0;
}
if(prev_endtime==undefined)
{
  prev_endtime = 0;
}
const Break = {

    totalDuration : prev_endtime-prev_starttime,
    shortBreakSkipped : localStorage.getItem('prev_short_skipped'),
    totalShortBreak : localStorage.getItem('prev_totalshortbreak'),
    shortBreakAttended : 0,
    longBreakSkipped : localStorage.getItem('prev_long_skipped'),
    totalLongBreak : localStorage.getItem('prev_totallongbreak'),
    longBreakAttended : 0
}
if(Break.totalDuration==undefined)
{
    Break.totalDuration = 0;
}
if(Break.shortBreakSkipped==undefined)
{
    Break.shortBreakSkipped = 0;
}
if(Break.totalShortBreak==undefined)
{
    Break.shortBreakAttended = 0;
}
if(Break.longBreakSkipped==undefined)
{
    Break.longBreakSkipped = 0;
}
if(Break.totalLongBreak==undefined)
{
    Break.longBreakAttended = 0;
}
Break.longBreakAttended = Break.totalLongBreak - Break.longBreakSkipped;
Break.shortBreakAttended = Break.totalShortBreak - Break.shortBreakSkipped;

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
