const html = (()=>{
  function login(){
    // Create the container div
    const loginDiv = document.createElement('div');
    loginDiv.className = 'login';

    // Create the console div
    const consoleDiv = document.createElement('div');
    consoleDiv.className = 'console';
    consoleDiv.textContent = 'Please fill the thing:(';
    loginDiv.appendChild(consoleDiv);

    // Create the label and input for User ID
    const userIdLabel = document.createElement('label');
    userIdLabel.setAttribute('for', 'user-id');
    userIdLabel.textContent = 'User ID: ';
    const userIdInput = document.createElement('input');
    userIdInput.id = 'user-id';
    userIdInput.type = 'text';

    loginDiv.appendChild(userIdLabel);
    loginDiv.appendChild(userIdInput);

    // Create the label and input for API Key
    const apiKeyLabel = document.createElement('label');
    apiKeyLabel.setAttribute('for', 'api-key');
    apiKeyLabel.textContent = 'API Key: ';
    const apiKeyInput = document.createElement('input');
    apiKeyInput.id = 'api-key';
    apiKeyInput.type = 'text';

    loginDiv.appendChild(apiKeyLabel);
    loginDiv.appendChild(apiKeyInput);

    // Create the button with the SVG icon
    const button = document.createElement('button');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z"/>
      </svg>
    `;

    loginDiv.appendChild(button);

    // Append everything to the body (or another parent element)
    document.body.appendChild(loginDiv);
  }
  function navigateBar(){
    // Create the div container
    const navigateBoard = document.createElement('div');
    navigateBoard.classList.add('navigate-board');

    // Create the "Timer" button
    const timerButton = document.createElement('button');
    timerButton.classList.add('navigate-timer');
    timerButton.textContent = 'Timer';

    // Create the "Reward" button
    const rewardButton = document.createElement('button');
    rewardButton.classList.add('navigate-reward');
    rewardButton.textContent = 'Reward';

    // Create the "Logout" button
    const logoutButton = document.createElement('button');
    logoutButton.classList.add('logout');
    logoutButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"/></svg>';
   
    // Append the buttons to the navigateBoard div
    navigateBoard.appendChild(timerButton);
    navigateBoard.appendChild(rewardButton);
    navigateBoard.appendChild(logoutButton);

    // Append the navigateBoard to the body (or any other container you want)
    document.body.appendChild(navigateBoard);
  }
  function home(){
    // Create the main container div
    const pomodoTimer = document.createElement('div');
    pomodoTimer.classList.add('pomodo-timer');
    pomodoTimer.classList.add('content');

    // Create the time display
    const timeDisplay = document.createElement('div');
    timeDisplay.classList.add('time');
    timeDisplay.textContent = '20:00';  // Default time
    pomodoTimer.appendChild(timeDisplay);

    // Create the note wrapper (initially hidden)
    const noteWrapper = document.createElement('div');
    noteWrapper.classList.add('hide', 'note-wrapper');

    // Create the label and input for note
    const noteLabel = document.createElement('label');
    noteLabel.setAttribute('for', 'note');
    const noteInput = document.createElement('input');
    noteInput.setAttribute('type', 'text');
    noteInput.setAttribute('id', 'note');
    noteLabel.textContent = 'Notes: ';
    noteLabel.appendChild(noteInput);

    // Create the add button for note
    const addButton = document.createElement('button');
    addButton.classList.add('add-button');
    addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 10V9l-6-6H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h6v-1.87l8.39-8.39c.44-.44 1-.68 1.61-.74m-7-5.5l5.5 5.5H14zm8.85 9.69l-.98.98l-2.04-2.04l.98-.98c.19-.2.52-.2.72 0l1.32 1.32c.2.2.2.53 0 .72m-3.72-.36l2.04 2.04L15.04 22H13v-2.04z"/></svg>';

    // Append the label, input, and button to the note wrapper
    noteWrapper.appendChild(noteLabel);
    noteWrapper.appendChild(addButton);
    pomodoTimer.appendChild(noteWrapper);

    // Create the number input wrapper
    const numberInputWrapper = document.createElement('div');
    numberInputWrapper.classList.add('number-input-wrapper');

    // Create the label and input for clock
    const clockLabel = document.createElement('label');
    clockLabel.setAttribute('for', 'clock');
    clockLabel.textContent = 'Minute: ';
    const clockInput = document.createElement('input');
    clockInput.setAttribute('type', 'number');
    clockInput.setAttribute('value', '20');
    clockInput.setAttribute('id', 'clock');

    // Create the decrement and increment buttons
    const decrementButton = document.createElement('button');
    decrementButton.classList.add('spinner-button');
    decrementButton.setAttribute('id', 'decrement');
    decrementButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13c.7 0 1.36.13 2 .35V13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42c-.45-.51-.9-.97-1.41-1.41L17.62 6c-1.55-1.26-3.5-2-5.62-2a9 9 0 0 0 0 18c.59 0 1.16-.06 1.71-.17C13.26 21 13 20.03 13 19c0-3.31 2.69-6 6-6m-6 1h-2V7h2zm2-11H9V1h6zm8 15v2h-8v-2z"/></svg>';

    const incrementButton = document.createElement('button');
    incrementButton.classList.add('spinner-button');
    incrementButton.setAttribute('id', 'increment');
    incrementButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3H9V1h6zm-2 16c0 1.03.26 2 .71 2.83c-.55.11-1.12.17-1.71.17a9 9 0 0 1 0-18c2.12 0 4.07.74 5.62 2l1.42-1.44c.51.44.96.9 1.41 1.41l-1.42 1.42A8.96 8.96 0 0 1 21 13v.35c-.64-.22-1.3-.35-2-.35c-3.31 0-6 2.69-6 6m0-12h-2v7h2zm7 11v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/></svg>';

    // Append the label, input, and buttons to the number input wrapper
    numberInputWrapper.appendChild(clockLabel);
    numberInputWrapper.appendChild(clockInput);
    numberInputWrapper.appendChild(decrementButton);
    numberInputWrapper.appendChild(incrementButton);
    pomodoTimer.appendChild(numberInputWrapper);

    // Create the control wrapper
    const controlWrapper = document.createElement('div');
    controlWrapper.classList.add('control');

    // Create the start and reset buttons
    const startButton = document.createElement('button');
    const startIcon = '<svg class="start-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3H9V1h6zm-2 16c0 1.03.26 2 .71 2.83c-.55.11-1.12.17-1.71.17a9 9 0 0 1 0-18c2.12 0 4.07.74 5.62 2l1.42-1.44c.51.44.96.9 1.41 1.41l-1.42 1.42A8.96 8.96 0 0 1 21 13v.35c-.64-.22-1.3-.35-2-.35c-3.31 0-6 2.69-6 6m0-12h-2v7h2zm4 9v6l5-3z"/></svg>';
    const pauseIcon = '<svg class="pause-icon hide" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 16.5h1.88v5H16.5zm3.13 0v5h1.87v-5zM15 1H9v2h6zm6 12.35c-.64-.22-1.3-.35-2-.35c-3.31 0-6 2.69-6 6c0 1.03.26 2 .71 2.83c-.55.11-1.12.17-1.71.17a9 9 0 0 1 0-18c2.12 0 4.07.74 5.62 2l1.42-1.44c.51.44.96.9 1.41 1.41l-1.42 1.42A8.96 8.96 0 0 1 21 13zM13 7h-2v7h2z"/></svg>';
    startButton.classList.add('start-button');
    startButton.innerHTML = `${startIcon}${pauseIcon}`;

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-button');
    resetButton.setAttribute('disabled', 'true');
    resetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3H9V1h6zm-3 15.5c0 1.27.37 2.44 1 3.44c-.33.06-.66.06-1 .06a9 9 0 0 1 0-18c2.12 0 4.07.74 5.62 2l1.42-1.44c.51.44.96.9 1.41 1.41l-1.42 1.42A9.16 9.16 0 0 1 21 12.5a6.5 6.5 0 0 0-9 6M13 7h-2v7h2zm9 11.5v-4l-1.17 1.17A4 4 0 0 0 18 14.5c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.68 0 3.12-1.03 3.71-2.5H20a2.5 2.5 0 1 1-.23-3.27L18 18.5z"/></svg>';

    // Append the buttons to the control wrapper
    controlWrapper.appendChild(startButton);
    controlWrapper.appendChild(resetButton);
    pomodoTimer.appendChild(controlWrapper);

    // Finally, append the entire pomodo timer to the document body (or any other container)
    document.body.appendChild(pomodoTimer);
  }
  function reward(){
    // Create the div for reward shop
    const rewardShop = document.createElement('div');
    rewardShop.classList.add('reward-shop');
    rewardShop.classList.add('content');

    // Create the span for the coin amount
    const coinSpan = document.createElement('span');
    coinSpan.classList.add('coin', 'gp');
    coinSpan.textContent = '-1000';  // Set the coin amount text

    // Create the unordered list (ul) for items
    const itemsList = document.createElement('ul');
    itemsList.classList.add('items');

    // Append the span and ul to the reward-shop div
    rewardShop.appendChild(coinSpan);
    rewardShop.appendChild(itemsList);

    // Finally, append the reward-shop div to the body (or any other parent element)
    document.body.appendChild(rewardShop);
  }
  return {login, navigateBar, home, reward};
})();