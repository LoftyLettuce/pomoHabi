/// <reference types="chrome" />
function timer(goal, s){
  let countDownUI = document.querySelector('div');
  s = s-1;
  secondLeft = dateFns.differenceInSeconds(goal, new Date())
  const clock = {
    minute: `${Math.floor(secondLeft/60)}`.padStart(2, '0'),
    second: `${secondLeft%60}`.padStart(2, '0')
  };
  countDownUI.textContent = `${clock.minute} : ${clock.second}`;
  setTimeout(()=>{
    if (s != 0){
      timer(goal, s);
    }
  }, 1000);
}
async function checkTimer(session){
  const result = await browser.storage.local.get('Time');
  if ('Time' in result){
    const savedTime = dateFns.parseJSON(result.Time);
    const now = new Date();
    return {goal: savedTime, timeLeft: dateFns.differenceInSeconds(savedTime, now)};

  }
  else if (!('Time' in result)){
    return {timeLeft:session};
  }
}
async function showTime(session){
  const btn = document.querySelector('button');
  btn.disabled = true;
  document.querySelector('button').disabled = true;
  const result = await checkTimer(session);
  const clock = {
    minute: `${Math.floor(result.timeLeft/60)}`.padStart(2, '0'),
    second: `${result.timeLeft%60}`.padStart(2, '0')
  };
  document.querySelector('div').textContent = `${clock.minute} : ${clock.second}`;
  if (result.timeLeft < session && result.timeLeft > 0){
    timer(result.goal, result.timeLeft);
  }
  else{
    browser.storage.local.remove(['Time', 'Session']);
    btn.disabled = false;
  }
}
window.addEventListener('load', async ()=>{
  browser.storage.local.get('Session', (result)=>{
    if ('Session' in result){
      document.querySelector('input').className = 'hide';
      const session = JSON.parse(result.Session);
      showTime(session*60);
    }
  })
  document.querySelector('button').addEventListener('click', (e)=>{
    const session = Number(document.querySelector('input').value);
    console.log(session);
    e.target.disabled = true;
    const goal = dateFns.addMinutes(new Date(), session);
    browser.storage.local.set({'Session': session});
    browser.storage.local.set({'Time': JSON.stringify(goal)});
    timer(goal, 60*session);
    browser.runtime.sendMessage({'time': session});
  });
})
