window.addEventListener('load', async ()=>{
  // html.home();
  let [timerBtn, rewardBtn] = [document.querySelector('.navigate-timer'), document.querySelector('.navigate-reward')];
  timerBtn.addEventListener('click', clickHandler)
  rewardBtn.addEventListener('click', clickHandler)
  timerBtn.click();
  function clickHandler(e){
    const btn = e.target;
    loadPage(btn);
    activeEffect(btn);
  }
  function loadPage(e){
    document.querySelector('.content')?.remove();
    const page = e==timerBtn?'home':'reward';
    html[page]();
    logic[page]();
    window.scrollTo(0, document.body.scrollHeight);  // Scroll to bottom
  }
  function activeEffect(e){
    const navigateBar = [timerBtn, rewardBtn].filter((btn)=>e!=btn);
    e.classList.add('active');
    navigateBar.forEach((btn)=>{
      //Remove active class from all other buttons
      if (btn!=e){
        btn.classList.remove('active');
      }
    })
  }
})
