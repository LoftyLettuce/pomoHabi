const logic = (()=>{
  function login(){
    const userInputUI = document.querySelector('#user-id');
    const apiInputUI = document.querySelector('#api-key');
    window.addEventListener('unload', function() {
      const userID = userInputUI.value;
      const apiKey = apiInputUI.value;
      const input = {userID, apiKey};
      browser.storage.local.set({'Input' : JSON.stringify(input)});
    });
    browser.storage.local.get('Input', (result)=>{
      if ('Input' in result){
        const input = JSON.parse(result.Input);
        userInputUI.value = input.userID;
        apiInputUI.value = input.apiKey;
      }
    })
    document.querySelector('button').addEventListener('click', async ()=>{
      const userID = userInputUI.value;
      const apiKey = apiInputUI.value;
      try {
        const getMethod = {
          method: 'GET', 
          mode: 'cors',
          headers: {
            'x-api-user' : userID, 
            'x-api-key' : apiKey,
            "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
          },
        }
        const response = await fetch('https://habitica.com/api/v3/user', getMethod);
        if (!response.ok) { 
          // Handles non-2xx responses (e.g., 404, 500)
          document.querySelector('.console').textContent = `Error: ${response.status} - something wrong with your input:(`;
          return;
        }
        browser.storage.local.set({'userID': JSON.stringify(userID), 'apiKey': JSON.stringify(apiKey)});
        window.location.reload();
      } catch (error) {
        document.querySelector('.console').textContent = `Error: ${error}`;
      }
    })
  }
  function home(){
    //check if time is there
    browser.storage.local.get('Time', (result)=>{
      if ('Time' in result){
        toggleVisibility(inputContainer, 'off');
        //start countdown
        const time = dateFns.parseJSON(result.Time);
        countdown(time);
      }
      else return;
    })
    // Get references to buttons and input field
    const decrementBtn = document.getElementById('decrement');
    const incrementBtn = document.getElementById('increment');
    const inputContainer = document.querySelector('.number-input-wrapper');
    const numberInput = document.querySelector('.number-input-wrapper input');

    // Get reference to note field
    const noteContainer = document.querySelector('.note-wrapper');

    // Event listener for decrement button
    decrementBtn.addEventListener('click', () => {
        let value = parseInt(numberInput.value);
        numberInput.value = value - 1;
    });

    // Event listener for increment button
    incrementBtn.addEventListener('click', () => {
        let value = parseInt(numberInput.value);
        numberInput.value = value + 1;
    });

    // Add event to sync clock with input
    const time = document.querySelector('.time');
    numberInput.addEventListener('input', (e)=>{
      time.textContent = `${e.target.value.padStart(2, '0')}:00`;
    })

    // Create function for reset button
    const resetBtn = document.querySelector('.reset-button');
    let timer;
    resetBtn.addEventListener('click', (e)=>{
      e.target.disabled = true;
      browser.alarms.clear("countdownTimer");
      initClock();
      cleanUp();
    })

    // Add event to start countdown
    document.querySelector('.start-button').addEventListener('click', startTimer);
    function startTimer(e){
      e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 16.5h1.88v5H16.5zm3.13 0v5h1.87v-5zM15 1H9v2h6zm6 12.35c-.64-.22-1.3-.35-2-.35c-3.31 0-6 2.69-6 6c0 1.03.26 2 .71 2.83c-.55.11-1.12.17-1.71.17a9 9 0 0 1 0-18c2.12 0 4.07.74 5.62 2l1.42-1.44c.51.44.96.9 1.41 1.41l-1.42 1.42A8.96 8.96 0 0 1 21 13zM13 7h-2v7h2z"/></svg>';
      toggleVisibility(inputContainer, 'off')
      // Clean everything from the last countdown
      cleanUp();
      //set countdown
      browser.alarms.clear("countdownTimer", (clear)=>{
        if (!clear){
          const session = formatToMinutes(document.querySelector('.time').textContent);
          const goal = dateFns.addMinutes(new Date(), session);
          browser.storage.local.set({'Time': JSON.stringify(goal)});
          countdown(goal);
          browser.runtime.sendMessage({'time': session});
        }
      })
    };

    // Countdown logic
    function countdown(goal){
      // Enable reset button
      resetBtn.disabled = false;
      // Enable note
      const noteInput = document.querySelector('.note-wrapper input');
      const addBtn = document.querySelector('.note-wrapper button');
      toggleVisibility(noteContainer, 'on');
      addBtn.addEventListener('click', ()=>{
        browser.runtime.sendMessage({'note': noteInput.value});
        noteInput.value = '';
      })
      // Update time
      const countDownUI = document.querySelector('.time');
      const startBtn = document.querySelector('.start-button');
      (function updateTime(){
        secondLeft = dateFns.differenceInSeconds(goal, new Date())
        const clock = {
          minute: `${Math.floor(secondLeft/60)}`.padStart(2, '0'),
          second: `${secondLeft%60}`.padStart(2, '0')
        };
        countDownUI.textContent = `${clock.minute}:${clock.second}`;
        if (secondLeft<30){
          startBtn.disabled = true;
        }
        if (secondLeft<=0){
          startBtn.disabled = false;
          initClock();
          cleanUp();
          return;
        };
        timer = setTimeout(updateTime, 1000);
      })();
    }
    function formatToMinutes(s){
      // Split the time string by ':'
      const [minutes, seconds] = s.split(":").map(Number);
      
      // Convert minutes to seconds and add the seconds
      return minutes + Math.round(seconds/60);
    }
    function initClock(){
      toggleVisibility(noteContainer, 'off');
      toggleVisibility(inputContainer, 'on');
      // Refresh time
      document.querySelector('.time').textContent = `${numberInput.value.padStart(2, '0')}:00`;
    }
    function cleanUp(){
      browser.storage.local.remove(['Time', 'Session']);
      clearTimeout(timer); 
    }
    function toggleVisibility(e, s){
      switch (s){
        case 'on':
          e.classList.remove('hide');
          e.setAttribute('tabindex', 0);
          break;
        case 'off':
          e.classList.add('hide');
          e.setAttribute('tabindex', -1);
          break;
      }
    }
  }
  async function reward(){
    const result = await browser.storage.local.get(['userID', 'apiKey']);
    let userID, apiKey;
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
        const infoObject = rewards.reduce((obj ,{id, text, value})=>{
          console.log(id, text, value);
          obj[text] = {id: id, value: value};
          return obj;
        }, {})
        return infoObject;
      }
      async function scoreReward(taskId){
        return errorHandling('Buy reward', `https://habitica.com/api/v3/tasks/${taskId}/score/up`, postMethod);
      }  
      async function getGP(){
        const user = await errorHandling('getGP', 'https://habitica.com/api/v3/user', {
          method: 'GET', 
          mode: 'cors',
          headers: {
            'x-api-user' : userAPI, 
            'x-api-key' : keyAPI,
            "x-client": client,
          }
        });
        const gp = user.data.stats.gp;
        return gp;
      }
      return {getReward, scoreReward, getGP};
    })(userID, apiKey);
    displayGP();
    //Display gp
    async function displayGP(){
      const gpUI = document.querySelector('.gp');
      gpUI.textContent = Math.round(await HabiticaAPI.getGP());
    }
    //Display rewards
    browser.storage.local.get(['userID', 'apiKey', 'Reward'], async (result)=>{
      let rewards;
      if ('Reward' in result){
        rewards = JSON.parse(result.Reward);
        displayRewards();
      }
      else{
        rewards = await HabiticaAPI.getReward();
        browser.storage.local.set({'Reward': JSON.stringify(rewards)});
        displayRewards()
      };
      function displayRewards(){
        if (rewards == undefined){
          browser.storage.local.remove(['Reward']);
        }
        const listUI = document.querySelector('.items');
        Object.keys(rewards).forEach((reward)=>{
          const itemUI = document.createElement('li');
          const btn = document.createElement('button')
          const nameUI = document.createElement('span');
          const priceUI = document.createElement('span');
          btn.classList.add('hvr-sweep-to-right');
          itemUI.classList.add('item');
          nameUI.classList.add('name');
          priceUI.classList.add('coin');
    
          nameUI.textContent =  reward;
          priceUI.textContent = rewards[reward].value;
          btn.append(nameUI, priceUI);
          itemUI.appendChild(btn);
          listUI.append(itemUI);
        })
        listUI.addEventListener('click', async (e)=>{
          if (e.target.tagName === 'BUTTON'){
            const nameUI = e.target.querySelector('.name');
            nameUI.classList.add('hide');
            const name = nameUI.textContent;
            const svg = '<svg class="loading" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"/></svg>';
            nameUI.innerHTML += svg;
            await HabiticaAPI.scoreReward(rewards[name].id);
            nameUI.querySelector('svg').remove();
            nameUI.classList.remove('hide');
            displayGP();
          }
        })
      }
    })
  }
  return {login, home, reward};
})();