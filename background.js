async function checkItem(taskId, itemId){
  const response = await fetch(`https://habitica.com/api/v3/tasks/${taskId}/checklist/${itemId}/score`, {
    method: 'POST', 
    mode: 'cors',
    headers: {
        'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
        'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
        "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
      },
    })
}
async function checkTask(taskId){
  const response = await fetch(`https://habitica.com/api/v3/tasks/${taskId}/score/up`, {
    method: 'POST', 
    mode: 'cors',
    headers: {
        'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
        'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
        "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
      },
    })
  const task = await response.json();
  console.log(task);
}
chrome.runtime.onMessage.addListener((message)=>{
  chrome.alarms.create("countdownTimer", {
    delayInMinutes: message.time,
  })
})
chrome.alarms.onAlarm.addListener(()=>{
  chrome.notifications.create({
    type: "basic",
    iconUrl: "48-icon.png",
    title: "Timer done!",
    message: "Well, create another cycle I guest",
    priority: 2,
  });
  chrome.storage.local.remove('Time');
  chrome.storage.local.get(['CheckList', 'Task'], async (result)=>{
    if ('CheckList' in result && 'Task' in result){
      const tasks = JSON.parse(result.Task);
      const checkList = JSON.parse(result.CheckList);
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
    }
  })
})