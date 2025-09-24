/// <reference types="chrome" />
window.addEventListener('load', async ()=>{
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
})
