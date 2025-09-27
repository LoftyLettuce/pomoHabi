const logic = (()=>{
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
      const noteContainer = document.querySelector('.note-wrapper');
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
          toggleVisibility(noteContainer, 'off');
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
  function reward(){
    //Display rewards
    browser.storage.local.get('Reward', async (result)=>{
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
            const name = e.target.querySelector('.name').textContent;
            await HabiticaAPI.scoreReward(rewards[name].id);
            displayGP();
          }
        })
      }
    })
    const HabiticaAPI = ((userAPI, keyAPI)=>{
      const client = `${userAPI}-Pomodo`;
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
          'x-api-user' : '7a9a0dee-b79b-4596-8a77-99ca5efe983c', 
          'x-api-key' : '9b26b414-1935-4d08-af35-827cfe93bf89',
          "x-client": '7a9a0dee-b79b-4596-8a77-99ca5efe983c-Pomodo',
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
    })('7a9a0dee-b79b-4596-8a77-99ca5efe983c', '9b26b414-1935-4d08-af35-827cfe93bf89');
    displayGP();
    //Display gp
    async function displayGP(){
      const gpUI = document.querySelector('.gp');
      gpUI.textContent = Math.round(await HabiticaAPI.getGP());
    }
  }
  return {home, reward};
})();