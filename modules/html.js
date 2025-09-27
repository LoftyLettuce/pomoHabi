const html = (()=>{
  function home(){
    // Create the main container div
    const pomodoTimer = document.createElement('div');
    pomodoTimer.classList.add('pomodo-timer');

    // Create the time display
    const timeDisplay = document.createElement('div');
    timeDisplay.classList.add('time');
    timeDisplay.textContent = '30:00';  // Default time
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
    addButton.textContent = '+';

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
    clockInput.setAttribute('value', '30');
    clockInput.setAttribute('id', 'clock');

    // Create the decrement and increment buttons
    const decrementButton = document.createElement('button');
    decrementButton.classList.add('spinner-button');
    decrementButton.setAttribute('id', 'decrement');
    decrementButton.textContent = '-';

    const incrementButton = document.createElement('button');
    incrementButton.classList.add('spinner-button');
    incrementButton.setAttribute('id', 'increment');
    incrementButton.textContent = '+';

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
    startButton.classList.add('start-button');
    startButton.textContent = 'start';

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-button');
    resetButton.setAttribute('disabled', 'true');
    resetButton.textContent = 'reset';

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
  return {home, reward};
})();