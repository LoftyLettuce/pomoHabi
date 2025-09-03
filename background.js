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
  browser.storage.local.get('Task', (result)=>{
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
          await browser.storage.local.set({'Task': JSON.stringify(infoObject)});
        })
      .catch((error)=>console.log(error));
    }
  })
}
async function connectList(){
  browser.storage.local.get('Task', async (result)=>{
    const tasks = JSON.parse(result.Task);
    let checkList = await fetchItems(tasks.daily);
    browser.storage.local.set({'CheckList': JSON.stringify(checkList)})
    switch (checkList.length) {
      case 0:
        checkTask(tasks.habit);
        break;
      case 1:
        checkItem(tasks.daily, checkList[0]);
        checkTask(tasks.daily);
        break;
      default:
        checkItem(tasks.daily, checkList[0]);
        break;
    }
  })
}
function checkItem(taskId, itemId){
  fetch(`https://habitica.com/api/v3/tasks/${taskId}/checklist/${itemId}/score`, {
    method: 'POST', 
    mode: 'cors',
    headers: {
        'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
        'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
        "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
      },
    })
}
function checkTask(taskId){
  fetch(`https://habitica.com/api/v3/tasks/${taskId}/score/up`, {
    method: 'POST', 
    mode: 'cors',
    headers: {
        'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
        'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
        "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
      },
    })
}
browser.runtime.onMessage.addListener((message)=>{
  browser.alarms.create("countdownTimer", {
    delayInMinutes: message.time,
  })
})
browser.alarms.onAlarm.addListener(async ()=>{
  browser.notifications.create({
    type: "basic",
    iconUrl: "48-icon.png",
    title: "Timer done!",
    message: "Well, create another cycle I guest",
    priority: 2,
  });
  browser.storage.local.remove(['Time', 'Session']);
  await connectTask();
  connectList();
})