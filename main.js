/// <reference types="chrome" />
// fetch(`https://habitica.com/api/v3/tasks/user`, {
  //   method: 'GET', 
  //   mode: 'cors',
  //   headers: {
    //     'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
    //     'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
    //     "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
    //   },
    // })
    // .then(async (Response)=>{
      //   const tasks = await Response.json();
      //   const pomodoData = tasks.data.filter((task)=>(task.text=='Overflow'||task.text=='Study'));
      //   console.log(pomodoData);
      // })
      // .catch((error)=>console.log(error));
function timer(goal, s){
  setTimeout(()=>{
    let countDownUI = document.querySelector('div');
    s = s-1;
    secondLeft = dateFns.differenceInSeconds(goal, new Date())
    const clock = {
      minute: `${Math.floor(secondLeft/60)}`.padStart(2, '0'),
      second: `${secondLeft%60}`.padStart(2, '0')
    };
    countDownUI.textContent = `${clock.minute} : ${clock.second}`;
    if (s != 0){
      timer(goal, s);
    }
  }, 1000);
}
async function fetchItems(id){
  const response = await fetch(`https://habitica.com/api/v3/tasks/${id}`, {
    method: 'GET', 
    mode: 'cors',
    headers: {
        'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
        'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
        "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
      },
    })
  const task = await response.json();
  return task.data.checklist.filter((val)=>!val.completed).map((val)=>val.id);
}
async function connectTask(){
  chrome.storage.local.get('Task', (result)=>{
    if (!('Task' in result)){
      fetch(`https://habitica.com/api/v3/tasks/user`, {
        method: 'GET', 
        mode: 'cors',
        headers: {
            'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
            'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
            "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
          },
        })
      .then(async (Response)=>{
          const tasks = await Response.json();
          const pomodoData = tasks.data.filter((task)=>(task.text=='Overflow'||task.text=='Study'));
          let infoObject = {};
          pomodoData.forEach((val) => {
            infoObject[val.type] = val.id;
          });
          chrome.storage.local.set({'Task': JSON.stringify(infoObject)});
        })
      .catch((error)=>console.log(error));
    }
  })
}
function connectList(){
  chrome.storage.local.get('Task', async (result)=>{
    const task = JSON.parse(result.Task);
    let checkList = await fetchItems(task.daily);
    chrome.storage.local.set({'CheckList': JSON.stringify(checkList)})
  })
}
async function checkTimer(){
  const result = await chrome.storage.local.get('Time');
  if ('Time' in result){
    const savedTime = dateFns.parseJSON(result.Time);
    const now = new Date();
    return {goal: savedTime, timeLeft: dateFns.differenceInSeconds(savedTime, now)};

  }
  else if (!('Time' in result)){
    return {timeLeft:60};
  }
}
async function showTime(){
  const btn = document.querySelector('button');
  btn.disabled = true;
  document.querySelector('button').disabled = true;
  const result = await checkTimer();
  const clock = {
    minute: `${Math.floor(result.timeLeft/60)}`.padStart(2, '0'),
    second: `${result.timeLeft%60}`.padStart(2, '0')
  };
  document.querySelector('div').textContent = `${clock.minute} : ${clock.second}`;
  if (result.timeLeft < 60 && result.timeLeft > 0){
    timer(result.goal, result.timeLeft);
  }
  else{
    btn.disabled = false;
  }
}
window.addEventListener('load', async ()=>{
  connectTask().then(()=>{connectList()});
  showTime();
  const session = 1;
  document.querySelector('button').addEventListener('click', (e)=>{
    e.target.disabled = true;
    const goal = dateFns.addMinutes(new Date(), session)
    chrome.storage.local.set({'Time': JSON.stringify(goal)});
    timer(goal, 60*session);
    chrome.runtime.sendMessage({'time': session});
  });
})
