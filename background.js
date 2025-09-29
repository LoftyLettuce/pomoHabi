browser.runtime.onMessage.addListener(async (message)=>{
  if ('time' in message){
    browser.alarms.create("countdownTimer", {
      delayInMinutes: message.time,
    })
  }
  else{
    let userID, apiKey;
    const result = await browser.storage.local.get(['userID', 'apiKey']);
    if ('userID' in result && 'apiKey' in result){
      userID = JSON.parse(result.userID);
      apiKey = JSON.parse(result.apiKey);
    }
    const HabiticaAPI = ((userAPI, keyAPI)=>{
      const client = '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo';
      const getMethod = {
        method: 'GET', 
        mode: 'cors',
        headers: {
          'x-api-user' : userAPI, 
          'x-api-key' : keyAPI,
          "x-client": client,
        },
      }
      const postMethod = {
        method: 'POST', 
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-api-user' : userAPI, 
          'x-api-key' : keyAPI,
          "x-client": client,
        },
      }
      async function errorHandling(name, url, method){
        try {
          const response = await fetch(`${url}`, method);
          if (!response.ok) { 
            // Handles non-2xx responses (e.g., 404, 500)
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`${name} got fucked:`, error);
          //Show a message to the user
          return {data: []};
        }
      }
      async function getReward(){
        const tasks = await errorHandling('getReward', 'https://habitica.com/api/v3/tasks/user', getMethod);
        const rewards = tasks.data.filter((task)=>task.type=='reward');
        console.log(rewards, tasks);
      }
      async function setTask(note){
        errorHandling('setTask', 'https://habitica.com/api/v3/tasks/user', {
          ...postMethod, 
          body: JSON.stringify({
            "text": "Pomodoro - Task",
            "type": "todo",
            "notes": note,
            "priority": 0.1
          })
        })
      }
    
      return {setTask, getReward};
    })(userID, apiKey);
    if ('note' in message){
      HabiticaAPI.setTask(message.note);
    }
    else if ('getGold' in message){
      HabiticaAPI.getReward();
    }
  }
})
browser.alarms.onAlarm.addListener(async ()=>{
  let userID, apiKey;
  const result = await browser.storage.local.get(['userID', 'apiKey']);
  if ('userID' in result && 'apiKey' in result){
    userID = JSON.parse(result.userID);
    apiKey = JSON.parse(result.apiKey);
  }
  const HabiticaAPI = ((userAPI, keyAPI)=>{
    const client = '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo';
    const getMethod = {
      method: 'GET', 
      mode: 'cors',
      headers: {
        'x-api-user' : userAPI, 
        'x-api-key' : keyAPI,
        "x-client": client,
      },
    }
    const postMethod = {
      method: 'POST', 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'x-api-user' : userAPI, 
        'x-api-key' : keyAPI,
        "x-client": client,
      },
    }
    async function errorHandling(name, url, method){
      try {
        const response = await fetch(`${url}`, method);
        if (!response.ok) { 
          // Handles non-2xx responses (e.g., 404, 500)
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`${name} got fucked:`, error);
        //Show a message to the user
        return {data: []};
      }
    }
    async function getPomodoroTasks(){
      const tasks = await errorHandling('getPomodoroTasks', 'https://habitica.com/api/v3/tasks/user', getMethod);
      const pomodoData = tasks.data.filter((task)=>(task.text=='Overflow'||task.text=='Study'||task.type=='reward'));
      const infoObject = pomodoData.reduce((obj, {id, type, checklist})=>{
        obj[type] = {};
        obj[type]['id'] = id;
        if (type=='daily' && checklist){
          obj[type]['checklist'] = checklist;
        }
        return obj;
      }, {});
      return JSON.stringify(infoObject);
    }
    async function scoreItem({type, taskId, itemId}){
      switch (type){
        case 'reward':
          errorHandling('Buy reward', `https://habitica.com/api/v3/tasks/${taskId}/score/up`, postMethod);
          break;
        case 'item':
          errorHandling('Scoring item', `https://habitica.com/api/v3/tasks/${taskId}/checklist/${itemId}/score`, postMethod);
          break;
        case 'daily':
          errorHandling('Scoring last item', `https://habitica.com/api/v3/tasks/${taskId}/checklist/${itemId}/score`, postMethod);
          errorHandling('Scoring daily', `https://habitica.com/api/v3/tasks/${taskId}/score/up`, postMethod);
          break;
        case 'habit':
          errorHandling('Scoring habit', `https://habitica.com/api/v3/tasks/${taskId}/score/up`, postMethod);
          break;
        default:
          console.log('This type is not existed');
      }
    }
  
    return {getPomodoroTasks, scoreItem};
  })(userID, apiKey);
  browser.notifications.create({
    type: "basic",
    iconUrl: "48-icon.png",
    title: "Timer done!",
    message: "Well, create another cycle I guest",
    priority: 2,
  });
  browser.storage.local.remove(['Time', 'Session']);
  await updateHabiticaItems();
  scorePomodoList();
  async function updateHabiticaItems(){
    const tasks = await HabiticaAPI.getPomodoroTasks();
    try {
      browser.storage.local.set({'Task': tasks});
    } catch (error) {
      console.log(`Browser can't save the tasks: ${error}`);
    }
  }
  async function scorePomodoList(){
    browser.storage.local.get('Task', async (result)=>{
      const tasks = JSON.parse(result.Task);
      const listOfItemsLeft = tasks.daily.checklist.filter((item)=>!item.completed);
      switch (listOfItemsLeft.length) {
        case 0:
          HabiticaAPI.scoreItem({type: 'habit', taskId: tasks.habit.id, itemId: null});
          break;
        case 1:
          HabiticaAPI.scoreItem({type: 'daily', taskId: tasks.daily.id, itemId: listOfItemsLeft[0].id});
          break;
        default:
          HabiticaAPI.scoreItem({type: 'item', taskId: tasks.daily.id, itemId: listOfItemsLeft[0].id});
          break;
      }
    })
  }
})